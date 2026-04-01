import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { name, email, password, phone, department, position } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      department,
      position,
      role: 'employee',
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return without password
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      success: true,
      user: userObject,
      token,
      message: 'User registered successfully',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error registering user',
    });
  }
}
