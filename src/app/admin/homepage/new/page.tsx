// Admin: Create New Homepage Configuration
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomepageForm } from '@/components/admin/homepage/HomepageForm';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'New Homepage Configuration | Admin',
  description: 'Create a new homepage configuration',
};

export default function NewHomepageConfigPage() {
  async function createConfig(formData: FormData) {
    'use server';

    // CRITICAL: Check authentication FIRST in Server Action
    let session;
    try {
      session = await auth();
      
      // DEBUG: Log session info (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('[createConfig] Session check:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          userRole: session?.user?.role,
        });
      }
    } catch (authError) {
      console.error('[createConfig] Auth error:', authError);
      
      // Check if AUTH_SECRET might be missing or invalid
      const authSecretError = authError instanceof Error && 
        (authError.message.includes('AUTH_SECRET') || 
         authError.message.includes('secret') ||
         authError.message.includes('signature'));
      
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: authSecretError
            ? 'Authentication service error. Please verify AUTH_SECRET is set correctly in .env.local and restart the server.'
            : 'Authentication service unavailable',
        },
      };
    }

    if (!session?.user) {
      // DEBUG: Log cookie info to help diagnose
      if (process.env.NODE_ENV === 'development') {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        console.log('[createConfig] No session found. Available cookies:', {
          cookieCount: allCookies.length,
          cookieNames: allCookies.map(c => c.name),
          hasAuthCookie: allCookies.some(c => 
            c.name.includes('auth') || 
            c.name.includes('session') || 
            c.name.includes('next-auth')
          ),
        });
      }
      
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication required. Please log in to continue.',
        },
      };
    }

    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required. Your account does not have permission to perform this action.',
        },
      };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    // Validate NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      console.error('[createConfig] NEXT_PUBLIC_SITE_URL is not set');
      return {
        success: false,
        error: {
          code: 'CONFIG_ERROR',
          message: 'Server configuration error: NEXT_PUBLIC_SITE_URL is missing. Please check .env.local file.',
        },
      };
    }

    try {
      // Get cookies from incoming request to forward to API
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

      // DEBUG: Log cookie forwarding (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('[createConfig] Forwarding cookies to API:', {
          cookieCount: allCookies.length,
          cookieNames: allCookies.map(c => c.name),
          hasAuthCookie: allCookies.some(c => 
            c.name.includes('auth') || 
            c.name.includes('session') || 
            c.name.includes('next-auth')
          ),
        });
      }

      // CRITICAL: Forward cookies from Server Action to API route
      // This ensures NextAuth session cookie is included in the request
      const response = await fetch(
        `${siteUrl}/api/admin/homepage/configs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Forward cookies from incoming request (includes NextAuth session cookie)
            Cookie: cookieHeader,
          },
          body: JSON.stringify({
            name,
            description,
            slug: name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
            status: 'draft',
            sections: [],
            seo: {
              title: seoTitle,
              description: seoDescription,
            },
          }),
        }
      );

      const data = await response.json();

      // Handle standardized error response
      if (!response.ok || !data.success) {
        const errorMessage =
          data.error?.message || 'Failed to create configuration';
        
        // Return error object instead of throwing to prevent component crash
        // The Client Component (HomepageForm) will handle the error and show toast
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: errorMessage,
          },
        };
      }

      // Return id instead of redirect (redirect doesn't work from Client Component)
      return { success: true, id: data.data.config._id };
    } catch (error) {
      console.error('Error creating config:', error);
      
      // Return error object instead of throwing
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating the configuration';
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: errorMessage,
        },
      };
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/homepage">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Homepage Configuration
          </h1>
          <p className="text-muted-foreground">
            Create a new homepage configuration to get started
          </p>
        </div>
      </div>

      {/* Form */}
      <HomepageForm action={createConfig} />
    </div>
  );
}

