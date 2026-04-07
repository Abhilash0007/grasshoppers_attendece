import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/utils/auth';
import { sendPushNotification, sendBulkPushNotifications } from '@/utils/push-notification';
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

    const { announcementTitle, announcementDescription, recipients } = req.body;

    if (!announcementTitle || !announcementDescription) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get recipient users
    let users: any[] = [];
    if (recipients === 'all') {
      users = await User.find({ role: 'employee' }).select('email pushSubscription name');
    } else if (Array.isArray(recipients) && recipients.length > 0) {
      users = await User.find({ _id: { $in: recipients } }).select('email pushSubscription name');
    }

    // Send push notifications
    const pushSubscriptions = users
      .filter(u => u.pushSubscription)
      .map(u => u.pushSubscription);

    if (pushSubscriptions.length > 0) {
      const payload_data = {
        title: '📢 ' + announcementTitle,
        body: announcementDescription,
        icon: '/favicon.ico',
        badge: '/badge.png',
      };

      await sendBulkPushNotifications(pushSubscriptions, payload_data);
    }

    // Send emails
    const emailAddresses = users.map(u => u.email);
    if (emailAddresses.length > 0) {
      await sendEmail({
        to: emailAddresses.join(','),
        subject: `📢 New Announcement: ${announcementTitle}`,
        html: `
          <h2>${announcementTitle}</h2>
          <p>${announcementDescription}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/announcements" 
             style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">
            View Details
          </a>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notifications sent to ${users.length} users`,
      sentTo: users.length,
    });
  } catch (error: any) {
    console.error('Send announcement notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
