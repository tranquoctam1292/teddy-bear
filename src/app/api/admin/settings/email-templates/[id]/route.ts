// Email Template API Route (Single)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET - Get single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { emailTemplates } = await getCollections();

    const template = await emailTemplates.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const { _id, ...templateData } = template as any;
    return NextResponse.json({
      template: {
        ...templateData,
        id: templateData.id || _id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestBody = await request.json();
    const { name, subject, body, variables, category, isActive } = requestBody;

    const { emailTemplates } = await getCollections();

    const existingTemplate = await emailTemplates.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    let slug = existingTemplate.slug;
    if (name && name !== existingTemplate.name) {
      slug = generateSlug(name);
      const slugExists = await emailTemplates.findOne({
        slug,
        id: { $ne: id },
        _id: { $ne: new ObjectId(id) },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Template with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Extract variables from subject and body
    const extractedVariables = [
      ...new Set(
        [
          ...((subject || existingTemplate.subject).match(/\{\{(\w+)\}\}/g) || []),
          ...((body || existingTemplate.body).match(/\{\{(\w+)\}\}/g) || []),
        ].map((match) => match.replace(/[{}]/g, ''))
      ),
    ];

    const finalVariables = variables && Array.isArray(variables)
      ? [...new Set([...variables, ...extractedVariables])]
      : extractedVariables;

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (slug) updateData.slug = slug;
    if (subject !== undefined) updateData.subject = subject.trim();
    if (body !== undefined) updateData.body = body.trim();
    if (finalVariables.length > 0) updateData.variables = finalVariables;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    await emailTemplates.updateOne(
      { $or: [{ id }, { _id: new ObjectId(id) }] },
      { $set: updateData }
    );

    const updatedTemplate = await emailTemplates.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    const { _id, ...templateData } = updatedTemplate as any;
    return NextResponse.json({
      template: {
        ...templateData,
        id: templateData.id || _id.toString(),
      },
      message: 'Template updated successfully',
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { emailTemplates } = await getCollections();

    const template = await emailTemplates.findOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    await emailTemplates.deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    });

    return NextResponse.json({
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

