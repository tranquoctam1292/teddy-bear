// Dynamic Badge Counting Hook
import { useState, useEffect } from 'react';

interface BadgeCounts {
  messages: number;
  comments: number;
  orders: number;
  appearance: number;
}

export function useBadgeCounts(): BadgeCounts {
  const [counts, setCounts] = useState<BadgeCounts>({
    messages: 0,
    comments: 0,
    orders: 0,
    appearance: 0,
  });

  useEffect(() => {
    // Fetch badge counts from API
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/admin/badge-counts');
        if (response.ok) {
          const data = await response.json();
          setCounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch badge counts:', error);
      }
    };

    fetchCounts();

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchCounts, 30000);

    return () => clearInterval(interval);
  }, []);

  return counts;
}

// Mock data for now (until API is created)
export function useMockBadgeCounts(): BadgeCounts {
  return {
    messages: 39,
    comments: 12,
    orders: 5,
    appearance: 7,
  };
}




