'use client';

// Admin Notifications Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import EmailTemplateManager from '@/components/admin/EmailTemplateManager';
import EmailTemplateForm from '@/components/admin/EmailTemplateForm';
import SMTPConfigForm from '@/components/admin/SMTPConfigForm';
import SystemNotificationManager from '@/components/admin/SystemNotificationManager';
import type { EmailTemplate } from '@/lib/schemas/notification-settings';
import type { SMTPConfig } from '@/lib/schemas/notification-settings';
import type { SystemNotification } from '@/lib/schemas/notification-settings';

export default function AdminNotificationsSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Email Templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>();
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // SMTP Config state
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig | undefined>();
  const [smtpLoading, setSmtpLoading] = useState(true);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // System Notifications state
  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTemplates();
      fetchSMTPConfig();
      fetchSystemNotifications();
    }
  }, [status]);

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const response = await fetch('/api/admin/settings/email-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const fetchSMTPConfig = async () => {
    try {
      setSmtpLoading(true);
      const response = await fetch('/api/admin/settings/smtp');
      if (!response.ok) throw new Error('Failed to fetch SMTP config');
      const data = await response.json();
      setSmtpConfig(data.config);
    } catch (error) {
      console.error('Error fetching SMTP config:', error);
    } finally {
      setSmtpLoading(false);
    }
  };

  const fetchSystemNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await fetch('/api/admin/settings/system-notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setSystemNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching system notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Template handlers
  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleSaveTemplate = async (data: any) => {
    try {
      setIsSavingTemplate(true);
      const url = editingTemplate
        ? `/api/admin/settings/email-templates/${editingTemplate.id}`
        : '/api/admin/settings/email-templates';
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save template');
      }

      setShowTemplateForm(false);
      setEditingTemplate(undefined);
      await fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu template');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    try {
      const response = await fetch(`/api/admin/settings/email-templates/${template.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
      }

      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa template');
      throw error;
    }
  };

  // SMTP handlers
  const handleSaveSMTP = async (data: any) => {
    try {
      setIsSavingSmtp(true);
      const response = await fetch('/api/admin/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save SMTP config');
      }

      await fetchSMTPConfig();
    } catch (error) {
      console.error('Error saving SMTP config:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu cấu hình SMTP');
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleTestSMTP = async () => {
    try {
      setIsTestingSmtp(true);
      const response = await fetch('/api/admin/settings/smtp/test', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'SMTP test failed');
      }

      await fetchSMTPConfig();
      alert('Test SMTP thành công!');
    } catch (error) {
      console.error('Error testing SMTP:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi test SMTP');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // System Notification handlers
  const handleUpdateNotification = async (notification: SystemNotification) => {
    try {
      const response = await fetch('/api/admin/settings/system-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update notification');
      }

      await fetchSystemNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông báo');
    }
  };

  if (status === 'loading') {
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
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email & Thông báo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Cài đặt email templates và thông báo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Email Templates Section */}
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Quản lý các mẫu email: xác nhận đơn hàng, thông báo vận chuyển, cảm ơn khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showTemplateForm ? (
              <EmailTemplateForm
                template={editingTemplate}
                onSubmit={handleSaveTemplate}
                onCancel={() => {
                  setShowTemplateForm(false);
                  setEditingTemplate(undefined);
                }}
                isLoading={isSavingTemplate}
              />
            ) : (
              <EmailTemplateManager
                templates={templates}
                onCreate={handleCreateTemplate}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                isLoading={templatesLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* SMTP Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình SMTP</CardTitle>
            <CardDescription>
              Cấu hình máy chủ email để gửi thông báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SMTPConfigForm
              config={smtpConfig}
              onSubmit={handleSaveSMTP}
              onTest={handleTestSMTP}
              isLoading={isSavingSmtp}
              isTesting={isTestingSmtp}
            />
          </CardContent>
        </Card>

        {/* System Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo hệ thống</CardTitle>
            <CardDescription>
              Cấu hình các thông báo trong hệ thống admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SystemNotificationManager
              notifications={systemNotifications}
              onUpdate={handleUpdateNotification}
              isLoading={notificationsLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

