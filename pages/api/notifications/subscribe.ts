import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ success: false, error: 'Invalid subscription' });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Save or update push subscription
    user.pushSubscription = subscription;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Push subscription saved successfully',
    });
  } catch (error: any) {
    console.error('Push subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
