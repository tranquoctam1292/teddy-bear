import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { Coupon } from '@/lib/types/marketing';

// GET /api/admin/marketing/coupons - List all coupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const { coupons } = await getCollections();

    // Build query
    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const couponsList = await coupons.find(query).sort({ createdAt: -1 }).toArray();

    // Update expired status
    const now = new Date();
    for (const coupon of couponsList) {
      if (coupon.status === 'active' && new Date(coupon.validTo) < now) {
        await coupons.updateOne(
          { _id: coupon._id },
          { $set: { status: 'expired' } }
        );
        coupon.status = 'expired';
      }
    }

    return NextResponse.json({
      success: true,
      coupons: couponsList.map((c: any) => ({
        ...c,
        _id: c._id?.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/coupons - Create new coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      usageLimit,
      perUserLimit,
      validFrom,
      validTo,
      description,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { coupons } = await getCollections();

    // Check if code already exists
    const existing = await coupons.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const newCoupon: Omit<Coupon, '_id'> = {
      code: code.toUpperCase(),
      type,
      value,
      minPurchase: minPurchase || undefined,
      maxDiscount: maxDiscount || undefined,
      usageLimit: usageLimit || undefined,
      usageCount: 0,
      perUserLimit: perUserLimit || undefined,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      status: 'active',
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await coupons.insertOne(newCoupon as any);

    return NextResponse.json({
      success: true,
      coupon: {
        ...newCoupon,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/coupons - Bulk delete
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { coupons } = await getCollections();
    const { ObjectId } = await import('mongodb');

    const result = await coupons.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupons' },
      { status: 500 }
    );
  }
}







