import jwt from 'jsonwebtoken';
import { User as IUser } from '@/lib/models/User';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  role: string;
}

export const generateToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};
