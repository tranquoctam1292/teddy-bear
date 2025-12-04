/**
 * MoMo Payment Gateway Integration
 * 
 * MoMo Payment Gateway API
 * Documentation: https://developers.momo.vn/
 */

interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  environment?: 'sandbox' | 'production';
}

interface CreatePaymentRequest {
  amount: number; // Số tiền (VND)
  orderId: string; // Mã đơn hàng
  orderInfo: string; // Thông tin đơn hàng
  returnUrl: string; // URL redirect sau khi thanh toán
  notifyUrl: string; // URL webhook để nhận kết quả thanh toán
  extraData?: string; // Dữ liệu bổ sung
}

interface MoMoResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string; // URL để redirect user đến trang thanh toán
  qrCodeUrl?: string; // QR code URL
  deeplink?: string; // Deep link cho mobile app
}

export class MoMoService {
  private config: MoMoConfig;
  private baseUrl: string;

  constructor(config: MoMoConfig) {
    this.config = config;
    this.baseUrl =
      config.environment === 'production'
        ? 'https://payment.momo.vn/v2/gateway/api/create'
        : 'https://test-payment.momo.vn/v2/gateway/api/create';
  }

  /**
   * Tạo payment request
   */
  async createPayment(request: CreatePaymentRequest): Promise<MoMoResponse> {
    try {
      const requestId = `${Date.now()}`;
      const orderId = request.orderId;
      const orderInfo = request.orderInfo;
      const amount = request.amount;
      const ipnUrl = request.notifyUrl;
      const redirectUrl = request.returnUrl;
      const extraData = request.extraData || '';

      // Create signature
      const rawSignature = `accessKey=${this.config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.config.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

      // In production, use crypto to create HMAC SHA256 signature
      // For now, we'll use a mock implementation
      const signature = await this.createSignature(rawSignature);

      const requestBody = {
        partnerCode: this.config.partnerCode,
        partnerName: 'The Emotional House',
        storeId: 'TeddyShop',
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: 'vi',
        extraData,
        requestType: 'captureWallet',
        signature,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`MoMo API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        partnerCode: data.partnerCode,
        orderId: data.orderId,
        requestId: data.requestId,
        amount: data.amount,
        responseTime: data.responseTime,
        message: data.message,
        resultCode: data.resultCode,
        payUrl: data.payUrl,
        qrCodeUrl: data.qrCodeUrl,
        deeplink: data.deeplink,
      };
    } catch (error) {
      console.error('MoMo payment error:', error);
      throw error;
    }
  }

  /**
   * Create HMAC SHA256 signature
   */
  private async createSignature(rawSignature: string): Promise<string> {
    // In production, use crypto to create HMAC SHA256
    // For now, return mock signature
    if (typeof window === 'undefined') {
      // Server-side: use Node.js crypto
      const crypto = await import('crypto');
      return crypto
        .createHmac('sha256', this.config.secretKey)
        .update(rawSignature)
        .digest('hex');
    }
    // Client-side: should not happen
    return '';
  }

  /**
   * Verify payment callback
   */
  async verifyCallback(data: any): Promise<boolean> {
    // Verify signature from MoMo callback
    // Implementation depends on MoMo's callback format
    return false;
  }
}

// Export singleton instance
let momoInstance: MoMoService | null = null;

export function getMoMoService(): MoMoService {
  if (!momoInstance) {
    const config: MoMoConfig = {
      partnerCode: process.env.MOMO_PARTNER_CODE || '',
      accessKey: process.env.MOMO_ACCESS_KEY || '',
      secretKey: process.env.MOMO_SECRET_KEY || '',
      environment: (process.env.MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    };

    if (!config.partnerCode || !config.accessKey || !config.secretKey) {
      console.warn('⚠️  MoMo credentials not configured. Payment will not work.');
    }

    momoInstance = new MoMoService(config);
  }

  return momoInstance;
}




