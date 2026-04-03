import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { PunchRecord } from '@/lib/models/PunchRecord';
import { User } from '@/lib/models/User';
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

    // Verify token and admin access
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { employeeId, startDate, endDate, limit = 100, skip = 0 } = req.query;

    // Build query
    const query: any = {};

    if (employeeId) {
      query.userId = employeeId;
    }

    // Date range filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Get punch records with pagination
    const records = await PunchRecord.find(query)
      .populate('userId', 'name email department position phone')
      .sort({ date: -1, punchInTime: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await PunchRecord.countDocuments(query);

    // Calculate statistics
    const totalRecords = records.length;
    const totalWorkMinutes = records.reduce((sum, record) => {
      return sum + (record.workDuration || 0);
    }, 0);

    const avgWorkMinutes = totalRecords > 0 ? Math.round(totalWorkMinutes / totalRecords) : 0;

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        limit: parseInt(limit as string),
        skip: parseInt(skip as string),
        returned: records.length,
      },
      statistics: {
        totalRecords,
        totalWorkMinutes,
        avgWorkMinutes,
        avgWorkHours: (avgWorkMinutes / 60).toFixed(2),
      },
    });
  } catch (error: any) {
    console.error('Punch history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
