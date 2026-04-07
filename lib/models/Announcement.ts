import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  content: string;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  visible: boolean;
  recipients: 'all' | mongoose.Types.ObjectId[]; // 'all' or array of user IDs
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: 500,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    recipients: {
      type: mongoose.Schema.Types.Mixed, // Can be 'all' or array of ObjectIds
      default: 'all',
      validate: {
        validator: function(v: any) {
          return v === 'all' || (Array.isArray(v) && v.every(id => mongoose.Types.ObjectId.isValid(id)));
        },
        message: 'Recipients must be "all" or an array of valid ObjectIds'
      }
    },
  },
  {
    timestamps: true,
  }
);

// Create or get the model
let Announcement: mongoose.Model<IAnnouncement>;

try {
  Announcement = mongoose.model<IAnnouncement>('Announcement');
} catch (e) {
  Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
}

export { Announcement };
