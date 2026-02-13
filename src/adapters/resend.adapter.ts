import { Resend } from 'resend';

export interface EmailPayload {
  to: string;
  itemName: string;
  githubLogin: string;
}

export interface EmailResponse {
  success: boolean;
  error?: unknown;
}

export class ResendAdapter {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
  }

  async sendPurchaseConfirmation(payload: EmailPayload): Promise<EmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
          console.warn("RESEND_API_KEY not set, skipping email");
          return { success: true }; // Treat as success in dev/test without key
      }

      const { error } = await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Default Resend sender for testing
        to: [payload.to],
        subject: 'Purchase Confirmation - GitHub Shoppers',
        html: `
          <h1>Purchase Confirmed!</h1>
          <p>Hello,</p>
          <p>You have successfully purchased: <strong>${payload.itemName}</strong></p>
          <p>The item will be assigned to GitHub user: <strong>${payload.githubLogin}</strong></p>
          <br>
          <p>Thank you for shopping with us!</p>
        `,
      });

      if (error) {
        console.error('Resend API Error:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Resend Adapter Error:', error);
      return { success: false, error };
    }
  }
}
