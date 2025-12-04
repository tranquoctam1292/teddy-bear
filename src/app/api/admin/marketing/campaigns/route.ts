import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { EmailCampaign } from '@/lib/types/marketing';

// GET /api/admin/marketing/campaigns - List all email campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const { emailCampaigns } = await getCollections();

    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }

    const campaigns = await emailCampaigns
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map((c: any) => ({
        ...c,
        _id: c._id?.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, content, recipients, scheduledAt } = body;

    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { emailCampaigns } = await getCollections();

    const newCampaign: Omit<EmailCampaign, '_id'> = {
      name,
      subject,
      content,
      recipients: recipients || [],
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      totalSent: 0,
      totalOpened: 0,
      totalClicked: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await emailCampaigns.insertOne(newCampaign as any);

    return NextResponse.json({
      success: true,
      campaign: {
        ...newCampaign,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}



