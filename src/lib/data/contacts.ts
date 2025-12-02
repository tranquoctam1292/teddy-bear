// Shared Mock Contact Messages Data
// In production, replace with MongoDB queries
import type { ContactMessage } from '@/lib/schemas/contact';

export const mockContacts: ContactMessage[] = [
  {
    id: 'contact-1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    subject: 'Câu hỏi về sản phẩm',
    message: 'Tôi muốn biết thêm thông tin về sản phẩm gấu bông Teddy size 1m2. Có thể giao hàng trong ngày không?',
    isRead: false,
    isReplied: false,
    status: 'new',
    createdAt: new Date('2025-01-02T10:00:00'),
    updatedAt: new Date('2025-01-02T10:00:00'),
  },
  {
    id: 'contact-2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0907654321',
    subject: 'Đặt hàng số lượng lớn',
    message: 'Tôi muốn đặt 50 con gấu bông để làm quà tặng cho sự kiện. Có thể có giá ưu đãi không?',
    isRead: true,
    isReplied: true,
    status: 'replied',
    adminNotes: 'Đã liên hệ và gửi báo giá. Khách hàng sẽ phản hồi trong tuần này.',
    createdAt: new Date('2025-01-01T14:30:00'),
    updatedAt: new Date('2025-01-01T16:00:00'),
    readAt: new Date('2025-01-01T15:00:00'),
    repliedAt: new Date('2025-01-01T16:00:00'),
  },
];


