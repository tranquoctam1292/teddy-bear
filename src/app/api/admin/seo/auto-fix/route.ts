// Auto-fix SEO Issues API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { autoFixIssues } from '@/lib/seo/auto-fix';

/**
 * POST /api/admin/seo/auto-fix
 * Auto-fix SEO issues for entities
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { entityType, entityIds, analysisIds } = body;

    if (!entityType && !analysisIds) {
      return NextResponse.json(
        { error: 'Missing required field: entityType or analysisIds' },
        { status: 400 }
      );
    }

    const { seoAnalysis, products, posts, pages } = await getCollections();
    const results: any[] = [];

    // Get analyses
    let analyses: any[] = [];
    
    if (analysisIds && analysisIds.length > 0) {
      analyses = await seoAnalysis
        .find({ id: { $in: analysisIds } })
        .toArray();
    } else {
      const query: any = { entityType };
      if (entityIds && entityIds.length > 0) {
        query.entityId = { $in: entityIds };
      }
      analyses = await seoAnalysis.find(query).toArray();
    }

    // Process each analysis
    for (const analysis of analyses) {
      try {
        // Get current entity data
        let currentData: Record<string, any> = {};
        
        if (analysis.entityType === 'product') {
          const product = await products.findOne({ id: analysis.entityId });
          if (product) {
            currentData = {
              title: product.name,
              description: product.description,
              content: product.content,
            };
          }
        } else if (analysis.entityType === 'post') {
          const post = await posts.findOne({ id: analysis.entityId });
          if (post) {
            currentData = {
              title: post.title,
              description: post.excerpt,
              content: post.content,
            };
          }
        } else if (analysis.entityType === 'page') {
          const page = await pages.findOne({ id: analysis.entityId });
          if (page) {
            currentData = {
              title: page.title,
              description: page.description,
              content: page.content,
            };
          }
        }

        // Auto-fix issues
        const fixResult = autoFixIssues(analysis.issues || [], currentData);

        // Apply fixes to entity if any were successful
        if (fixResult.fixed > 0) {
          const updates: Record<string, any> = {};
          
          fixResult.fixes.forEach((fix) => {
            if (fix.fixed && fix.newValue !== undefined) {
              // Map field names to entity fields
              if (fix.issue.field === 'title.length' || fix.issue.field === 'title') {
                if (analysis.entityType === 'product') {
                  updates.name = fix.newValue;
                } else if (analysis.entityType === 'post' || analysis.entityType === 'page') {
                  updates.title = fix.newValue;
                }
              } else if (fix.issue.field === 'description.length' || fix.issue.field === 'description') {
                if (analysis.entityType === 'product') {
                  updates.description = fix.newValue;
                } else if (analysis.entityType === 'post') {
                  updates.excerpt = fix.newValue;
                } else if (analysis.entityType === 'page') {
                  updates.description = fix.newValue;
                }
              }
            }
          });

          // Update entity if there are changes
          if (Object.keys(updates).length > 0) {
            updates.updatedAt = new Date();
            
            if (analysis.entityType === 'product') {
              await products.updateOne(
                { id: analysis.entityId },
                { $set: updates }
              );
            } else if (analysis.entityType === 'post') {
              await posts.updateOne(
                { id: analysis.entityId },
                { $set: updates }
              );
            } else if (analysis.entityType === 'page') {
              await pages.updateOne(
                { id: analysis.entityId },
                { $set: updates }
              );
            }
          }
        }

        results.push({
          entityId: analysis.entityId,
          entityType: analysis.entityType,
          ...fixResult,
        });
      } catch (error) {
        console.error(`Error fixing issues for ${analysis.entityId}:`, error);
        results.push({
          entityId: analysis.entityId,
          entityType: analysis.entityType,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const totalFixed = results.reduce((sum, r) => sum + (r.fixed || 0), 0);
    const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          fixed: totalFixed,
          failed: totalFailed,
        },
      },
    });
  } catch (error) {
    console.error('Error auto-fixing issues:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


