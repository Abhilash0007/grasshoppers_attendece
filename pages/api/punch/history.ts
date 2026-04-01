import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
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
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userId = payload.userId;
    const { limit = 30, skip = 0, month, year } = req.query;

    // Build query
    const query: any = { userId };

    if (month && year) {
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Fetch punch records
    const records = await PunchRecord.find(query)
      .sort({ punchInTime: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await PunchRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: records,
      total,
      limit: parseInt(limit as string),
      skip: parseInt(skip as string),
    });
  } catch (error: any) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching punch history',
    });
  }
}
