import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/utils/auth';
import { sendBulkPushNotifications } from '@/utils/push-notification';
import { sendEmail } from '@/utils/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Verify admin access
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { holidayName, holidayDate, holidayDescription } = req.body;

    if (!holidayName || !holidayDate) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get all employees
    const employees = await User.find({ role: 'employee' }).select('email pushSubscription name');

    if (employees.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No employees to notify',
      });
    }

    const holidayDateFormatted = new Date(holidayDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send push notifications
    const pushSubscriptions = employees
      .filter(emp => emp.pushSubscription)
      .map(emp => emp.pushSubscription);

    if (pushSubscriptions.length > 0) {
      const payload_data = {
        title: '🎉 ' + holidayName,
        body: `Holiday on ${holidayDateFormatted}`,
        icon: '/favicon.ico',
        badge: '/badge.png',
      };

      await sendBulkPushNotifications(pushSubscriptions, payload_data);
    }

    // Send emails
    const emailAddresses = employees.map(e => e.email);
    if (emailAddresses.length > 0) {
      await sendEmail({
        to: emailAddresses.join(','),
        subject: `🎉 Holiday Announced: ${holidayName}`,
        html: `
          <h2>${holidayName}</h2>
          <p><strong>Date:</strong> ${holidayDateFormatted}</p>
          ${holidayDescription ? `<p>${holidayDescription}</p>` : ''}
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/holidays" 
             style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">
            View Calendar
          </a>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Holiday notifications sent to ${employees.length} employees`,
      sentTo: employees.length,
    });
  } catch (error: any) {
    console.error('Send holiday notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
