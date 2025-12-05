'use client';

import { useState, useEffect } from 'react';
import { HomepageToolbar } from './HomepageToolbar';

interface HomepageToolbarWrapperProps {
  status: string;
}

export function HomepageToolbarWrapper({ status }: HomepageToolbarWrapperProps) {
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    published: 0,
    draft: 0,
    archived: 0,
    scheduled: 0,
  });
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  async function fetchStatusCounts() {
    try {
      // Fetch all status counts by making separate requests
      const [allRes, publishedRes, draftRes, archivedRes, scheduledRes] = await Promise.all([
        fetch('/api/admin/homepage/configs?limit=1'),
        fetch('/api/admin/homepage/configs?status=published&limit=1'),
        fetch('/api/admin/homepage/configs?status=draft&limit=1'),
        fetch('/api/admin/homepage/configs?status=archived&limit=1'),
        fetch('/api/admin/homepage/configs?status=scheduled&limit=1'),
      ]);

      const [allData, publishedData, draftData, archivedData, scheduledData] = await Promise.all([
        allRes.ok ? allRes.json() : { total: 0 },
        publishedRes.ok ? publishedRes.json() : { total: 0 },
        draftRes.ok ? draftRes.json() : { total: 0 },
        archivedRes.ok ? archivedRes.json() : { total: 0 },
        scheduledRes.ok ? scheduledRes.json() : { total: 0 },
      ]);

      setStatusCounts({
        all: allData.total || 0,
        published: publishedData.total || 0,
        draft: draftData.total || 0,
        archived: archivedData.total || 0,
        scheduled: scheduledData.total || 0,
      });
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  }

  async function handleBulkAction(action: string) {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action);
  }

  return (
    <HomepageToolbar
      statusCounts={statusCounts}
      selectedCount={selectedCount}
      onBulkAction={handleBulkAction}
    />
  );
}

