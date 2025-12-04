/**
 * Payment Service - Unified interface for payment gateways
 */

import { getVietQRService } from './vietqr';
import { getMoMoService } from './momo';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';

export interface PaymentRequest {
  amount: number;
  orderId: string;
  description: string;
  returnUrl?: string;
  notifyUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentUrl?: string; // URL để redirect user (cho MoMo, VNPay)
  qrCode?: string; // QR code data (cho VietQR, bank transfer)
  qrCodeUrl?: string; // QR code image URL
  accountNo?: string; // Số tài khoản (cho bank transfer)
  accountName?: string; // Tên chủ tài khoản
  content?: string; // Nội dung chuyển khoản
  transactionId?: string;
  error?: string;
}

/**
 * Process payment based on payment method
 */
export async function processPayment(
  method: PaymentMethod,
  request: PaymentRequest
): Promise<PaymentResult> {
  try {
    switch (method) {
      case 'cod':
        // COD - No payment processing needed
        return {
          success: true,
        };

      case 'bank_transfer':
        // Bank transfer - Generate VietQR
        const vietQR = getVietQRService();
        const vietQRResult = await vietQR.createPayment({
          amount: request.amount,
          orderId: request.orderId,
          description: request.description,
          returnUrl: request.returnUrl,
        });

        if (vietQRResult.code === '00' && vietQRResult.data) {
          return {
            success: true,
            qrCode: vietQRResult.data.qrCode,
            qrCodeUrl: vietQRResult.data.qrDataURL,
            accountNo: vietQRResult.data.accountNo,
            accountName: vietQRResult.data.accountName,
            content: vietQRResult.data.content,
          };
        }

        return {
          success: false,
          error: vietQRResult.desc || 'Failed to create payment',
        };

      case 'momo':
        // MoMo payment
        const momo = getMoMoService();
        const momoResult = await momo.createPayment({
          amount: request.amount,
          orderId: request.orderId,
          orderInfo: request.description,
          returnUrl: request.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${request.orderId}`,
          notifyUrl: request.notifyUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/momo/callback`,
        });

        if (momoResult.resultCode === 0 && momoResult.payUrl) {
          return {
            success: true,
            paymentUrl: momoResult.payUrl,
            qrCodeUrl: momoResult.qrCodeUrl,
            transactionId: momoResult.requestId,
          };
        }

        return {
          success: false,
          error: momoResult.message || 'Failed to create payment',
        };

      case 'vnpay':
        // VNPay - Similar to MoMo
        // TODO: Implement VNPay integration
        return {
          success: false,
          error: 'VNPay integration not yet implemented',
        };

      default:
        return {
          success: false,
          error: 'Invalid payment method',
        };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
}



