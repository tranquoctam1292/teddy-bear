/**
 * VietQR Payment Gateway Integration
 * 
 * VietQR là dịch vụ tạo mã QR thanh toán tự động
 * API Documentation: https://docs.vietqr.io/
 */

interface VietQRConfig {
  clientId: string;
  apiKey: string;
  accountNo: string; // Số tài khoản ngân hàng
  accountName: string; // Tên chủ tài khoản
  template?: string; // Template QR code
  isProduction?: boolean;
}

interface CreatePaymentRequest {
  amount: number; // Số tiền (VND)
  orderId: string; // Mã đơn hàng
  description: string; // Mô tả thanh toán
  returnUrl?: string; // URL redirect sau khi thanh toán
}

interface VietQRResponse {
  code: string; // Response code
  desc: string; // Description
  data?: {
    qrCode: string; // QR code data
    qrDataURL: string; // QR code image URL
    accountNo: string;
    accountName: string;
    amount: number;
    content: string; // Nội dung chuyển khoản
  };
}

export class VietQRService {
  private config: VietQRConfig;
  private baseUrl: string;

  constructor(config: VietQRConfig) {
    this.config = config;
    this.baseUrl = config.isProduction
      ? 'https://api.vietqr.io/v2'
      : 'https://api.vietqr.io/v2';
  }

  /**
   * Tạo payment request và nhận QR code
   */
  async createPayment(request: CreatePaymentRequest): Promise<VietQRResponse> {
    try {
      // Generate payment content
      const content = `${request.orderId} ${request.description}`.substring(0, 100);

      // Call VietQR API
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': this.config.clientId,
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          accountNo: this.config.accountNo,
          accountName: this.config.accountName,
          acqId: '970415', // Bank code (example: Vietcombank)
          amount: request.amount,
          addInfo: content,
          format: 'text',
          template: this.config.template || 'compact',
        }),
      });

      if (!response.ok) {
        throw new Error(`VietQR API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        code: data.code || '00',
        desc: data.desc || 'Success',
        data: {
          qrCode: data.data?.qrDataURL || '',
          qrDataURL: data.data?.qrDataURL || '',
          accountNo: this.config.accountNo,
          accountName: this.config.accountName,
          amount: request.amount,
          content,
        },
      };
    } catch (error) {
      console.error('VietQR payment error:', error);
      throw error;
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(orderId: string): Promise<boolean> {
    // In production, this would call VietQR webhook or check transaction
    // For now, return mock verification
    return false;
  }
}

// Export singleton instance
let vietQRInstance: VietQRService | null = null;

export function getVietQRService(): VietQRService {
  if (!vietQRInstance) {
    const config: VietQRConfig = {
      clientId: process.env.VIETQR_CLIENT_ID || '',
      apiKey: process.env.VIETQR_API_KEY || '',
      accountNo: process.env.VIETQR_ACCOUNT_NO || '',
      accountName: process.env.VIETQR_ACCOUNT_NAME || 'The Emotional House',
      isProduction: process.env.NODE_ENV === 'production',
    };

    if (!config.clientId || !config.apiKey || !config.accountNo) {
      console.warn('⚠️  VietQR credentials not configured. Payment will not work.');
    }

    vietQRInstance = new VietQRService(config);
  }

  return vietQRInstance;
}



