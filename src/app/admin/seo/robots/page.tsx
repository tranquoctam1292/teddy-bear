/**
 * Robots.txt Management Page
 * 
 * Visual editor and tester for robots.txt
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RobotsEditor from '@/components/admin/seo/RobotsEditor';
import RobotsTester from '@/components/admin/seo/RobotsTester';

export default function RobotsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadRobotsTxt();
    }
  }, [status]);

  const loadRobotsTxt = async () => {
    try {
      const response = await fetch('/api/admin/seo/robots');
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('Error loading robots.txt:', error);
    }
  };

  const handleSave = async (newContent: string, isCustom: boolean) => {
    setContent(newContent);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Robots.txt Management</h1>
        <p className="text-gray-600 mt-2">
          Chỉnh sửa và kiểm tra file robots.txt của website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RobotsEditor onSave={handleSave} />
        </div>
        <div>
          <RobotsTester content={content} />
        </div>
      </div>
    </div>
  );
}



