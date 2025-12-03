// Email Templates API Route
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { EmailTemplate } from '@/lib/schemas/notification-settings';
import { ObjectId } from 'mongodb';

function generateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET - List all email templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailTemplates } = await getCollections();
    const templates = await emailTemplates
      .find({})
      .sort({ category: 1, createdAt: -1 })
      .toArray();

    const formattedTemplates = templates.map((template: any) => {
      const { _id, ...templateData } = template;
      return {
        ...templateData,
        id: templateData.id || _id.toString(),
      };
    });

    return NextResponse.json({ templates: formattedTemplates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new email template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { name, subject, body, variables, category, isActive } = requestBody;

    if (!name || !subject || !body) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    if (!['order', 'customer', 'system', 'marketing'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const { emailTemplates } = await getCollections();
    const slug = generateSlug(name);

    const existingTemplate = await emailTemplates.findOne({ slug });
    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Template with this name already exists' },
        { status: 400 }
      );
    }

    // Extract variables from subject and body
    const extractedVariables = [
      ...new Set(
        [
          ...(subject.match(/\{\{(\w+)\}\}/g) || []),
          ...(body.match(/\{\{(\w+)\}\}/g) || []),
        ].map((match) => match.replace(/[{}]/g, ''))
      ),
    ];

    const finalVariables = variables && Array.isArray(variables) 
      ? [...new Set([...variables, ...extractedVariables])]
      : extractedVariables;

    const newTemplate: EmailTemplate = {
      id: generateId(),
      name: name.trim(),
      slug,
      subject: subject.trim(),
      body: body.trim(),
      variables: finalVariables,
      category: category as EmailTemplate['category'],
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await emailTemplates.insertOne(newTemplate);

    return NextResponse.json(
      { template: newTemplate, message: 'Email template created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

