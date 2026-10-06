import { NextResponse } from 'next/server';
import { analyzeEmergencyWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, category, campus_location, imageBase64 } = body;

    if (!description || !category || !campus_location) {
      return NextResponse.json(
        { error: 'Missing required parameters: description, category, or campus_location' },
        { status: 400 }
      );
    }

    const analysis = await analyzeEmergencyWithGemini(
      description,
      category,
      campus_location,
      imageBase64
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error during AI analysis' },
      { status: 500 }
    );
  }
}
