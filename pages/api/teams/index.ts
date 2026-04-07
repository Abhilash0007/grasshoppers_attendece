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

    if (req.method === 'GET') {
      // Get all teams
      const teams = await Team.find()
        .populate('members', 'name email department position')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: teams,
      });
    }

    if (req.method === 'POST') {
      // Create new team (admin only)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const payload = verifyToken(token);
      if (!payload || payload.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const { name, description, members } = req.body;

      if (!name || !members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ success: false, error: 'Name and members are required' });
      }

      const team = new Team({
        name,
        description,
        members,
        createdBy: payload.userId,
      });

      await team.save();

      // Populate the created team
      await team.populate('members', 'name email department position');
      await team.populate('createdBy', 'name');

      return res.status(201).json({
        success: true,
        data: team,
        message: 'Team created successfully',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Team API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}