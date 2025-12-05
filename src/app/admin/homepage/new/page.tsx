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
      // Import required modules
      const { getCollections } = await import('@/lib/db');
      const { generateSlug } = await import('@/lib/utils/slug');
      const { homepageFormSchema } = await import('@/lib/schemas/homepage');

      // Validate with Zod schema
      let validatedData;
      try {
        validatedData = homepageFormSchema.parse({
          name,
          description,
          seoTitle,
          seoDescription,
        });
      } catch (zodError) {
        // Handle Zod validation errors
        if (zodError && typeof zodError === 'object' && 'errors' in zodError) {
          const zodErrors = zodError as { errors: Array<{ path: string[]; message: string }> };
          const errorMessages = zodErrors.errors.map((err) => {
            const field = err.path.join('.');
            return `${field}: ${err.message}`;
          });
          
          return {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed',
              details: errorMessages,
            },
          };
        }
        
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: process.env.NODE_ENV === 'development'
              ? zodError instanceof Error ? zodError.message : String(zodError)
              : undefined,
          },
        };
      }

      // Get database connection
      const { db } = await getCollections();
      const homepageConfigs = db.collection('homepage_configs');

      // Generate slug using centralized utility
      let baseSlug = generateSlug(validatedData.name);
      if (!baseSlug) {
        baseSlug = 'homepage-config';
      }

      // Generate unique slug if conflict exists
      let slug = baseSlug;
      let counter = 1;
      let existingConfig = await homepageConfigs.findOne({ slug });
      
      while (existingConfig) {
        slug = `${baseSlug}-${counter}`;
        existingConfig = await homepageConfigs.findOne({ slug });
        counter++;
        
        // Safety limit to prevent infinite loop
        if (counter > 1000) {
          slug = `${baseSlug}-${Date.now()}`;
          break;
        }
      }

      // Get user ID
      const userId = session.user.id || session.user.email || 'system';

      // Create config object
      const newConfig = {
        name: validatedData.name.trim(),
        slug,
        description: validatedData.description?.trim() || '',
        status: 'draft' as const,
        sections: [],
        seo: {
          title: validatedData.seoTitle,
          description: validatedData.seoDescription,
          keywords: [],
        },
        version: 1,
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert into database
      const result = await homepageConfigs.insertOne(newConfig);

      // Return success with id
      return { 
        success: true, 
        id: result.insertedId.toString() 
      };
    } catch (error) {
      console.error('[createConfig] Error creating config:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        // MongoDB duplicate key error
        if (error.name === 'MongoServerError' && (error as any).code === 11000) {
          return {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'A configuration with this slug already exists',
            },
          };
        }
      }
      
      // Return error object instead of throwing
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating the configuration';
      
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
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

