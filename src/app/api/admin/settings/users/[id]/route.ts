// Admin User API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Use Node.js runtime (not edge) to support bcryptjs
export const runtime = 'nodejs';

// GET - Get single admin user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { adminUsers } = await getCollections();

    const user = await adminUsers.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { _id, password, ...userData } = user as any;
    return NextResponse.json({
      user: {
        ...userData,
        id: userData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { email, name, password, role, permissions, isActive } = body;

    const { adminUsers } = await getCollections();

    const existingUser = await adminUsers.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check email uniqueness if changed
    if (email && email !== existingUser.email) {
      const emailExists = await adminUsers.findOne({
        email: email.trim().toLowerCase(),
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = { updatedAt: new Date() };
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (name !== undefined) updateData.name = name.trim();
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    await adminUsers.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedUser = await adminUsers.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, password: _, ...userData } = updatedUser as any;
    return NextResponse.json({
      user: {
        ...userData,
        id: userData.id || _id.toString(),
      },
      message: 'Admin user updated successfully',
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { adminUsers } = await getCollections();

    const user = await adminUsers.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (session.user?.email === user.email) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await adminUsers.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Admin user deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

