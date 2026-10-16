"use client";

import React, { createContext, useContext, useState } from "react";
import { MerchantId } from "@/types";

interface ChatContextType {
  isOpen: boolean;
  activeMerchantId: MerchantId;
  activeOrderId?: string;
  initialMessage?: string;
  openChat: (params: {
    merchantId: MerchantId;
    orderId?: string;
    initialMessage?: string;
  }) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMerchantId, setActiveMerchantId] =
    useState<MerchantId>("merchant_a");
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>(
    undefined
  );
  const [initialMessage, setInitialMessage] = useState<string | undefined>(
    undefined
  );

  const openChat = (params: {
    merchantId: MerchantId;
    orderId?: string;
    initialMessage?: string;
  }) => {
    setActiveMerchantId(params.merchantId);
    setActiveOrderId(params.orderId);
    setInitialMessage(params.initialMessage);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        activeMerchantId,
        activeOrderId,
        initialMessage,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
