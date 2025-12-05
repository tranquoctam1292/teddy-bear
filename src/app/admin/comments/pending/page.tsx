'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CommentsPendingPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/comments?status=pending');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}




