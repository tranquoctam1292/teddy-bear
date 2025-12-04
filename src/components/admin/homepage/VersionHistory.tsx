'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { History, RotateCcw, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

interface Version {
  _id: string;
  configId: string;
  versionNumber: number;
  name: string;
  sections: any[];
  status: string;
  createdBy: string;
  createdAt: string;
  note?: string;
}

interface VersionHistoryProps {
  configId: string;
}

export function VersionHistory({ configId }: VersionHistoryProps) {
  const router = useRouter();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    fetchVersions();
  }, [configId]);

  async function fetchVersions() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/versions`
      );
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveVersion() {
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/versions`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) throw new Error('Failed to save version');

      alert('Version saved successfully!');
      fetchVersions();
    } catch (error) {
      alert('Failed to save version');
    }
  }

  async function handleRestore(version: Version) {
    setRestoring(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/restore`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ versionId: version._id }),
        }
      );

      if (!response.ok) throw new Error('Failed to restore version');

      alert('Configuration restored successfully!');
      setSelectedVersion(null);
      router.refresh();
    } catch (error) {
      alert('Failed to restore version');
    } finally {
      setRestoring(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Version History</CardTitle>
              <CardDescription>
                Restore previous versions or save current state
              </CardDescription>
            </div>
            <Button onClick={handleSaveVersion} size="sm">
              <History className="mr-2 h-4 w-4" />
              Save Version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No versions yet. Click "Save Version" to create a snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version._id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Version {version.versionNumber}
                      </span>
                      {version.note && (
                        <Badge variant="outline">{version.note}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {version.sections?.length || 0} sections •{' '}
                      {formatDistanceToNow(new Date(version.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVersion(version)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRestore(version)}
                      disabled={restoring}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Version Dialog */}
      <Dialog
        open={!!selectedVersion}
        onOpenChange={(open) => !open && setSelectedVersion(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version {selectedVersion?.versionNumber}</DialogTitle>
            <DialogDescription>
              Created {selectedVersion &&
                formatDistanceToNow(new Date(selectedVersion.createdAt), {
                  addSuffix: true,
                })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Sections:</Label>
              <div className="mt-2 space-y-2">
                {selectedVersion?.sections?.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded border p-2"
                  >
                    <span className="text-sm font-medium">{section.name}</span>
                    <Badge variant="outline">{section.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedVersion(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => selectedVersion && handleRestore(selectedVersion)}
              disabled={restoring}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore This Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

