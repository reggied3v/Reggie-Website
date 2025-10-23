import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const data = await request.json()

    console.log('Received meeting upload:', {
      teamId: data.teamId,
      meetingType: data.meetingType,
      meetingDate: data.meetingDate
    })

    // Validate required fields
    const requiredFields = ['teamId', 'meetingType', 'meetingDate', 'transcriptText', 'uploadedBy']
    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Insert meeting into database (analysis pending)
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        team_id: data.teamId,
        meeting_type: data.meetingType,
        meeting_date: data.meetingDate,
        duration_minutes: data.durationMinutes || null,
        transcript_text: data.transcriptText,
        transcript_source: data.transcriptSource || 'manual',
        uploaded_by: data.uploadedBy,
        analysis_status: 'processing'
      })
      .select()
      .single()

    if (meetingError) {
      console.error('Database error:', meetingError)
      return NextResponse.json(
        { error: 'Failed to save meeting', details: meetingError.message },
        { status: 500 }
      )
    }

    // Trigger AI analysis in background (async)
    analyzeMeeting(meeting.id, data.transcriptText, data.meetingType, data.teamId)
      .catch(error => console.error('Background analysis error:', error))

    return NextResponse.json({
      success: true,
      meetingId: meeting.id,
      message: 'Meeting uploaded successfully. Analysis in progress...'
    })

  } catch (error) {
    console.error('Error uploading meeting:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Background AI analysis function
async function analyzeMeeting(
  meetingId: string,
  transcriptText: string,
  meetingType: string,
  teamId: string
) {
  try {
    const supabase = createAdminClient()

    // Create analysis prompt based on meeting type
    const prompt = createAnalysisPrompt(transcriptText, meetingType)

    // Call Claude API for analysis
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    // Extract AI response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Parse the JSON response from Claude
    const analysis = JSON.parse(responseText)

    // Update meeting with analysis results
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        analysis_status: 'completed',
        analyzed_at: new Date().toISOString(),
        insights: analysis,
        overall_health_score: analysis.overall_health_score || null,
        engagement_score: analysis.engagement_score || null,
        transparency_score: analysis.transparency_score || null,
        collaboration_score: analysis.collaboration_score || null
      })
      .eq('id', meetingId)

    if (updateError) {
      console.error('Failed to update meeting with analysis:', updateError)
      return
    }

    // Extract and save action items
    if (analysis.action_items && analysis.action_items.length > 0) {
      const actionItems = analysis.action_items.map((item: any) => ({
        meeting_id: meetingId,
        team_id: teamId,
        title: item.title,
        description: item.description || null,
        assigned_to: item.assigned_to || null,
        due_date: item.due_date || null,
        priority: item.priority || 'medium',
        status: 'open'
      }))

      await supabase.from('action_items').insert(actionItems)
    }

    // Save coaching suggestions
    if (analysis.coaching_suggestions && analysis.coaching_suggestions.length > 0) {
      const suggestions = analysis.coaching_suggestions.map((suggestion: any) => ({
        meeting_id: meetingId,
        team_id: teamId,
        category: suggestion.category,
        title: suggestion.title,
        description: suggestion.description,
        action_steps: suggestion.action_steps || [],
        priority: suggestion.priority || 'medium',
        status: 'pending'
      }))

      await supabase.from('coaching_suggestions').insert(suggestions)
    }

    console.log('Meeting analysis completed:', meetingId)

  } catch (error) {
    console.error('AI analysis failed:', error)

    // Mark meeting as failed
    const supabase = createAdminClient()
    await supabase
      .from('meetings')
      .update({
        analysis_status: 'failed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', meetingId)
  }
}

// Create analysis prompt based on meeting type
function createAnalysisPrompt(transcript: string, meetingType: string): string {
  const meetingTypeNames: Record<string, string> = {
    'standup': 'Daily Standup',
    'planning': 'Sprint Planning',
    'review': 'Sprint Review',
    'retrospective': 'Retrospective',
    'refinement': 'Backlog Refinement',
    'other': 'Meeting'
  }

  const meetingName = meetingTypeNames[meetingType] || 'Meeting'

  return `You are an expert Agile coach analyzing a Scrum team's ${meetingName} transcript.

Analyze this meeting transcript and provide insights in JSON format with the following structure:

{
  "summary": "Brief 2-3 sentence summary of the meeting",
  "overall_health_score": <number 0-100>,
  "engagement_score": <number 0-100>,
  "transparency_score": <number 0-100>,
  "collaboration_score": <number 0-100>,

  "key_insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],

  "positive_observations": [
    "Positive thing 1",
    "Positive thing 2"
  ],

  "areas_for_improvement": [
    "Improvement area 1",
    "Improvement area 2"
  ],

  "action_items": [
    {
      "title": "Action item title",
      "description": "What needs to be done",
      "assigned_to": "Person or team (if mentioned)",
      "priority": "high|medium|low",
      "due_date": "YYYY-MM-DD or null"
    }
  ],

  "coaching_suggestions": [
    {
      "category": "facilitation|team_dynamics|process|communication|agile_practice",
      "title": "Suggestion title",
      "description": "Detailed suggestion",
      "action_steps": ["Step 1", "Step 2"],
      "priority": "high|medium|low"
    }
  ],

  "patterns_detected": [
    {
      "type": "recurring_blocker|communication_gap|positive_trend|negative_trend",
      "description": "Pattern description",
      "severity": "high|medium|low"
    }
  ]
}

${meetingType === 'standup' ? `
For Daily Standup, focus on:
- Is everyone participating?
- Are updates concise and focused?
- Are blockers being surfaced and addressed?
- Is the meeting staying within 15 minutes?
- Is there good energy and team collaboration?
` : ''}

${meetingType === 'retrospective' ? `
For Retrospective, focus on:
- Is there psychological safety to speak openly?
- Are both positive and negative topics discussed?
- Are concrete action items being identified?
- Is there a balance of participation?
- Are past action items being followed up on?
` : ''}

${meetingType === 'planning' ? `
For Sprint Planning, focus on:
- Is the sprint goal clear and agreed upon?
- Are stories well-defined and estimated?
- Is the team committing to a realistic amount of work?
- Are dependencies and risks identified?
- Is the Product Owner actively engaged?
` : ''}

Provide your analysis as valid JSON only. Do not include markdown code blocks or any text outside the JSON.

TRANSCRIPT:
${transcript}`
}
