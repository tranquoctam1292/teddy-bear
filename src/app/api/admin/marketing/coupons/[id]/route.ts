import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/admin/marketing/coupons/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { coupons } = await getCollections();
    const coupon = await coupons.findOne({ _id: new ObjectId(params.id) });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        _id: coupon._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/marketing/coupons/[id]
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { coupons } = await getCollections();

    const update: any = {
      ...body,
      updatedAt: new Date(),
    };

    // Convert dates
    if (update.validFrom) update.validFrom = new Date(update.validFrom);
    if (update.validTo) update.validTo = new Date(update.validTo);

    const result = await coupons.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    const updatedCoupon = await coupons.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      coupon: {
        ...updatedCoupon,
        _id: updatedCoupon?._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/coupons/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { coupons } = await getCollections();

    const result = await coupons.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}







