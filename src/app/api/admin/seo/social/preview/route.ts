// Social Media Preview API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generateOpenGraphData,
  generateTwitterCardData,
  validateOpenGraph,
  validateTwitterCard,
} from '@/lib/seo/social-preview';

/**
 * POST /api/admin/seo/social/preview
 * Generate and validate social media preview data
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
    const {
      title,
      description,
      image,
      url,
      type = 'website',
      siteName,
      publishedTime,
      author,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description' },
        { status: 400 }
      );
    }

    // Generate social data
    const socialData = {
      title,
      description,
      image,
      url,
      type,
      siteName,
      publishedTime,
      author,
    };

    const ogData = generateOpenGraphData(socialData);
    const twitterData = generateTwitterCardData(socialData);

    // Validate
    const ogValidation = validateOpenGraph(ogData);
    const twitterValidation = validateTwitterCard(twitterData);

    return NextResponse.json({
      success: true,
      data: {
        openGraph: {
          data: ogData,
          validation: ogValidation,
        },
        twitter: {
          data: twitterData,
          validation: twitterValidation,
        },
      },
    });
  } catch (error) {
    console.error('Error generating social preview:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




