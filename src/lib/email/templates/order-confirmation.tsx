/**
 * Order Confirmation Email Template
 */

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
  };
  paymentMethod: string;
  estimatedDelivery?: string;
}

export function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Size: ${item.size}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
    </tr>
  `
    )
    .join('');

  const estimatedDeliveryText = data.estimatedDelivery
    ? `<p style="margin: 16px 0; color: #666;">📦 <strong>Dự kiến giao hàng:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString('vi-VN')}</p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng #${data.orderId}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #ec4899;">The Emotional House</h1>
    <p style="margin: 10px 0 0; color: #be185d;">Cảm ơn bạn đã đặt hàng!</p>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #ec4899; margin-top: 0;">Xác nhận đơn hàng #${data.orderId}</h2>
    
    <p>Xin chào <strong>${data.customerName}</strong>,</p>
    
    <p>Chúng tôi đã nhận được đơn hàng của bạn và đang chuẩn bị giao hàng. Dưới đây là thông tin chi tiết:</p>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #ec4899;">Thông tin đơn hàng</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background: #fce7f3;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ec4899;">Sản phẩm</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ec4899;">Số lượng</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ec4899;">Đơn giá</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ec4899;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #eee;"><strong>Tạm tính:</strong></td>
            <td style="padding: 12px; text-align: right; border-top: 2px solid #eee;">${data.subtotal.toLocaleString('vi-VN')}đ</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right;"><strong>Phí vận chuyển:</strong></td>
            <td style="padding: 12px; text-align: right;">${data.shippingFee.toLocaleString('vi-VN')}đ</td>
          </tr>
          <tr style="background: #fce7f3;">
            <td colspan="3" style="padding: 12px; text-align: right;"><strong style="font-size: 18px;">Tổng cộng:</strong></td>
            <td style="padding: 12px; text-align: right;"><strong style="font-size: 18px; color: #ec4899;">${data.total.toLocaleString('vi-VN')}đ</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #ec4899;">Thông tin giao hàng</h3>
      <p style="margin: 8px 0;"><strong>Người nhận:</strong> ${data.shippingAddress.fullName}</p>
      <p style="margin: 8px 0;"><strong>Điện thoại:</strong> ${data.shippingAddress.phone}</p>
      <p style="margin: 8px 0;"><strong>Địa chỉ:</strong> ${data.shippingAddress.address}, ${data.shippingAddress.ward}, ${data.shippingAddress.district}, ${data.shippingAddress.city}</p>
    </div>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #ec4899;">Phương thức thanh toán</h3>
      <p style="margin: 8px 0;">
        ${data.paymentMethod === 'cod' ? '💰 Thanh toán khi nhận hàng (COD)' : ''}
        ${data.paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản ngân hàng' : ''}
        ${data.paymentMethod === 'momo' ? '📱 MoMo' : ''}
        ${data.paymentMethod === 'vnpay' ? '💳 VNPay' : ''}
      </p>
      ${estimatedDeliveryText}
    </div>

    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>📞 Liên hệ hỗ trợ:</strong></p>
      <p style="margin: 8px 0;">Email: support@emotionalhouse.vn</p>
      <p style="margin: 8px 0;">Hotline: 1900-xxxx</p>
    </div>

    <p style="margin-top: 30px;">Chúng tôi sẽ cập nhật trạng thái đơn hàng qua email. Cảm ơn bạn đã tin tưởng The Emotional House!</p>

    <p style="margin-top: 20px;">Trân trọng,<br><strong>The Emotional House Team</strong></p>
  </div>

  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 12px;">
      © ${new Date().getFullYear()} The Emotional House. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}


