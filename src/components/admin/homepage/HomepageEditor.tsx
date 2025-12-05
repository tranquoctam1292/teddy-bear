'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Eye, History, Calendar, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomepageForm } from './HomepageForm';
import { SectionBuilder } from './SectionBuilder';
import { HomepagePreviewWrapper } from './HomepagePreviewWrapper';
import { VersionHistory } from './VersionHistory';
import { SchedulePublishModal } from './SchedulePublishModal';
import { ABTestingPanel } from './ABTestingPanel';
import { AdvancedSEOSettings } from './AdvancedSEOSettings';
import { HomepageSection } from '@/lib/types/homepage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface HomepageEditorProps {
  config: any;
}

export function HomepageEditor({ config }: HomepageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sections, setSections] = useState<HomepageSection[]>(config.sections || []);
  const [seoSettings, setSeoSettings] = useState(config.seo || {});
  const [activeTab, setActiveTab] = useState('settings');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Auto-save sections when changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(sections) !== JSON.stringify(config.sections)) {
        handleSaveSections(sections);
      }
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [sections]);

  async function handleSave(formData: FormData) {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/homepage/configs/${config._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          seo: {
            title: formData.get('seoTitle'),
            description: formData.get('seoDescription'),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setLastSaved(new Date());
      alert('Configuration saved successfully!');
      router.refresh();
    } catch (error) {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSections(updatedSections: HomepageSection[]) {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/homepage/configs/${config._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections: updatedSections,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save sections');
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      {/* Auto-save indicator */}
      <aside className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-800">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Save className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Last saved at {lastSaved.toLocaleTimeString()}
              </span>
            </>
          ) : (
            <span className="text-sm text-blue-800">
              Ready to edit
            </span>
          )}
        </div>
      </aside>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="sections">
            Sections ({sections.length})
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="seo">
            SEO
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="mr-2 h-4 w-4" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="ab-testing">
            <TrendingUp className="mr-2 h-4 w-4" />
            A/B Test
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <HomepageForm
            action={handleSave}
            defaultValues={{
              name: config.name,
              description: config.description,
              seoTitle: config.seo?.title,
              seoDescription: config.seo?.description,
            }}
          />
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <SectionBuilder
            sections={sections}
            onChange={setSections}
          />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <HomepagePreviewWrapper
            config={{
              ...config,
              sections,
            }}
          />
        </TabsContent>

        {/* Advanced SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <AdvancedSEOSettings
            seo={seoSettings}
            onChange={setSeoSettings}
          />
          <Button
            onClick={() => handleSaveSections(sections)}
            disabled={saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save SEO Settings
          </Button>
        </TabsContent>

        {/* Version History Tab */}
        <TabsContent value="versions" className="space-y-4">
          <VersionHistory configId={config._id} />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Publishing</CardTitle>
              <CardDescription>
                Schedule when this configuration should go live
              </CardDescription>
            </CardHeader>
            <CardContent>
              {config.status === 'scheduled' && config.scheduledAt ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⏰ Scheduled to publish on{' '}
                    {new Date(config.scheduledAt).toLocaleString()}
                  </p>
                  {config.expiresAt && (
                    <p className="text-sm text-yellow-800 mt-1">
                      Will expire on {new Date(config.expiresAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : null}

              <Button onClick={() => setShowScheduleModal(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                {config.status === 'scheduled'
                  ? 'Change Schedule'
                  : 'Schedule Publish'}
              </Button>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900">Scheduled Publishing</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Set future publish date and time</li>
                  <li>• Configuration auto-publishes at scheduled time</li>
                  <li>• Previous config is automatically archived</li>
                  <li>• Optional expiration date</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="ab-testing" className="space-y-4">
          <ABTestingPanel configId={config._id} configName={config.name} />
        </TabsContent>
      </Tabs>

      {/* Schedule Modal */}
      <SchedulePublishModal
        configId={config._id}
        currentSchedule={{
          scheduledAt: config.scheduledAt,
          expiresAt: config.expiresAt,
        }}
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </section>
  );
}

