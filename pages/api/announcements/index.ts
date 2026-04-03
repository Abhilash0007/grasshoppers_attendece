import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Announcement } from '@/lib/models/Announcement';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get all visible announcements
      const announcements = await Announcement.find({ visible: true })
        .sort({ createdAt: -1 })
        .select('-content'); // Don't send full content in list

      return res.status(200).json({
        success: true,
        data: announcements,
      });
    }

    if (req.method === 'POST') {
      // Create new announcement (admin only)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const { title, description, content, priority = 'medium' } = req.body;

      if (!title || !description || !content) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const adminName = payload.name || payload.email || 'Admin';

      const announcement = new Announcement({
        title,
        description,
        content,
        priority,
        adminId: payload.userId,
        adminName,
        visible: true,
      });

      await announcement.save();

      return res.status(201).json({
        success: true,
        data: announcement,
        message: 'Announcement created successfully',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Announcement API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
