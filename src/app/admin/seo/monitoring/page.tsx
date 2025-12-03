// SEO Monitoring & System Health Page
import { Metadata } from 'next';
import AIUsageDashboard from '@/components/admin/seo/AIUsageDashboard';
import DatabaseHealthPanel from '@/components/admin/seo/DatabaseHealthPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs';
import { Activity, Database, Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEO Monitoring | Admin Dashboard',
  description: 'Monitor AI usage, database health, and system performance',
};

export default function SEOMonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO System Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor AI usage, database health, and system performance metrics
        </p>
      </div>

      {/* Tabs for different monitoring sections */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai-usage" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Usage
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AIUsageDashboard />
            <DatabaseHealthPanel />
          </div>
        </TabsContent>

        {/* AI Usage Tab */}
        <TabsContent value="ai-usage">
          <AIUsageDashboard />
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <DatabaseHealthPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

