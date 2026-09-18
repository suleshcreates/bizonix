import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Resend } from 'resend';

export type OutboundEmail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  template?: {
    id: string;
    variables: Record<string, string | number>;
  };
};

export type EmailResult =
  | { configured: false }
  | { configured: true; id: string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  // private readonly client: Resend | null;

  constructor(private readonly config: ConfigService) {
    // const apiKey = this.config.get<string>('RESEND_API_KEY');
    // this.client = apiKey ? new Resend(apiKey) : null;
  }

  get isConfigured() {
    return Boolean(
      this.config.get<string>('EMAILJS_SERVICE_ID') &&
      this.config.get<string>('EMAILJS_TEMPLATE_ID') &&
      this.config.get<string>('EMAILJS_PUBLIC_KEY') &&
      this.config.get<string>('EMAILJS_PRIVATE_KEY')
    );
    // return Boolean(this.client && this.config.get<string>('DEMO_REQUEST_FROM_EMAIL'));
  }

  async send(message: OutboundEmail): Promise<EmailResult> {
    const serviceId = this.config.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.config.get<string>('EMAILJS_TEMPLATE_ID');
    const publicKey = this.config.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.config.get<string>('EMAILJS_PRIVATE_KEY');

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      this.logger.warn('Email skipped because EmailJS delivery is not configured.');
      return { configured: false };
    }

    /*
    const from = this.config.get<string>('DEMO_REQUEST_FROM_EMAIL');
    if (!this.client || !from) {
      this.logger.warn('Email skipped because Resend delivery is not configured.');
      return { configured: false };
    }

    const payload = message.template
      ? {
          from,
          to: message.to,
          subject: message.subject,
          replyTo: message.replyTo,
          template: message.template,
        }
      : {
          from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html || message.text,
          replyTo: message.replyTo,
        };
    const { data, error } = await this.client.emails.send(payload);

    if (error || !data?.id) {
      throw new Error(error?.message || 'Resend did not return an email id.');
    }
    return { configured: true, id: data.id };
    */

    const htmlContent = message.html || message.text;
    
    // Dynamic mapping for EmailJS template params.
    // The EmailJS template must expect {{to_email}}, {{subject}}, and {{{message}}}
    const templateParams = {
      to_email: message.to,
      subject: message.subject,
      message: htmlContent,
      ...(message.template ? message.template.variables : {})
    };

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS Error: ${response.status} ${errorText}`);
      }

      // EmailJS responds with 'OK' text on success, not JSON
      return { configured: true, id: `emailjs-${Date.now()}` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email via EmailJS: ${errorMessage}`);
      throw error;
    }
  }
}
