import { NextResponse } from 'next/server';
import { uploadProofPhoto } from '@/lib/supabase';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const dateStr = (formData.get('date') as string) || format(new Date(), 'yyyy-MM-dd');
    const notes = formData.get('notes') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const imageUrl = await uploadProofPhoto(file, `proof_${dateStr}`);

    // Save proof URL to Database
    const updatedLog = await prisma.dailyLog.upsert({
      where: { logDate: dateStr },
      update: {
        proofImageUrl: imageUrl,
        ...(notes ? { notes } : {}),
      },
      create: {
        logDate: dateStr,
        proofImageUrl: imageUrl,
        notes: notes || '',
        effortScore: 50,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      dailyLog: updatedLog,
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
