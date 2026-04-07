import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Holiday } from '@/lib/models/Holiday';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    if (req.method === 'GET') {
      const { year, month } = req.query;

      let query: any = {};
      if (year && month) {
        const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
        const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
        query.date = { $gte: startDate, $lte: endDate };
      } else if (year) {
        const startDate = new Date(parseInt(year as string), 0, 1);
        const endDate = new Date(parseInt(year as string), 11, 31);
        query.date = { $gte: startDate, $lte: endDate };
      }

      const holidays = await Holiday.find(query).sort({ date: 1 });

      return res.status(200).json({
        success: true,
        data: holidays,
      });
    } else if (req.method === 'POST') {
      // Only admin can create holidays
      if (payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const { name, date, type, description, isRecurring, recurringPattern } = req.body;

      if (!name || !date) {
        return res.status(400).json({
          success: false,
          error: 'Name and date are required',
        });
      }

      const holiday = new Holiday({
        name,
        date: new Date(date),
        type,
        description,
        isRecurring,
        recurringPattern,
      });

      await holiday.save();

      // Send notifications asynchronously
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/send-holiday`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            holidayName: name,
            holidayDate: date,
            holidayDescription: description,
          }),
        });
      } catch (err) {
        console.error('Error sending holiday notifications:', err);
      }

      return res.status(201).json({
        success: true,
        data: holiday,
        message: 'Holiday created successfully',
      });
    } else if (req.method === 'DELETE') {
      // Only admin can delete holidays
      if (payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const { id } = req.query;
      const holiday = await Holiday.findByIdAndDelete(id);

      if (!holiday) {
        return res.status(404).json({
          success: false,
          error: 'Holiday not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Holiday deleted successfully',
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Holiday error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing holiday request',
    });
  }
}
