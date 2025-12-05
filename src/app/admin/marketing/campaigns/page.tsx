'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Mail, Send, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { EmailCampaign } from '@/lib/types/marketing';

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/marketing/campaigns');
      if (!response.ok) throw new Error('Failed to load');
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải campaigns!');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-700' },
      scheduled: { label: 'Đã lên lịch', className: 'bg-blue-100 text-blue-700' },
      sending: { label: 'Đang gửi', className: 'bg-yellow-100 text-yellow-700' },
      sent: { label: 'Đã gửi', className: 'bg-green-100 text-green-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-7 w-7" />
              Email Marketing Campaigns
            </h1>
            <p className="text-gray-600 mt-1">Quản lý các chiến dịch email marketing</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadCampaigns} variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo campaign mới
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có campaign nào</h3>
          <p className="text-gray-600 mb-6">Tạo campaign email đầu tiên của bạn</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo campaign
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{campaign.subject}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {campaign.sentAt && (
                      <span>Đã gửi: {new Date(campaign.sentAt).toLocaleString('vi-VN')}</span>
                    )}
                    {campaign.scheduledAt && (
                      <span>Lên lịch: {new Date(campaign.scheduledAt).toLocaleString('vi-VN')}</span>
                    )}
                    {campaign.totalSent && (
                      <>
                        <span>📧 {campaign.totalSent} đã gửi</span>
                        <span>👁 {campaign.totalOpened} đã mở</span>
                        <span>🖱 {campaign.totalClicked} đã click</span>
                      </>
                    )}
                  </div>

                  {campaign.openRate !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Open Rate: </span>
                          <span className="font-bold text-blue-600">{campaign.openRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Click Rate: </span>
                          <span className="font-bold text-green-600">{campaign.clickRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Gửi
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">📧 Email Marketing Setup</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Cấu hình SMTP trong Settings → Notifications</li>
          <li>• Tạo email template với HTML editor</li>
          <li>• Import danh sách subscribers (CSV)</li>
          <li>• Track performance với open/click rates</li>
          <li>• A/B testing subjects để tối ưu</li>
        </ul>
      </div>
    </div>
  );
}




