import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sgMail from '@sendgrid/mail';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env.local parser without external dependency
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'support@example.com';
const toEmail = process.argv[2] || fromEmail;
const domain = fromEmail.includes('@') ? fromEmail.split('@')[1] : 'configured domain';

console.log('--- SendGrid Verification Test ---');
console.log('From Email:', fromEmail);
console.log('To Email:', toEmail);
console.log('API Key configured:', Boolean(apiKey && apiKey.startsWith('SG.')));

if (!apiKey || !apiKey.startsWith('SG.')) {
  console.error('Error: SENDGRID_API_KEY is missing or invalid in .env.local');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

const msg = {
  to: toEmail,
  from: {
    name: 'TD Retail Platform',
    email: fromEmail,
  },
  subject: `TD Retail Support Verification [${new Date().toLocaleTimeString()}]`,
  text: 'Hello from TD Retail! This test confirms that your SendGrid domain authentication and API key are configured correctly.',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">TD Retail Support Verification</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">
        Congratulations! Your SendGrid domain authentication for <strong>${domain}</strong> and your API key are operating successfully.
      </p>
      <div style="background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-family: monospace;">
        Sender: ${fromEmail}<br/>
        Recipient: ${toEmail}<br/>
        Timestamp: ${new Date().toISOString()}
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
        TD Retail Shared Customer Support & Gemini Agent Platform
      </p>
    </div>
  `,
};

console.log('\nSending test email via SendGrid API...');

try {
  const [response] = await sgMail.send(msg);
  console.log('Result Status Code:', response.statusCode);
  if (response.statusCode === 202 || response.statusCode === 200) {
    console.log('SUCCESS: Email accepted by SendGrid for delivery to:', toEmail);
  } else {
    console.log('Response:', response.headers);
  }
} catch (error) {
  console.error('FAILED to send email.');
  if (error.response) {
    console.error('SendGrid Status:', error.response.status);
    console.error('SendGrid Body:', JSON.stringify(error.response.body, null, 2));
  } else {
    console.error('Error:', error.message || error);
  }
  process.exit(1);
}
