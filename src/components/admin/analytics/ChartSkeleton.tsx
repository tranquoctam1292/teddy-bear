'use client';

// Loading skeleton for charts
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="flex items-end justify-between h-full px-4 pb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t-lg"
            style={{
              width: '7%',
              height: `${Math.random() * 80 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PieChartSkeleton() {
  return (
    <div className="animate-pulse flex items-center justify-center" style={{ height: 250 }}>
      <div className="w-40 h-40 rounded-full bg-gray-200" />
    </div>
  );
}

