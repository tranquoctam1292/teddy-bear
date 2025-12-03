'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostTagsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main products settings where TagManager is properly configured
    router.replace('/admin/settings/products');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to Product Settings...</p>
      </div>
    </div>
  );
}

