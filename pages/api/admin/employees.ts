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

    const { limit = 50, skip = 0, search } = req.query;

    // Build query
    const query: any = { role: 'employee' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get employees
    const employees = await User.find(query)
      .select('-password')
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Get today's punch info for each employee
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const employeesWithPunch = await Promise.all(
      employees.map(async (emp) => {
        const todayPunch = await PunchRecord.findOne({
          userId: emp._id,
          date: { $gte: today, $lt: tomorrow },
        });

        return {
          ...emp.toObject(),
          todayPunch: todayPunch ? {
            punchedIn: !!todayPunch.punchInTime,
            punchedOut: !!todayPunch.punchOutTime,
            punchInTime: todayPunch.punchInTime,
            punchOutTime: todayPunch.punchOutTime,
            status: todayPunch.status,
          } : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: employeesWithPunch,
      total,
      limit: parseInt(limit as string),
      skip: parseInt(skip as string),
    });
  } catch (error: any) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching employees',
    });
  }
}
