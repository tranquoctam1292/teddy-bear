/**
 * Email Service - Unified interface
 */

import { getResendService } from './resend';
import { generateOrderConfirmationEmail } from './templates/order-confirmation';
import type { Order } from '@/lib/schemas/order';

export interface SendOrderConfirmationOptions {
  order: Order;
  customerName: string;
  customerEmail: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  options: SendOrderConfirmationOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { order, customerName, customerEmail } = options;

  // Generate email HTML
  const emailHtml = generateOrderConfirmationEmail({
    orderId: order.orderId,
    customerName,
    customerEmail,
    items: order.items.map((item) => ({
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentDetails.method,
    estimatedDelivery: order.estimatedDelivery?.toISOString(),
  });

  // Send email using Resend
  const resend = getResendService();
  const result = await resend.sendEmail({
    to: customerEmail,
    subject: `Xác nhận đơn hàng #${order.orderId} - The Emotional House`,
    html: emailHtml,
    replyTo: process.env.RESEND_REPLY_TO || 'support@emotionalhouse.vn',
  });

  return result;
}

/**
 * Send generic email (for future use)
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendService();
  return resend.sendEmail({ to, subject, html });
}



