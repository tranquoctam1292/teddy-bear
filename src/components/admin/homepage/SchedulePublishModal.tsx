'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Loader2, X } from 'lucide-react';

interface SchedulePublishModalProps {
  configId: string;
  currentSchedule?: {
    scheduledAt?: string;
    expiresAt?: string;
  };
  open: boolean;
  onClose: () => void;
}

export function SchedulePublishModal({
  configId,
  currentSchedule,
  open,
  onClose,
}: SchedulePublishModalProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(
    currentSchedule?.scheduledAt
      ? new Date(currentSchedule.scheduledAt).toISOString().slice(0, 16)
      : ''
  );
  const [expiresAt, setExpiresAt] = useState(
    currentSchedule?.expiresAt
      ? new Date(currentSchedule.expiresAt).toISOString().slice(0, 16)
      : ''
  );

  async function handleSchedule() {
    if (!scheduledAt) {
      alert('Please select a publish date and time');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/schedule`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scheduledAt: new Date(scheduledAt).toISOString(),
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to schedule');
      }

      alert('Configuration scheduled successfully!');
      router.refresh();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to schedule configuration');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelSchedule() {
    if (!confirm('Cancel scheduled publishing?')) return;

    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/schedule`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to cancel schedule');

      alert('Schedule cancelled successfully!');
      router.refresh();
      onClose();
    } catch (error) {
      alert('Failed to cancel schedule');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Publishing</DialogTitle>
          <DialogDescription>
            Set when this configuration should go live
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Publish Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-at">
              Publish Date & Time <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="scheduled-at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="pl-8"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Configuration will automatically publish at this time
            </p>
          </div>

          {/* Expiration Date (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="expires-at">Expiration Date (Optional)</Label>
            <div className="relative">
              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="expires-at"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="pl-8"
                min={scheduledAt || undefined}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Configuration will automatically revert after this time
            </p>
          </div>

          {/* Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">How it works</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Configuration status changes to "Scheduled"</li>
              <li>• At scheduled time, it will auto-publish</li>
              <li>• Previous published config will be archived</li>
              <li>• Visitors will see new homepage immediately</li>
              {expiresAt && <li>• After expiration, it will auto-revert</li>}
            </ul>
          </div>
        </div>

        <DialogFooter>
          {currentSchedule?.scheduledAt && (
            <Button
              variant="destructive"
              onClick={handleCancelSchedule}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Schedule
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={saving || !scheduledAt}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

