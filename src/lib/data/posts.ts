// Shared Mock Posts Data
// In production, replace with MongoDB queries
import type { Post } from '@/lib/schemas/post';

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Cách chọn gấu bông phù hợp cho bé',
    slug: 'cach-chon-gau-bong-phu-hop-cho-be',
    excerpt: 'Hướng dẫn chi tiết cách chọn gấu bông an toàn và phù hợp với độ tuổi của trẻ.',
    content: '<p>Chọn gấu bông phù hợp cho bé là điều quan trọng để đảm bảo an toàn và mang lại niềm vui cho trẻ...</p>',
    metaTitle: 'Cách chọn gấu bông phù hợp cho bé - The Emotional House',
    metaDescription: 'Hướng dẫn chi tiết cách chọn gấu bông an toàn và phù hợp với độ tuổi của trẻ.',
    keywords: ['gấu bông', 'đồ chơi trẻ em', 'an toàn'],
    category: 'tips',
    tags: ['tips', 'trẻ em', 'an toàn'],
    status: 'published',
    publishedAt: new Date('2025-01-01T10:00:00'),
    author: 'Admin',
    views: 150,
    createdAt: new Date('2025-01-01T09:00:00'),
    updatedAt: new Date('2025-01-01T09:00:00'),
  },
];


