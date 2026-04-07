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

    const { id } = req.query;

    if (req.method === 'GET') {
      // Get specific announcement
      const announcement = await Announcement.findById(id);

      if (!announcement || !announcement.visible) {
        return res.status(404).json({ success: false, error: 'Announcement not found' });
      }

      return res.status(200).json({
        success: true,
        data: announcement,
      });
    }

    if (req.method === 'DELETE' || req.method === 'PUT') {
      // Admin only
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ success: false, error: 'Announcement not found' });
      }

      if (req.method === 'DELETE') {
        await Announcement.findByIdAndDelete(id);
        return res.status(200).json({
          success: true,
          message: 'Announcement deleted successfully',
        });
      }

      if (req.method === 'PUT') {
        const { title, description, content, priority, visible, recipients } = req.body;

        if (title) announcement.title = title;
        if (description) announcement.description = description;
        if (content) announcement.content = content;
        if (priority) announcement.priority = priority;
        if (visible !== undefined) announcement.visible = visible;
        if (recipients !== undefined) announcement.recipients = recipients;

        await announcement.save();

        return res.status(200).json({
          success: true,
          data: announcement,
          message: 'Announcement updated successfully',
        });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Announcement detail API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
