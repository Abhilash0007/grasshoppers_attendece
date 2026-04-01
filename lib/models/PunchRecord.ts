import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPunchRecord extends Document {
  userId: Types.ObjectId;
  punchInTime: Date;
  punchOutTime?: Date;
  punchInLocation?: {
    latitude: number;
    longitude: number;
  };
  punchOutLocation?: {
    latitude: number;
    longitude: number;
  };
  workDuration?: number; // in minutes
  notes?: string;
  status: 'active' | 'completed';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PunchRecordSchema = new Schema<IPunchRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    punchInTime: {
      type: Date,
      required: true,
    },
    punchOutTime: Date,
    punchInLocation: {
      latitude: Number,
      longitude: Number,
    },
    punchOutLocation: {
      latitude: Number,
      longitude: Number,
    },
    workDuration: {
      type: Number,
      default: 0,
    },
    notes: String,
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    date: {
      type: Date,
      index: true,
      default: () => new Date(new Date().setHours(0, 0, 0, 0)),
    },
  },
  { timestamps: true }
);

// Index for efficient querying
PunchRecordSchema.index({ userId: 1, date: -1 });
PunchRecordSchema.index({ date: -1 });

export const PunchRecord =
  mongoose.models.PunchRecord ||
  mongoose.model<IPunchRecord>('PunchRecord', PunchRecordSchema);
