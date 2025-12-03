'use client';

// Admin Contact Listing Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Archive,
  MessageSquare,
  Trash2,
  Edit,
} from 'lucide-react';
import type { ContactMessage } from '@/lib/schemas/contact';
import { Button } from '@/components/admin/ui/button';
import { Badge } from '@/components/admin/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

interface ContactsResponse {
  contacts: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
  };
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ContactMessage['status'] | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContacts();
    }
  }, [status, currentPage, searchQuery, readFilter, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (readFilter) {
        params.append('isRead', readFilter);
      }
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/contacts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch contacts');

      const data: ContactsResponse = await response.json();
      setContacts(data.contacts);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (contactId: string, currentReadStatus: boolean) => {
    try {
      setUpdatingStatus(contactId);
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRead: !currentReadStatus,
          status: !currentReadStatus ? 'read' : 'new',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update contact');
      }

      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusUpdate = async (
    contactId: string,
    newStatus: ContactMessage['status']
  ) => {
    try {
      setUpdatingStatus(contactId);
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update contact');
      }

      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const getStatusBadge = (contact: ContactMessage) => {
    if (!contact.isRead) {
      return <Badge variant="warning">Chưa đọc</Badge>;
    }
    switch (contact.status) {
      case 'new':
        return <Badge variant="info">Mới</Badge>;
      case 'read':
        return <Badge variant="success">Đã đọc</Badge>;
      case 'replied':
        return <Badge variant="success">Đã trả lời</Badge>;
      case 'archived':
        return <Badge variant="secondary">Đã lưu trữ</Badge>;
      default:
        return <Badge variant="default">{contact.status}</Badge>;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin nhắn</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tổng cộng {stats.total} tin nhắn ({stats.unread} chưa đọc)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chưa đọc</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.unread}</p>
              </div>
              <EyeOff className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã đọc</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.read}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 md:flex md:items-center md:gap-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, chủ đề..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={readFilter}
              onChange={(e) => {
                setReadFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            >
              <option value="">Tất cả</option>
              <option value="false">Chưa đọc</option>
              <option value="true">Đã đọc</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ContactMessage['status'] | '');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="read">Đã đọc</option>
              <option value="replied">Đã trả lời</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người gửi</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có tin nhắn nào</p>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className={!contact.isRead ? 'bg-yellow-50' : ''}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      {contact.phone && (
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{contact.subject}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {contact.message}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contact)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(contact.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(contact.id, contact.isRead)}
                          disabled={updatingStatus === contact.id}
                          title={contact.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                        >
                          {updatingStatus === contact.id ? (
                            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                          ) : contact.isRead ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <select
                          value={contact.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              contact.id,
                              e.target.value as ContactMessage['status']
                            )
                          }
                          disabled={updatingStatus === contact.id}
                          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                        >
                          <option value="new">Mới</option>
                          <option value="read">Đã đọc</option>
                          <option value="replied">Đã trả lời</option>
                          <option value="archived">Đã lưu trữ</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(currentPage - 1) * pagination.limit + 1} -{' '}
                {Math.min(currentPage * pagination.limit, pagination.total)} trong tổng số{' '}
                {pagination.total} tin nhắn
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Trang {currentPage} / {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={currentPage === pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

