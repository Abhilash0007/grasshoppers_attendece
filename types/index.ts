export type UserRole = 'employee' | 'admin';
export type PunchStatus = 'active' | 'completed';
export type HolidayType = 'national' | 'company' | 'other';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PunchRecord {
  _id: string;
  userId: string;
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
  workDuration?: number;
  notes?: string;
  status: PunchStatus;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  _id: string;
  name: string;
  date: Date;
  type: HolidayType;
  description?: string;
  isRecurring: boolean;
  recurringPattern?: 'yearly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onTimeToday: number;
  lateToday: number;
  averageWorkHours: number;
  todayPunches: PunchRecord[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  error?: string;
}

export interface PunchResponse {
  success: boolean;
  message?: string;
  data?: PunchRecord;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
