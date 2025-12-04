/**
 * Stock Reservation System
 * 
 * Reserves stock when user proceeds to checkout
 * Releases stock after 15 minutes if payment not completed
 */

import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface StockReservation {
  _id?: ObjectId;
  orderId: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  expiresAt: Date;
  status: 'reserved' | 'confirmed' | 'released' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const RESERVATION_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Reserve stock for order items
 * Returns true if all items are successfully reserved
 */
export async function reserveStock(
  orderId: string,
  items: Array<{ productId: string; variantId: string; quantity: number }>
): Promise<{ success: boolean; error?: string; reservations?: StockReservation }> {
  try {
    const { products, stockReservations } = await getCollections();

    // Check and reserve each item
    for (const item of items) {
      const product = await products.findOne({ id: item.productId });
      if (!product) {
        return {
          success: false,
          error: `Product ${item.productId} not found`,
        };
      }

      const variant = product.variants.find((v: any) => v.id === item.variantId);
      if (!variant) {
        return {
          success: false,
          error: `Variant ${item.variantId} not found`,
        };
      }

      // Check available stock (excluding reserved stock)
      const reservedStock = await getReservedStock(item.productId, item.variantId);
      const availableStock = variant.stock - reservedStock;

      if (availableStock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name} - ${variant.size}. Available: ${availableStock}, Requested: ${item.quantity}`,
        };
      }
    }

    // All items are available, create reservation
    const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);
    const reservation: StockReservation = {
      orderId,
      items,
      expiresAt,
      status: 'reserved',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await stockReservations.insertOne(reservation);

    // Update product stock (subtract reserved quantity)
    // Note: We don't actually subtract from stock, we just track reservations
    // Stock is only subtracted when order is confirmed

    return {
      success: true,
      reservations: reservation,
    };
  } catch (error) {
    console.error('Error reserving stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reserve stock',
    };
  }
}

/**
 * Get total reserved stock for a variant
 */
export async function getReservedStock(
  productId: string,
  variantId: string
): Promise<number> {
  try {
    const { stockReservations } = await getCollections();

    const now = new Date();
    const reservations = await stockReservations
      .find({
        status: 'reserved',
        expiresAt: { $gt: now },
        'items.productId': productId,
        'items.variantId': variantId,
      })
      .toArray();

    return reservations.reduce((total, reservation) => {
      const item = reservation.items.find(
        (i: any) => i.productId === productId && i.variantId === variantId
      );
      return total + (item?.quantity || 0);
    }, 0);
  } catch (error) {
    console.error('Error getting reserved stock:', error);
    return 0;
  }
}

/**
 * Confirm reservation (when payment is completed)
 */
export async function confirmReservation(orderId: string): Promise<boolean> {
  try {
    const { stockReservations, products } = await getCollections();

    const reservation = await stockReservations.findOne({ orderId, status: 'reserved' });
    if (!reservation) {
      return false;
    }

    // Update reservation status
    await stockReservations.updateOne(
      { orderId },
      {
        $set: {
          status: 'confirmed',
          updatedAt: new Date(),
        },
      }
    );

    // Actually subtract stock from products
    for (const item of reservation.items) {
      await products.updateOne(
        { id: item.productId, 'variants.id': item.variantId },
        {
          $inc: {
            'variants.$.stock': -item.quantity,
          },
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error confirming reservation:', error);
    return false;
  }
}

/**
 * Release reservation (when order is cancelled or expired)
 */
export async function releaseReservation(orderId: string): Promise<boolean> {
  try {
    const { stockReservations } = await getCollections();

    const result = await stockReservations.updateOne(
      { orderId, status: 'reserved' },
      {
        $set: {
          status: 'released',
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error releasing reservation:', error);
    return false;
  }
}

/**
 * Release expired reservations (should be called periodically)
 */
export async function releaseExpiredReservations(): Promise<number> {
  try {
    const { stockReservations } = await getCollections();

    const now = new Date();
    const result = await stockReservations.updateMany(
      {
        status: 'reserved',
        expiresAt: { $lt: now },
      },
      {
        $set: {
          status: 'expired',
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount;
  } catch (error) {
    console.error('Error releasing expired reservations:', error);
    return 0;
  }
}

/**
 * Get reservation by orderId
 */
export async function getReservation(orderId: string): Promise<StockReservation | null> {
  try {
    const { stockReservations } = await getCollections();
    const reservation = await stockReservations.findOne({ orderId });
    if (!reservation) return null;

    const { _id, ...data } = reservation as any;
    return {
      ...data,
      id: data.id || _id.toString(),
    } as StockReservation;
  } catch (error) {
    console.error('Error getting reservation:', error);
    return null;
  }
}




