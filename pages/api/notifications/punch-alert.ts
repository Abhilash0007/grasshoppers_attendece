import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { sendPushNotification } from '@/utils/push-notification';
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

    const { employeeId, employeeName, actionType, latitude, longitude } = req.body;

    if (!employeeId || !employeeName || !actionType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get all admin users
    const admins = await User.find({ role: 'admin' }).select('email pushSubscription name');

    if (admins.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No admins to notify',
      });
    }

    // Prepare notification message
    const actionText = actionType === 'in' ? 'Punched In' : 'Punched Out';
    const locationText = latitude && longitude 
      ? ` from ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      : '';

    // Send push notifications to admins
    const pushSubscriptions = admins
      .filter(admin => admin.pushSubscription)
      .map(admin => admin.pushSubscription);

    if (pushSubscriptions.length > 0) {
      const notification = {
        title: '👤 ' + employeeName + ' ' + actionText,
        body: `Employee ${actionText.toLowerCase()}${locationText}`,
        icon: '/favicon.ico',
        badge: '/badge.png',
      };

      for (const subscription of pushSubscriptions) {
        try {
          await sendPushNotification(subscription, notification);
        } catch (err) {
          console.error('Push notification error:', err);
        }
      }
    }

    // Send email to admins
    const adminEmails = admins.map(a => a.email).join(',');
    try {
      await sendEmail({
        to: adminEmails,
        subject: `👤 ${employeeName} ${actionText}`,
        html: `
          <p><strong>${employeeName}</strong> has ${actionText.toLowerCase()}.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          ${locationText ? `<p><strong>Location:</strong> ${latitude}, ${longitude}</p>` : ''}
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/punch-history" 
             style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">
            View Details
          </a>
        `
      });
    } catch (err) {
      console.error('Email notification error:', err);
    }

    return res.status(200).json({
      success: true,
      message: `Notified ${admins.length} admins`,
    });
  } catch (error: any) {
    console.error('Punch notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
