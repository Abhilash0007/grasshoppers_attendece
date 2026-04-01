import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { PunchRecord } from '@/lib/models/PunchRecord';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { date } = req.query;
    const targetDate = date ? new Date(date as string) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all employees
    const employees = await User.find({ role: 'employee' }).select('-password');

    // Get punch records for the day
    const dailyRecords = await PunchRecord.find({
      date: { $gte: targetDate, $lt: nextDay },
    }).populate('userId', 'name email department position');

    // Calculate statistics
    const totalEmployees = employees.length;
    const presentToday = new Set(dailyRecords.map((r) => r.userId.toString())).size;
    const absentToday = totalEmployees - presentToday;

    // Count on time and late
    let onTimeCount = 0;
    let lateCount = 0;
    const officeStartTime = 9; // 9 AM

    dailyRecords.forEach((record) => {
      const hour = record.punchInTime.getHours();
      if (hour <= officeStartTime) {
        onTimeCount++;
      } else {
        lateCount++;
      }
    });

    // Calculate average work hours
    const totalWorkMinutes = dailyRecords.reduce(
      (sum, record) => sum + (record.workDuration || 0),
      0
    );
    const averageWorkHours = presentToday > 0 ? (totalWorkMinutes / presentToday / 60).toFixed(2) : '0';

    const stats = {
      totalEmployees,
      presentToday,
      absentToday,
      onTimeToday: onTimeCount,
      lateToday: lateCount,
      averageWorkHours: parseFloat(averageWorkHours as string),
      todayRecords: dailyRecords,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching admin statistics',
    });
  }
}
