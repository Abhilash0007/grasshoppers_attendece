import mongoose, { Schema, Document } from 'mongoose';

export interface IHoliday extends Document {
  name: string;
  date: Date;
  type: 'national' | 'company' | 'other';
  description?: string;
  isRecurring: boolean;
  recurringPattern?: 'yearly' | 'monthly'; // For recurring holidays
  createdAt: Date;
  updatedAt: Date;
}

const HolidaySchema = new Schema<IHoliday>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['national', 'company', 'other'],
      default: 'national',
    },
    description: String,
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ['yearly', 'monthly'],
    },
  },
  { timestamps: true }
);

HolidaySchema.index({ date: 1 });

export const Holiday =
  mongoose.models.Holiday || mongoose.model<IHoliday>('Holiday', HolidaySchema);
