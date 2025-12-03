// SMTP Configuration API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { SMTPConfig } from '@/lib/schemas/notification-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `smtp_${Date.now()}`;
}

// GET - Get SMTP configuration
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { smtpConfig } = await getCollections();
    const config = await smtpConfig.findOne({});

    if (!config) {
      // Return default config
      return NextResponse.json({
        config: {
          id: generateId(),
          provider: 'smtp',
          enabled: false,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const { _id, ...configData } = config as any;
    // Don't expose sensitive data
    const safeConfig = {
      ...configData,
      id: configData.id || _id.toString(),
      config: {
        ...configData.config,
        password: configData.config.password ? '***hidden***' : undefined,
        apiKey: configData.config.apiKey ? '***hidden***' : undefined,
      },
    };

    return NextResponse.json({ config: safeConfig });
  } catch (error) {
    console.error('Error fetching SMTP config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update SMTP configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, enabled, config } = body;

    if (!provider || !['smtp', 'resend', 'sendgrid', 'mailgun'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    const { smtpConfig } = await getCollections();

    const existing = await smtpConfig.findOne({});

    // Merge config (preserve existing sensitive keys if not provided)
    let updatedConfig = existing?.config || {};
    if (config) {
      Object.keys(config).forEach((key) => {
        if (config[key] !== '***hidden***' && config[key] !== undefined) {
          updatedConfig[key] = config[key];
        }
      });
    }

    const updateData: any = {
      provider,
      enabled: enabled !== undefined ? enabled : false,
      config: updatedConfig,
      updatedAt: new Date(),
    };

    if (existing) {
      await smtpConfig.updateOne({}, { $set: updateData });
    } else {
      const newConfig: SMTPConfig = {
        id: generateId(),
        ...updateData,
        createdAt: new Date(),
      };
      await smtpConfig.insertOne(newConfig);
    }

    const updated = await smtpConfig.findOne({});
    const { _id, ...configData } = updated as any;

    // Don't expose sensitive data
    const safeConfig = {
      ...configData,
      id: configData.id || _id.toString(),
      config: {
        ...configData.config,
        password: configData.config.password ? '***hidden***' : undefined,
        apiKey: configData.config.apiKey ? '***hidden***' : undefined,
      },
    };

    return NextResponse.json({
      config: safeConfig,
      message: 'SMTP configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating SMTP config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


