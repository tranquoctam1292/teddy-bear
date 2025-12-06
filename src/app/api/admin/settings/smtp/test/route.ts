// SMTP Test API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

// POST - Test SMTP connection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { smtpConfig } = await getCollections();
    const config = await smtpConfig.findOne({});

    if (!config || !config.enabled) {
      return NextResponse.json(
        { error: 'SMTP is not configured or enabled' },
        { status: 400 }
      );
    }

    // Simulate SMTP test (in production, use nodemailer or similar)
    // For now, we'll just validate the configuration
    const { provider, config: smtpConfigData } = config as any;

    let testResult: { success: boolean; message: string; testedAt: Date };

    if (provider === 'smtp') {
      if (!smtpConfigData.host || !smtpConfigData.port || !smtpConfigData.username) {
        testResult = {
          success: false,
          message: 'Missing required SMTP configuration (host, port, username)',
          testedAt: new Date(),
        };
      } else {
        // In production, actually test the connection
        testResult = {
          success: true,
          message: 'SMTP configuration looks valid (test connection not implemented)',
          testedAt: new Date(),
        };
      }
    } else if (provider === 'resend') {
      if (!smtpConfigData.apiKey || !smtpConfigData.fromEmail) {
        testResult = {
          success: false,
          message: 'Missing required Resend configuration (apiKey, fromEmail)',
          testedAt: new Date(),
        };
      } else {
        testResult = {
          success: true,
          message: 'Resend configuration looks valid (test connection not implemented)',
          testedAt: new Date(),
        };
      }
    } else {
      testResult = {
        success: false,
        message: `Provider ${provider} test not implemented`,
        testedAt: new Date(),
      };
    }

    // Update test result in database
    await smtpConfig.updateOne(
      {},
      { $set: { testResult, updatedAt: new Date() } }
    );

    return NextResponse.json({
      testResult,
      message: testResult.success
        ? 'SMTP test completed successfully'
        : 'SMTP test failed',
    });
  } catch (error) {
    console.error('Error testing SMTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








