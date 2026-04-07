import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Team } from '@/lib/models/Team';
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

    // Verify token and admin access
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { teamId, startDate, endDate } = req.query;

    if (!teamId) {
      return res.status(400).json({ success: false, error: 'Team ID is required' });
    }

    // Get team
    const team = await Team.findById(teamId).populate('members', 'name email');
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    // Build query for punch records
    const query: any = {
      userId: { $in: team.members.map((m: any) => m._id) }
    };

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

    // Get punch records for team members
    const records = await PunchRecord.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    // Calculate team statistics
    const memberStats = team.members.map((member: any) => {
      const memberRecords = records.filter(r => r.userId._id.toString() === member._id.toString());
      const totalRecords = memberRecords.length;
      const completedRecords = memberRecords.filter(r => r.status === 'completed').length;
      const totalWorkMinutes = memberRecords.reduce((sum, r) => sum + (r.workDuration || 0), 0);
      const avgWorkMinutes = totalRecords > 0 ? Math.round(totalWorkMinutes / totalRecords) : 0;

      return {
        member: {
          _id: member._id,
          name: member.name,
          email: member.email,
        },
        totalRecords,
        completedRecords,
        totalWorkMinutes,
        avgWorkMinutes,
        avgWorkHours: (avgWorkMinutes / 60).toFixed(2),
      };
    });

    // Overall team stats
    const totalMembers = team.members.length;
    const totalRecords = records.length;
    const totalCompleted = records.filter(r => r.status === 'completed').length;
    const totalWorkMinutes = records.reduce((sum, r) => sum + (r.workDuration || 0), 0);
    const avgWorkMinutesPerMember = totalMembers > 0 ? Math.round(totalWorkMinutes / totalMembers) : 0;

    res.status(200).json({
      success: true,
      data: {
        team: {
          _id: team._id,
          name: team.name,
          description: team.description,
          memberCount: team.members.length,
        },
        memberStats,
        teamStats: {
          totalMembers,
          totalRecords,
          totalCompleted,
          completionRate: totalRecords > 0 ? ((totalCompleted / totalRecords) * 100).toFixed(1) : '0',
          totalWorkMinutes,
          avgWorkMinutesPerMember,
          avgWorkHoursPerMember: (avgWorkMinutesPerMember / 60).toFixed(2),
        },
      },
    });
  } catch (error: any) {
    console.error('Team stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}