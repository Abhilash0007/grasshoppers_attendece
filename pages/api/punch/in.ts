import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { PunchRecord } from '@/lib/models/PunchRecord';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/utils/auth';
import { sendPunchNotificationEmail } from '@/utils/email';

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

    const { latitude, longitude, notes } = req.body;
    const userId = payload.userId;

    // Check if already punched in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingPunch = await PunchRecord.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow },
      status: 'active',
    });

    if (existingPunch) {
      return res.status(400).json({
        success: false,
        error: 'Already punched in today',
      });
    }

    // Create new punch record
    const punchRecord = new PunchRecord({
      userId,
      punchInTime: new Date(),
      punchInLocation: {
        latitude,
        longitude,
      },
      notes,
      status: 'active',
      date: today,
    });

    await punchRecord.save();

    // Send notification to admin
    const admin = await User.findOne({ role: 'admin' });
    const user = await User.findById(userId);
    if (admin && user && process.env.ENABLE_NOTIFICATIONS === 'true') {
      await sendPunchNotificationEmail(admin.email, user.name, 'punch-in', new Date());
    }

    res.status(201).json({
      success: true,
      data: punchRecord,
      message: 'Punched in successfully',
    });
  } catch (error: any) {
    console.error('Punch in error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error punching in',
    });
  }
}
