import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: mongoose.Types.ObjectId[]; // Array of user IDs
  createdBy: mongoose.Types.ObjectId; // Admin who created the team
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Please provide team name'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);