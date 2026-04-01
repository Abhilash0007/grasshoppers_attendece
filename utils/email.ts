import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email service not configured. Skipping email send.');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendPunchNotificationEmail = async (
  adminEmail: string,
  userName: string,
  event: 'punch-in' | 'punch-out',
  timestamp: Date
): Promise<boolean> => {
  const actionText = event === 'punch-in' ? 'Punch In' : 'Punch Out';
  const subject = `${userName} ${actionText} - Grasshoppers Attendance`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">${actionText} Notification</h1>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
        <p><strong>Employee:</strong> ${userName}</p>
        <p><strong>Action:</strong> ${actionText}</p>
        <p><strong>Time:</strong> ${timestamp.toLocaleString()}</p>
        <p style="margin-top: 20px; color: #666;">
          This is an automated notification from Grasshoppers Attendance System.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  });
};
