import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Team } from '@/lib/models/Team';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { id } = req.query;

    if (req.method === 'GET') {
      // Get specific team
      const team = await Team.findById(id)
        .populate('members', 'name email department position')
        .populate('createdBy', 'name');

      if (!team) {
        return res.status(404).json({ success: false, error: 'Team not found' });
      }

      return res.status(200).json({
        success: true,
        data: team,
      });
    }

    if (req.method === 'PUT') {
      // Update team (admin only)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).json({ success: false, error: 'Team not found' });
      }

      const { name, description, members } = req.body;

      if (name) team.name = name;
      if (description !== undefined) team.description = description;
      if (members && Array.isArray(members)) team.members = members;

      await team.save();

      // Populate updated team
      await team.populate('members', 'name email department position');
      await team.populate('createdBy', 'name');

      return res.status(200).json({
        success: true,
        data: team,
        message: 'Team updated successfully',
      });
    }

    if (req.method === 'DELETE') {
      // Delete team (admin only)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      await Team.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Team deleted successfully',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Team detail API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}