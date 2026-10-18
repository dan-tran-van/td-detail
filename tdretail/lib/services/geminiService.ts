import { GoogleGenAI } from '@google/genai';
import { TDStore } from '@/lib/firebase/store';
import { OrderService } from '@/lib/services/orderService';
import {
  Conversation,
  Customer,
  Merchant,
  Message,
  ToolCallExecution,
} from '@/lib/types';

export interface ProcessMessageParams {
  conversation: Conversation;
  customerMessage: string;
  customer: Customer;
}

export class GeminiAgentService {
  private static getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Main entry point to process an incoming customer message.
   * Leverages Gemini 2.5 Flash with server-side tools or intelligent fallback.
   */
  static async processMessage(params: ProcessMessageParams): Promise<Message> {
    const { conversation, customerMessage, customer } = params;

    const merchant = await TDStore.getMerchantById(conversation.merchantId);
    const merchantName = merchant ? merchant.name : 'TD Retail Merchant';
    const client = this.getGeminiClient();

    // Fetch conversation history for full context
    const history = await TDStore.getMessages(conversation.id);

    // If Gemini API Key is available, use real Gemini SDK with function calling
    if (client) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 12s')), 12000)
        );

        return await Promise.race([
          this.executeGeminiWithTools({
            client,
            conversation,
            merchant,
            customer,
            customerMessage,
            history,
          }),
          timeoutPromise,
        ]);
      } catch (error) {
        console.error('[GeminiAgent] Error invoking Gemini API, falling back to server-side grounded engine:', error);
      }
    }

    // Grounded Fallback Engine (no external API key needed)
    return await this.executeGroundedFallbackEngine({
      conversation,
      merchant,
      customer,
      customerMessage,
      history,
    });
  }

  /**
   * Real Google Gemini SDK Tool-Calling Loop
   */
  private static async executeGeminiWithTools(context: {
    client: GoogleGenAI;
    conversation: Conversation;
    merchant: any;
    customer: Customer;
    customerMessage: string;
    history: Message[];
  }): Promise<Message> {
    const { client, conversation, merchant, customer, customerMessage, history } = context;

    const systemPrompt = `You are the official AI Support Specialist for "${merchant.name}" on the TD Retail Shared Customer Support Platform.
Merchant Category: ${merchant.category}
Support Policy:
- Returns: ${merchant.supportPolicy.returns}
- Refunds: ${merchant.supportPolicy.refunds}
- Delivery/Fulfillment: ${merchant.supportPolicy.deliveryOrDownload}
- Escalation Threshold: ${merchant.supportPolicy.escalationThreshold}
- Support Email: ${merchant.supportEmail}

Customer Profile:
- Name: ${customer.name}
- Email: ${customer.email}
- Current Merchant ID: ${conversation.merchantId}
- Current Thread Order Reference: ${conversation.orderId || 'None specified'}
- Current Thread Status: ${conversation.status}${conversation.status === 'escalated' ? ' (Escalated to human support specialists)' : ''}

CRITICAL RULES:
1. GROUNDED FACTUALITY: NEVER hallucinate, guess, or invent order statuses, tracking numbers, download keys, or courier positions.
2. TOOL USAGE: If the customer mentions or asks about an order (e.g., status, tracking, download link, arrival time), you MUST call the "lookupOrderStatus" tool.
3. GENERAL MERCHANT CUSTOMER SUPPORT: Confidently answer general customer support questions relating to "${merchant.name}", such as store policies, fulfillment timelines, return/exchange steps, warranty procedures, and digital licensing or product guidance. Do not force customers to provide an Order ID if they are asking general questions about policies or store offerings.
4. FINANCIAL & REFUND GUARDRAILS:
   - You CANNOT initiate financial transactions, transfer money, or execute credit card refunds directly within the chat.
   - Strictly quote and adhere to the merchant's ground-truth refund and return policies.
   - NO MEDIA UPLOADS IN CHAT: The chat interface does not accept image, video, or file uploads. If a customer needs to provide photographic proof, receipts, or inspection media for a damaged, defective, or incorrect item, explicitly instruct them to email their attachments directly to "${merchant.supportEmail}" along with their Order ID.
   - If a customer disputes a refund, requests exceptions beyond policy, or insists on financial reimbursement, invoke the "requestHumanEscalation" tool.
5. AUTHORIZATION: You are strictly scoped to "${merchant.name}". The server will reject orders belonging to other merchants.
6. HUMAN SPECIALIST COOPERATION: Human specialists from "${merchant.name}" may participate in this thread. When a turn begins with "[Human Support Specialist...]", treat their answers and approvals as authoritative ground truth and cooperate with their decisions.
7. HUMAN ESCALATION: If the customer asks to speak with a human, or if their issue exceeds the automated refund policy, you MUST call "requestHumanEscalation".
8. MARKDOWN FORMATTING: Always format your responses using clean Markdown. When presenting lists, items, or summaries, ALWAYS use standard Markdown bullet points ('*' or '-') with each item on its own new line. Never use raw unicode bullet symbols like '•'. Use double newlines between paragraphs and headers for clear spacing.
9. Be warm, professional, concise, and helpful.`;

    const toolDeclarations = [
      {
        name: 'lookupOrderStatus',
        description: 'Looks up official verified order information including status, items, delivery ETA, download links, and courier notes for the current customer.',
        parameters: {
          type: 'OBJECT',
          properties: {
            orderId: {
              type: 'STRING',
              description: 'The order identifier, e.g. ORD-MUS-8821 or ORD-GROC-5512',
            },
          },
          required: ['orderId'],
        },
      },
      {
        name: 'requestHumanEscalation',
        description: 'Escalates this conversation to a human support agent when the issue cannot be automated or when the user requests a human.',
        parameters: {
          type: 'OBJECT',
          properties: {
            reason: {
              type: 'STRING',
              description: 'Specific reason for the escalation',
            },
          },
          required: ['reason'],
        },
      },
    ];

    // Format chat contents - exclude the current incoming message if already saved to history
    // and exclude system audit messages (which should not be sent as Gemini model turns)
    const validHistory = history.filter((m) => m.sender !== 'system');
    const prevHistory = validHistory.filter(
      (m, idx) => !(idx === validHistory.length - 1 && m.sender === 'customer' && m.content === customerMessage)
    );

    const rawTurns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Include last 8 turns of valid conversation
    for (const msg of prevHistory.slice(-8)) {
      if (!msg.content || !msg.content.trim()) continue;
      const role = msg.sender === 'customer' ? 'user' : 'model';
      let text = msg.content.trim();
      if (msg.sender === 'human_agent') {
        text = `[Human Support Specialist (${msg.senderName || 'Staff'})]: ${text}`;
      }
      rawTurns.push({
        role,
        parts: [{ text }],
      });
    }

    rawTurns.push({
      role: 'user',
      parts: [{ text: customerMessage.trim() }],
    });

    // Enforce strictly alternating turns invariant: user -> model -> user -> model -> ...
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const turn of rawTurns) {
      if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
        // Merge consecutive turns with the same role into a single turn
        const lastTurn = contents[contents.length - 1];
        lastTurn.parts[0].text = `${lastTurn.parts[0].text}\n\n${turn.parts[0].text}`;
      } else {
        contents.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
      }
    }

    // Ensure contents starts with a 'user' turn (Gemini requirement)
    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    // If contents became empty, add the customer message
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: customerMessage.trim() }],
      });
    }

    const toolCallsRecord: ToolCallExecution[] = [];
    let groundedOrderId: string | undefined;
    let groundedOrderStatus: string | undefined;
    let groundedOrder: any = undefined;
    let escalationTriggered = false;

    // Use gemini-3.5-flash-lite which has generous quota and full function calling support
    const MODEL_NAME = 'gemini-3.5-flash-lite';

    // First call to Gemini
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: toolDeclarations as any }],
      },
    });

    const candidates = response.candidates || [];
    const firstCandidate = candidates[0];
    const functionCalls = firstCandidate?.content?.parts?.filter((p: any) => p.functionCall)?.map((p: any) => p.functionCall) || [];

    let finalContent = '';

    if (functionCalls.length > 0) {
      // Execute each tool call server-side
      const functionResponseParts: any[] = [];

      for (const fc of functionCalls) {
        if (fc.name === 'lookupOrderStatus') {
          const rawOrderId = (fc.args?.orderId as string) || conversation.orderId || '';
          const result = await OrderService.lookupOrderStatus({
            orderId: rawOrderId,
            merchantId: conversation.merchantId,
            customerId: customer.id,
            customerEmail: customer.email,
          });

          toolCallsRecord.push({
            name: 'lookupOrderStatus',
            arguments: fc.args,
            result: result as unknown as Record<string, unknown>,
            executedAt: new Date().toISOString(),
          });

          if (result.success && result.order) {
            groundedOrderId = result.order.orderId;
            groundedOrderStatus = result.order.orderStatus;
            groundedOrder = result.order;
          }

          functionResponseParts.push({
            functionResponse: {
              name: 'lookupOrderStatus',
              response: result,
              id: fc.id,
            },
          });
        } else if (fc.name === 'requestHumanEscalation') {
          const reason = (fc.args?.reason as string) || 'Customer requested human assistance';
          await TDStore.updateConversation(conversation.id, {
            status: 'escalated',
            escalationReason: reason,
          });
          escalationTriggered = true;

          toolCallsRecord.push({
            name: 'requestHumanEscalation',
            arguments: fc.args,
            result: { status: 'escalated', reason },
            executedAt: new Date().toISOString(),
          });

          functionResponseParts.push({
            functionResponse: {
              name: 'requestHumanEscalation',
              response: { status: 'success', message: 'Escalation recorded in system.' },
              id: fc.id,
            },
          });
        }
      }

      // Sanitize model candidate parts: keep functionCall and text parts
      const modelParts = firstCandidate?.content?.parts
        ? firstCandidate.content.parts.filter((p: any) => p.functionCall || p.text)
        : [];

      // Feed function responses back into Gemini with proper tool role
      const followupContents: any[] = [
        ...contents,
        {
          role: 'model',
          parts: modelParts.length > 0 ? modelParts : firstCandidate?.content?.parts || [],
        },
        {
          role: 'tool',
          parts: functionResponseParts,
        },
      ];

      try {
        const followupResponse = await client.models.generateContent({
          model: MODEL_NAME,
          contents: followupContents,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        const followupCandidate = followupResponse.candidates?.[0];
        const textParts = followupCandidate?.content?.parts?.filter((p: any) => p.text)?.map((p: any) => p.text).join('\n') || '';
        finalContent = followupResponse.text || textParts;
      } catch (followupErr) {
        console.warn('[GeminiAgent] Followup call with tool response encountered error, using grounded formatter:', followupErr);
      }

      if (!finalContent) {
        if (groundedOrder) {
          finalContent = this.formatDynamicOrderResponse({
            merchant,
            customer,
            order: groundedOrder,
            customerMessage,
          });
        } else if (escalationTriggered) {
          finalContent = `I have escalated this issue to a senior support representative for **${merchant.name}**. They will review your conversation and follow up shortly!`;
        } else {
          finalContent = this.formatDynamicPolicyResponse({
            merchant,
            customer,
            customerMessage,
          });
        }
      }
    } else {
      const firstTextParts = firstCandidate?.content?.parts?.filter((p: any) => p.text)?.map((p: any) => p.text).join('\n') || '';
      finalContent = response.text || firstTextParts || "Thank you for reaching out. How can I assist you today?";
    }

    const aiMessage: Message = {
      id: `msg_ai_${crypto.randomUUID()}`,
      conversationId: conversation.id,
      sender: 'ai',
      senderName: `${merchant.name} Gemini AI`,
      content: finalContent,
      metadata: {
        isAiGrounded: toolCallsRecord.length > 0,
        modelName: MODEL_NAME,
        toolCalls: toolCallsRecord,
        groundedOrderId,
        groundedOrderStatus,
        escalationTriggered,
      },
      timestamp: new Date().toISOString(),
    };

    await TDStore.addMessage(aiMessage);
    return aiMessage;
  }

  /**
   * Deterministic Grounded Support Engine (Fallback if GEMINI_API_KEY is not set)
   * Follows the exact same tool authorization and grounding schema.
   */
  private static async executeGroundedFallbackEngine(context: {
    conversation: Conversation;
    merchant: any;
    customer: Customer;
    customerMessage: string;
    history: Message[];
  }): Promise<Message> {
    const { conversation, merchant, customer, customerMessage } = context;
    const lowerMsg = customerMessage.toLowerCase();

    // Check for explicit escalation request
    const wantsHuman =
      lowerMsg.includes('human') ||
      lowerMsg.includes('agent') ||
      lowerMsg.includes('representative') ||
      lowerMsg.includes('speak to someone') ||
      lowerMsg.includes('escalate') ||
      lowerMsg.includes('supervisor');

    if (wantsHuman) {
      const reason = 'Customer explicitly requested live human support';
      await TDStore.updateConversation(conversation.id, {
        status: 'escalated',
        escalationReason: reason,
      });

      const escalationToolCall: ToolCallExecution = {
        name: 'requestHumanEscalation',
        arguments: { reason },
        result: { status: 'escalated', ticketId: conversation.id, priority: 'high' },
        executedAt: new Date().toISOString(),
      };

      const aiMsg: Message = {
        id: `msg_ai_${crypto.randomUUID()}`,
        conversationId: conversation.id,
        sender: 'ai',
        senderName: `${merchant.name} Gemini Assistant`,
        content: `I have transferred this conversation to a senior **${merchant.name} Support Specialist**. A team member has been notified and will review your thread shortly. You will also receive their reply directly via your registered email (${customer.email}).`,
        metadata: {
          isAiGrounded: true,
          modelName: 'grounded-fallback-engine',
          escalationTriggered: true,
          toolCalls: [escalationToolCall],
        },
        timestamp: new Date().toISOString(),
      };

      await TDStore.addMessage(aiMsg);
      return aiMsg;
    }

    // Check for Refund or Return requests
    const isRefundQuery =
      lowerMsg.includes('refund') ||
      lowerMsg.includes('money back') ||
      lowerMsg.includes('cancel order') ||
      lowerMsg.includes('return') ||
      lowerMsg.includes('chargeback') ||
      lowerMsg.includes('damaged') ||
      lowerMsg.includes('defective') ||
      lowerMsg.includes('broken') ||
      lowerMsg.includes('faulty');

    if (isRefundQuery) {
      const refundPolicyText = this.formatDynamicPolicyResponse({
        merchant,
        customer,
        customerMessage,
      });

      const aiMsg: Message = {
        id: `msg_ai_${crypto.randomUUID()}`,
        conversationId: conversation.id,
        sender: 'ai',
        senderName: `${merchant.name} Gemini Assistant`,
        content: refundPolicyText,
        metadata: {
          isAiGrounded: true,
          modelName: 'grounded-fallback-engine',
        },
        timestamp: new Date().toISOString(),
      };

      await TDStore.addMessage(aiMsg);
      return aiMsg;
    }

    // Extract Order ID if present in message or if the query specifically asks about order status
    const orderMatch = customerMessage.match(/ORD-[A-Z]+-\d+/i);
    const isOrderQuery =
      orderMatch !== null ||
      lowerMsg.includes('order') ||
      lowerMsg.includes('status') ||
      lowerMsg.includes('track') ||
      lowerMsg.includes('delivery') ||
      lowerMsg.includes('download') ||
      lowerMsg.includes('license') ||
      lowerMsg.includes('where is');

    const orderIdToLookup = orderMatch ? orderMatch[0].toUpperCase() : (isOrderQuery ? conversation.orderId : undefined);

    if (orderIdToLookup) {
      // Execute server-side tool with strict multi-merchant boundary verification
      const lookupResult = await OrderService.lookupOrderStatus({
        orderId: orderIdToLookup,
        merchantId: conversation.merchantId,
        customerId: customer.id,
        customerEmail: customer.email,
      });

      const toolCall: ToolCallExecution = {
        name: 'lookupOrderStatus',
        arguments: { orderId: orderIdToLookup },
        result: lookupResult as unknown as Record<string, unknown>,
        executedAt: new Date().toISOString(),
      };

      if (!lookupResult.success || !lookupResult.order) {
        // Safe rejection response
        const errorContent = `I checked our order database for **${orderIdToLookup}**: ${lookupResult.error}`;
        const aiMsg: Message = {
          id: `msg_ai_${crypto.randomUUID()}`,
          conversationId: conversation.id,
          sender: 'ai',
          senderName: `${merchant.name} Gemini Assistant`,
          content: errorContent,
          metadata: {
            isAiGrounded: true,
            modelName: 'gemini-3.5-flash-lite (server-grounded fallback)',
            toolCalls: [toolCall],
          },
          timestamp: new Date().toISOString(),
        };
        await TDStore.addMessage(aiMsg);
        return aiMsg;
      }

      // Grounded success response dynamically tailored from merchant policy & verified order
      const o = lookupResult.order;
      const replyContent = this.formatDynamicOrderResponse({
        merchant,
        customer,
        order: o,
        customerMessage,
      });

      const aiMsg: Message = {
        id: `msg_ai_${crypto.randomUUID()}`,
        conversationId: conversation.id,
        sender: 'ai',
        senderName: `${merchant.name} Gemini Assistant`,
        content: replyContent,
        metadata: {
          isAiGrounded: true,
          modelName: 'gemini-3.5-flash-lite (server-grounded fallback)',
          groundedOrderId: o.orderId,
          groundedOrderStatus: o.orderStatus,
          toolCalls: [toolCall],
        },
        timestamp: new Date().toISOString(),
      };

      await TDStore.addMessage(aiMsg);
      return aiMsg;
    }

    // General merchant assistance (policy, greetings, inquiries)
    const generalReply = this.formatDynamicPolicyResponse({
      merchant,
      customer,
      customerMessage,
    });

    const aiMsg: Message = {
      id: `msg_ai_${crypto.randomUUID()}`,
      conversationId: conversation.id,
      sender: 'ai',
      senderName: `${merchant.name} Gemini Assistant`,
      content: generalReply,
      metadata: {
        isAiGrounded: false,
        modelName: 'gemini-3.5-flash-lite (server-grounded fallback)',
      },
      timestamp: new Date().toISOString(),
    };

    await TDStore.addMessage(aiMsg);
    return aiMsg;
  }

  /**
   * Dynamically formats a verified order response for ANY merchant based on their
   * configured SupportPolicy and real-time order state, without hardcoded categories.
   */
  private static formatDynamicOrderResponse(params: {
    merchant: Merchant;
    customer: Customer;
    order: any;
    customerMessage: string;
  }): string {
    const { merchant, customer, order, customerMessage } = params;
    const lowerMsg = customerMessage.toLowerCase();
    const isRefundOrCancel = Boolean(lowerMsg.match(/refund|cancel|return|money back|chargeback/i));
    const isShippingOrEta = Boolean(lowerMsg.match(/track|courier|delivery|where is|eta|arrive|ship/i));

    const lines: string[] = [
      `I have verified the official order details for **#${order.orderId}** with **${merchant.name}**:`,
      '',
      `* **Order Status:** ${order.orderStatusDisplay || order.orderStatus}`,
    ];

    if (order.items && order.items.length > 0) {
      const itemsList = order.items
        .map((i: any) => `${i.title} (${i.quantity}x${i.formatOrWeight ? ` • ${i.formatOrWeight}` : ''})`)
        .join(', ');
      lines.push(`* **Items:** ${itemsList}`);

      // Digital fulfillments if present
      const digitalItems = order.items.filter((i: any) => i.licenseKey || i.downloadUrl);
      for (const d of digitalItems) {
        if (d.licenseKey) {
          lines.push(`* **License Key (${d.title}):** \`${d.licenseKey}\``);
        }
        if (d.downloadUrl) {
          lines.push(`* **Direct Vault Download (${d.title}):** [Download Link](${d.downloadUrl})`);
        }
      }
    }

    if (order.totalAmount !== undefined && order.totalAmount !== null) {
      const symbol = order.currency === 'INR' ? '₹' : order.currency === 'EUR' ? '€' : order.currency === 'GBP' ? '£' : '$';
      lines.push(`* **Total Amount:** ${symbol}${Number(order.totalAmount).toLocaleString()} ${order.currency || ''}`.trim());
    }

    if (order.trackingNumber) {
      lines.push(`* **Tracking Number:** \`${order.trackingNumber}\``);
    }

    if (order.carrierOrCourier) {
      lines.push(`* **Carrier / Logistics:** ${order.carrierOrCourier}`);
    }

    if (order.estimatedDelivery) {
      lines.push(`* **Estimated Delivery:** ${order.estimatedDelivery}`);
    }

    if (order.deliveryAddress) {
      lines.push(`* **Delivery Destination:** ${order.deliveryAddress}`);
    }

    if (order.courierNotes) {
      lines.push(`* **Fulfillment & Warranty Notes:** ${order.courierNotes}`);
    }

    lines.push('');

    // Dynamically integrate merchant's real policy depending on customer inquiry
    if (isRefundOrCancel) {
      lines.push(`**${merchant.name} Refund & Cancellation Policy:**`);
      if (merchant.supportPolicy?.refunds) {
        lines.push(`* **Refunds:** ${merchant.supportPolicy.refunds}`);
      }
      if (merchant.supportPolicy?.returns) {
        lines.push(`* **Returns:** ${merchant.supportPolicy.returns}`);
      }
      if (merchant.supportPolicy?.escalationThreshold) {
        lines.push(`* **Escalation Priority:** ${merchant.supportPolicy.escalationThreshold}`);
      }
      lines.push('');
      lines.push(`**Important Notice Regarding Financial Claims & Evidence:**`);
      lines.push(`* For security and compliance, direct money transfers or automated refunds cannot be executed directly within chat.`);
      lines.push(`* Our chat system does not accept photo or video file uploads. If your refund request is due to a damaged, defective, or incorrect item, please email your photos/videos and proof of purchase directly to **${merchant.supportEmail}** with Order ID \`#${order.orderId}\`.`);
      lines.push('');
      lines.push(`If you would like to proceed with a formal return, cancellation, or human specialist review, please let me know or click "Request Human Assistance" and our team will assist you immediately!`);
    } else if (isShippingOrEta && merchant.supportPolicy?.deliveryOrDownload) {
      lines.push(`**Fulfillment Policy:** ${merchant.supportPolicy.deliveryOrDownload}`);
      lines.push('');
      lines.push(`Let me know if you would like me to connect you with a specialist or if you need any other assistance with this shipment!`);
    } else {
      lines.push(`Please let me know if you need any additional assistance or would like to speak with a human support specialist!`);
    }

    return lines.join('\n');
  }

  /**
   * Dynamically formats a merchant policy response for ANY merchant based on their
   * configured SupportPolicy (returns, refunds, delivery, escalation threshold).
   */
  private static formatDynamicPolicyResponse(params: {
    merchant: Merchant;
    customer: Customer;
    customerMessage: string;
  }): string {
    const { merchant, customer, customerMessage } = params;
    const lowerMsg = customerMessage.toLowerCase();
    const isRefund = Boolean(lowerMsg.match(/refund|cancel|return|money back|chargeback|damage|defect|broken|faulty/i));
    const isShipping = Boolean(lowerMsg.match(/ship|deliver|track|arrive|eta|courier|dispatch/i));
    const isWarranty = Boolean(lowerMsg.match(/warranty|guarantee|repair|replacement/i));

    if (isRefund) {
      const parts = [
        `Regarding refunds, cancellations, and returns for **${merchant.name}**:`,
        '',
        `* **Refund Policy:** ${merchant.supportPolicy?.refunds || 'Refund requests are subject to merchant review.'}`,
        `* **Returns Policy:** ${merchant.supportPolicy?.returns || 'Please contact support with order details for returns.'}`,
      ];
      if (merchant.supportPolicy?.escalationThreshold) {
        parts.push(`* **Escalation Priority:** ${merchant.supportPolicy.escalationThreshold}`);
      }
      parts.push('');
      parts.push(`**Financial & Evidence Submission Guidelines:**`);
      parts.push(`* Financial transactions or automatic credit card refunds cannot be processed directly inside this chat window.`);
      parts.push(`* Our chat system does not accept direct photo, video, or receipt uploads. If you are reporting a damaged, defective, or incorrect product, please email your photo evidence directly to **${merchant.supportEmail}** referencing your Order ID.`);
      parts.push('');
      parts.push(`To proceed with a refund or cancellation review, please provide your **Order ID** or click "Request Human Assistance" to speak with a senior specialist.`);
      return parts.join('\n');
    }

    if (isShipping) {
      return [
        `Here is the fulfillment and delivery information for **${merchant.name}**:`,
        '',
        `* **Delivery & Fulfillment:** ${merchant.supportPolicy?.deliveryOrDownload || 'Standard fulfillment applies.'}`,
        `* **Support Contact:** ${merchant.supportEmail}`,
        '',
        `If you have an active order, please provide your **Order ID** (such as \`#ORD-...\`) and I will look up real-time carrier tracking, delivery ETA, and fulfillment notes for you.`,
      ].join('\n');
    }

    if (isWarranty) {
      return [
        `Here is the warranty and coverage information for **${merchant.name}**:`,
        '',
        `* **Warranty & Returns:** ${merchant.supportPolicy?.returns || 'Standard return and warranty guidelines apply.'}`,
        `* **Claims Process:** If you require warranty assistance or replacement parts, please email our support team at **${merchant.supportEmail}** with your purchase receipt and product details. (Note that chat does not accept direct file uploads).`,
        '',
        `Feel free to provide your **Order ID** if you would like me to check your purchase date and coverage status!`,
      ].join('\n');
    }

    // General merchant assistance (greetings, policies, contact)
    return [
      `Hello ${customer.name}! I am your AI Customer Support Specialist for **${merchant.name}**.`,
      '',
      `I can help answer questions regarding our store policies, fulfillment timelines, warranty procedures, or look up your order status:`,
      '',
      `* **Returns:** ${merchant.supportPolicy?.returns || 'Standard return policy applies.'}`,
      `* **Refunds:** ${merchant.supportPolicy?.refunds || 'Standard refund policy applies.'}`,
      `* **Fulfillment:** ${merchant.supportPolicy?.deliveryOrDownload || 'Standard fulfillment applies.'}`,
      `* **Direct Support Email:** ${merchant.supportEmail}`,
      '',
      `Feel free to ask any question regarding our products and policies, or provide your Order ID (such as \`#ORD-...\`) to check your shipment!`,
    ].join('\n');
  }
}
