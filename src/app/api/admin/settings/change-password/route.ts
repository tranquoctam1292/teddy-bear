// Change Password API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Use Node.js runtime (not edge) to support bcryptjs
export const runtime = 'nodejs';

// POST - Change current user's password
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const { users, adminUsers } = await getCollections();
    const userEmail = session.user.email;

    // Check in adminUsers first, then users
    let user = await adminUsers.findOne({ email: userEmail });
    if (!user) {
      user = await users.findOne({ email: userEmail, role: 'admin' });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    if (user.id) {
      // Admin user
      await adminUsers.updateOne(
        { id: user.id },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
    } else {
      // Regular user
      await users.updateOne(
        { email: userEmail },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

