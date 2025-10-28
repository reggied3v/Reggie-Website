import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FeedbackRecord } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const feedbackData: FeedbackRecord = {
      was_helpful: body.wasHelpful || false,
      easy_to_use: body.easyToUse || false,
      formatting_accurate: body.formattingAccurate || false,
      would_recommend: body.wouldRecommend || false,
      additional_comments: body.additionalComments || null,
    };

    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit feedback'
      },
      { status: 500 }
    );
  }
}
