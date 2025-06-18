import nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  /**
   * Initialize email service
   */
  static async initialize(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Verify connection
      await this.transporter.verify();
      logger.info('📧 Email service initialized successfully');
    } catch (error) {
      logger.error('❌ Email service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Send email
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        await this.initialize();
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`📧 Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      logger.error(`❌ Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Car Catalog! 🚗</h2>
        <p>Hi ${name},</p>
        <p>Welcome to our premium car catalog platform! We're excited to have you on board.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our extensive collection of cars</li>
          <li>Save your favorite vehicles</li>
          <li>Get personalized recommendations</li>
          <li>Access detailed car information</li>
        </ul>
        <p>Start exploring now and find your dream car!</p>
        <p>Best regards,<br>The Car Catalog Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Car Catalog!',
      html
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your Car Catalog account.</p>
        <p>Click the button below to reset your password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Car Catalog Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html
    });
  }

  /**
   * Send notification email to admin
   */
  static async sendAdminNotification(subject: string, message: string): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    if (!adminEmail) {
      logger.warn('No admin email configured for notifications');
      return false;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Admin Notification</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
          ${message}
        </div>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `[Car Catalog Admin] ${subject}`,
      html
    });
  }

  /**
   * Send bulk email (for newsletters, etc.)
   */
  static async sendBulkEmail(recipients: string[], subject: string, html: string): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of recipients) {
      try {
        await this.sendEmail({ to: email, subject, html });
        success++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failed++;
        errors.push(`Failed to send to ${email}: ${(error as Error).message}`);
      }
    }

    logger.info(`Bulk email completed: ${success} success, ${failed} failed`);
    return { success, failed, errors };
  }
}