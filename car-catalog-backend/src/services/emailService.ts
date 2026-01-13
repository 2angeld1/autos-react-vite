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
   * Initialize email service - CORREGIDO
   */
  static async initialize(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to VeloDrive! 🏎️</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6;">Welcome to our premium vehicle showcase platform! We're excited to have you on board.</p>
          <p style="font-size: 16px; line-height: 1.6;">You can now:</p>
          <ul style="font-size: 16px; line-height: 1.6; color: #4b5563;">
            <li>Browse our curated collection of luxury cars</li>
            <li>Save your favorite vehicles to your profile</li>
            <li>Get direct alerts for new arrivals</li>
            <li>Access exclusive technical specifications</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.6;">Start your journey now and find your dream ride!</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="font-size: 14px; color: #6b7280; text-align: center;">Best regards,<br><strong>The VeloDrive Team</strong></p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to VeloDrive!',
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
        <p>You requested a password reset for your VeloDrive account.</p>
        <p>Click the button below to reset your password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The VeloDrive Team</p>
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
      subject: `[VeloDrive Admin] ${subject}`,
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