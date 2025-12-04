// Security Configuration API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { SecurityConfig } from '@/lib/schemas/security-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `security_${Date.now()}`;
}

// GET - Get security configuration
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { securityConfig } = await getCollections();
    const config = await securityConfig.findOne({});

    if (!config) {
      // Return default config
      return NextResponse.json({
        config: {
          id: generateId(),
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
            maxAge: 90,
          },
          sessionConfig: {
            maxAge: 24,
            requireMFA: false,
          },
          rateLimiting: {
            enabled: true,
            maxRequests: 100,
            windowMs: 60000, // 1 minute
          },
          cors: {
            enabled: true,
            allowedOrigins: [],
          },
          apiSecurity: {
            requireApiKey: false,
            allowedIPs: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const { _id, ...configData } = config as any;
    return NextResponse.json({
      config: {
        ...configData,
        id: configData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching security config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update security configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { passwordPolicy, sessionConfig, rateLimiting, cors, apiSecurity } = body;

    const { securityConfig } = await getCollections();

    const existing = await securityConfig.findOne({});

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (passwordPolicy) updateData.passwordPolicy = passwordPolicy;
    if (sessionConfig) updateData.sessionConfig = sessionConfig;
    if (rateLimiting) updateData.rateLimiting = rateLimiting;
    if (cors) updateData.cors = cors;
    if (apiSecurity) updateData.apiSecurity = apiSecurity;

    if (existing) {
      await securityConfig.updateOne({}, { $set: updateData });
    } else {
      const newConfig: SecurityConfig = {
        id: generateId(),
        passwordPolicy: passwordPolicy || {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          maxAge: 90,
        },
        sessionConfig: sessionConfig || {
          maxAge: 24,
          requireMFA: false,
        },
        rateLimiting: rateLimiting || {
          enabled: true,
          maxRequests: 100,
          windowMs: 60000,
        },
        cors: cors || {
          enabled: true,
          allowedOrigins: [],
        },
        apiSecurity: apiSecurity || {
          requireApiKey: false,
          allowedIPs: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await securityConfig.insertOne(newConfig);
    }

    const updated = await securityConfig.findOne({});
    const { _id, ...configData } = updated as any;

    return NextResponse.json({
      config: {
        ...configData,
        id: configData.id || _id.toString(),
      },
      message: 'Security configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating security config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



