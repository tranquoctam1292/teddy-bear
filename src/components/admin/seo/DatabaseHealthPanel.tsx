'use client';

// Database Health Panel Component
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Progress } from '@/components/admin/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/admin/ui/alert';
import { Badge } from '@/components/admin/ui/badge';
import {
  Database,
  HardDrive,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DatabaseStats {
  size: {
    total: string;
    data: string;
    index: string;
  };
  collections: Array<{
    name: string;
    size: number;
    sizeMB: string;
    count: number;
  }>;
  recommendations: string[];
}

interface CleanupResult {
  success: boolean;
  results: {
    errors404: number;
    keywordRankings: number;
    seoAnalyses: number;
    aiUsageLogs: number;
  };
  duration: number;
  dbSize: DatabaseStats;
}

export default function DatabaseHealthPanel() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/maintenance/cleanup');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch database stats');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const runCleanup = async () => {
    if (!confirm('Are you sure you want to run database cleanup? This will permanently delete old data according to retention policies.')) {
      return;
    }

    try {
      setCleanupLoading(true);
      const response = await fetch('/api/admin/maintenance/cleanup', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setLastCleanup(data.data);
        setStats(data.data.dbSize);
        setError(null);
      } else {
        setError(data.error || 'Cleanup failed');
      }
    } catch (err) {
      setError('Failed to run cleanup');
    } finally {
      setCleanupLoading(false);
    }
  };

  const getHealthStatus = () => {
    if (!stats) return { status: 'unknown', color: 'gray' };

    const totalMB = parseFloat(stats.size.total.replace(' MB', ''));
    
    if (totalMB < 200) {
      return { status: 'excellent', color: 'green' };
    } else if (totalMB < 350) {
      return { status: 'good', color: 'blue' };
    } else if (totalMB < 450) {
      return { status: 'fair', color: 'yellow' };
    } else {
      return { status: 'critical', color: 'red' };
    }
  };

  const health = getHealthStatus();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Health
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

  return (
    <div className="space-y-4">
      {/* Health Status Banner */}
      {stats && (
        <Alert variant={health.color === 'red' ? 'destructive' : 'default'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {health.color === 'green' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <div>
                <AlertTitle>
                  Database Status: {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                </AlertTitle>
                <AlertDescription>
                  Total size: {stats.size.total} / 512 MB (MongoDB Free Tier)
                </AlertDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runCleanup}
              disabled={cleanupLoading}
            >
              {cleanupLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Run Cleanup
                </>
              )}
            </Button>
          </div>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard */}
      {stats && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Health Monitor
                </CardTitle>
                <CardDescription>
                  Monitor database size and manage data retention
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchDatabaseStats}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Size Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Size</span>
                </div>
                <p className="text-2xl font-bold">{stats.size.total}</p>
                <Progress 
                  value={(parseFloat(stats.size.total.replace(' MB', '')) / 512) * 100} 
                  className="mt-2 h-1"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data Size</span>
                </div>
                <p className="text-2xl font-bold">{stats.size.data}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Document storage
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Index Size</span>
                </div>
                <p className="text-2xl font-bold">{stats.size.index}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Query optimization
                </p>
              </div>
            </div>

            {/* Collections Breakdown */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Collections
              </h4>
              <div className="space-y-2">
                {stats.collections
                  .sort((a, b) => b.size - a.size)
                  .map((collection) => (
                    <div
                      key={collection.name}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-medium text-sm min-w-[120px]">
                          {collection.name}
                        </span>
                        <Progress
                          value={(collection.size / 1024 / 1024 / 512) * 100}
                          className="h-2 flex-1 max-w-xs"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                {collection.count.toLocaleString()} docs
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Document count</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-sm font-medium min-w-[60px] text-right">
                          {collection.sizeMB} MB
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recommendations */}
            {stats.recommendations && stats.recommendations.length > 0 && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {stats.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-yellow-800 dark:text-yellow-200"
                    >
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Last Cleanup Results */}
            {lastCleanup && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                    Cleanup Completed Successfully
                  </h4>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="text-sm">
                    <p className="text-green-800 dark:text-green-200">
                      <span className="font-medium">404 Errors:</span> {lastCleanup.results.errors404} cleaned
                    </p>
                    <p className="text-green-800 dark:text-green-200">
                      <span className="font-medium">Keyword Rankings:</span> {lastCleanup.results.keywordRankings} aggregated
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-green-800 dark:text-green-200">
                      <span className="font-medium">SEO Analyses:</span> {lastCleanup.results.seoAnalyses} removed
                    </p>
                    <p className="text-green-800 dark:text-green-200">
                      <span className="font-medium">Duration:</span> {lastCleanup.duration}ms
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Retention Policies Info */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data Retention Policies
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">404 Errors</span>
                  <span className="font-medium">90 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Keyword Rankings</span>
                  <span className="font-medium">365 days (aggregated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SEO Analyses</span>
                  <span className="font-medium">180 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Usage Logs</span>
                  <span className="font-medium">90 days</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Cleanup runs automatically daily at 2 AM UTC
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

