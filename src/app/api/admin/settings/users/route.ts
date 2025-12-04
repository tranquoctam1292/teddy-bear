// Admin Users API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { AdminUser } from '@/lib/schemas/security-settings';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Use Node.js runtime (not edge) to support bcryptjs
export const runtime = 'nodejs';

function generateId(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all admin users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adminUsers } = await getCollections();
    const users = await adminUsers
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((user: any) => {
      const { _id, password, ...userData } = user;
      return {
        ...userData,
        id: userData.id || _id.toString(),
      };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, password, role, permissions, isActive } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'super_admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const { adminUsers } = await getCollections();

    const existingUser = await adminUsers.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: AdminUser = {
      id: generateId(),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      role: role as AdminUser['role'],
      permissions: permissions || [],
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminUsers.insertOne(newUser);

    const { _id, password: _, ...userData } = newUser;
    return NextResponse.json(
      { user: { ...userData, id: userData.id || _id?.toString() || '' }, message: 'Admin user created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

