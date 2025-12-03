'use client';

// AI Usage Dashboard Component
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Progress } from '@/components/admin/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/admin/ui/alert';
import { Badge } from '@/components/admin/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle 
} from 'lucide-react';

interface AIUsageStats {
  daily: number;
  monthly: number;
  limits: {
    daily: number;
    monthly: number;
  };
  totalCost: number;
  remaining: {
    daily: number;
    monthly: number;
  };
  percentage: {
    daily: number;
    monthly: number;
  };
  recentActivity: {
    action: string;
    provider: string;
    timestamp: Date;
    tokensUsed?: number;
    cost?: number;
    success: boolean;
  }[];
}

export default function AIUsageDashboard() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsageStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/admin/seo/ai/usage');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch usage stats');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Usage Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Usage Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'No data available'}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const dailyPercentage = stats.percentage.daily;
  const monthlyPercentage = stats.percentage.monthly;
  const isNearDailyLimit = dailyPercentage >= 80;
  const isNearMonthlyLimit = monthlyPercentage >= 80;

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      {(isNearDailyLimit || isNearMonthlyLimit) && (
        <Alert variant={dailyPercentage >= 100 || monthlyPercentage >= 100 ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Usage Warning</AlertTitle>
          <AlertDescription>
            {dailyPercentage >= 100 || monthlyPercentage >= 100
              ? 'You have reached your AI usage limit. Please wait for the limit to reset.'
              : 'You are approaching your AI usage limit. Consider optimizing your usage.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Usage Dashboard
          </CardTitle>
          <CardDescription>
            Track your AI API usage and costs in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Daily Usage</span>
                </div>
                <Badge variant={isNearDailyLimit ? 'destructive' : 'secondary'}>
                  {stats.daily} / {stats.limits.daily}
                </Badge>
              </div>
              <Progress value={dailyPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {stats.remaining.daily} requests remaining today
              </p>
            </div>

            {/* Monthly Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Monthly Usage</span>
                </div>
                <Badge variant={isNearMonthlyLimit ? 'destructive' : 'secondary'}>
                  {stats.monthly} / {stats.limits.monthly}
                </Badge>
              </div>
              <Progress value={monthlyPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {stats.remaining.monthly} requests remaining this month
              </p>
            </div>
          </div>

          {/* Cost Tracking */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium">Total Cost This Month</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${stats.totalCost.toFixed(4)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Estimated cost based on token usage
            </p>
          </div>

          {/* Recent Activity */}
          {stats.recentActivity && stats.recentActivity.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {activity.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium capitalize">
                          {activity.action.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {activity.provider}
                      </Badge>
                      {activity.tokensUsed && (
                        <span className="text-xs text-muted-foreground">
                          {activity.tokensUsed} tokens
                        </span>
                      )}
                      {activity.cost && activity.cost > 0 && (
                        <span className="text-xs font-medium text-green-600">
                          ${activity.cost.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Tips to Optimize Usage
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Use rule-based generation for simple content</li>
              <li>Enable AI only when you need creative, unique content</li>
              <li>Batch multiple content generations when possible</li>
              <li>Review and reuse previously generated content</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

