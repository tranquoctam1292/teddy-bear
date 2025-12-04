'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingUp, Eye, Trash2, Award, Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Variant {
  _id: string;
  name: string;
  slug: string;
  status: string;
  variantWeight: number;
  isVariant: boolean;
  originalConfigId: string;
}

interface ABTestingPanelProps {
  configId: string;
  configName: string;
}

export function ABTestingPanel({ configId, configName }: ABTestingPanelProps) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantWeight, setVariantWeight] = useState(50);

  useEffect(() => {
    fetchVariants();
  }, [configId]);

  async function fetchVariants() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/variant`
      );
      const data = await response.json();
      setVariants(data.variants || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateVariant() {
    if (!variantName.trim()) {
      alert('Please enter a variant name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(
        `/api/admin/homepage/configs/${configId}/variant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: variantName,
            variantWeight: variantWeight,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create variant');
      }

      const data = await response.json();
      alert('Variant created successfully!');
      
      // Navigate to edit variant
      router.push(`/admin/homepage/${data.variant._id}/edit`);
    } catch (error: any) {
      alert(error.message || 'Failed to create variant');
    } finally {
      setCreating(false);
    }
  }

  const totalWeight = variants.reduce((sum, v) => sum + v.variantWeight, 0);
  const remainingWeight = 100 - totalWeight;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>A/B Testing</CardTitle>
              <CardDescription>
                Test different homepage versions to optimize conversions
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              disabled={remainingWeight <= 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Variant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Original Config */}
          <div className="mb-4 rounded-lg border border-primary/50 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Original: {configName}</span>
                  <Badge>Control</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Traffic: {100 - totalWeight}%
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/homepage/${configId}/edit`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
            </div>
          </div>

          {/* Variants */}
          {variants.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No variants yet. Create a variant to start A/B testing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((variant) => (
                <div
                  key={variant._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{variant.name}</span>
                      <Badge variant="outline">Variant</Badge>
                      {variant.status === 'published' && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Traffic: {variant.variantWeight}%
                        </span>
                        <Progress value={variant.variantWeight} className="flex-1 max-w-[200px]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/homepage/${variant._id}/edit`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weight Summary */}
          {variants.length > 0 && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="font-semibold mb-2">Traffic Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Original (Control)</span>
                  <span className="font-medium">{100 - totalWeight}%</span>
                </div>
                {variants.map((variant) => (
                  <div key={variant._id} className="flex justify-between text-sm">
                    <span>{variant.name}</span>
                    <span className="font-medium">{variant.variantWeight}%</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* A/B Testing Info */}
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">How A/B Testing Works</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Create variants with different content/layout</li>
              <li>• Set traffic split (percentage per variant)</li>
              <li>• Visitors randomly see different versions</li>
              <li>• Track performance metrics for each</li>
              <li>• Choose winner and make it permanent</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Create Variant Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create A/B Test Variant</DialogTitle>
            <DialogDescription>
              Create a new version to test against the original
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Variant Name */}
            <div className="space-y-2">
              <Label htmlFor="variant-name">
                Variant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="variant-name"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                placeholder="e.g., Hero with Video"
              />
            </div>

            {/* Traffic Weight */}
            <div className="space-y-2">
              <Label htmlFor="variant-weight">
                Traffic Percentage <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="variant-weight"
                  type="number"
                  min={1}
                  max={remainingWeight}
                  value={variantWeight}
                  onChange={(e) => setVariantWeight(parseInt(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">
                  Available: {remainingWeight}%
                </span>
              </div>
              <Progress value={variantWeight} className="mt-2" />
            </div>

            {/* Preview Distribution */}
            <div className="rounded-lg border p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Original (Control)</span>
                <span className="font-medium">
                  {100 - totalWeight - variantWeight}%
                </span>
              </div>
              <div className="flex justify-between text-primary">
                <span>New Variant</span>
                <span className="font-medium">{variantWeight}%</span>
              </div>
              {variants.map((v) => (
                <div key={v._id} className="flex justify-between text-muted-foreground">
                  <span>{v.name}</span>
                  <span>{v.variantWeight}%</span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateVariant} disabled={creating || !variantName}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Variant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

