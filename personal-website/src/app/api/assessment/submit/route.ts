import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    console.log('Received assessment data:', JSON.stringify(data, null, 2))

    // Validate required fields
    const requiredFields = [
      'teamSetup',
      'teamMaturity',
      'teamDistribution',
      'stakeholderCommitment',
      'poAvailability',
      'successDefinition',
      'biggestChallenge',
      'improvementGoals',
      'role',
      'name',
      'email'
    ]

    const missingFields = requiredFields.filter(field => {
      const value = data[field]
      // Check for null, undefined, or empty string after trimming
      return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400 }
      )
    }

    // Calculate overall score (simple algorithm for now)
    const score = calculateOverallScore(data)
    const maturityLevel = getMaturityLevel(data.teamMaturity)

    // Prepare data for database
    const assessmentData = {
      // Part 1: Team Context
      team_setup: data.teamSetup,
      team_maturity: data.teamMaturity,
      current_tools: data.currentTools || [],
      current_tools_other: data.currentToolsOther || null,
      team_distribution: data.teamDistribution,
      current_events: data.currentEvents || [],
      current_events_other: data.currentEventsOther || null,

      // Part 2: Stakeholder & Success
      stakeholder_commitment: data.stakeholderCommitment,
      po_availability: data.poAvailability,
      po_availability_other: data.poAvailabilityOther || null,
      success_definition: data.successDefinition,
      current_metrics: data.currentMetrics || [],
      current_metrics_other: data.currentMetricsOther || null,

      // Part 3: Pain Points & Improvement
      biggest_challenge: data.biggestChallenge,
      biggest_challenge_other: data.biggestChallengeOther || null,
      work_challenges: data.workChallenges,
      transparency_scores: data.transparencyScores,
      team_dynamics: data.teamDynamics || [],
      automation_usage: data.automationUsage || [],
      automation_usage_other: data.automationUsageOther || null,
      improvement_goals: data.improvementGoals,

      // Part 4: Contact & Context
      role: data.role,
      role_other: data.roleOther || null,
      organization_context: data.organizationContext || null,
      name: data.name,
      email: data.email,
      company_team: data.companyTeam || null,
      opted_in_communications: data.optedInCommunications || false,

      // Metadata
      user_agent: request.headers.get('user-agent') || null,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] ||
                  request.headers.get('x-real-ip') || null,
      referrer: request.headers.get('referer') || null,

      // Calculated fields
      overall_score: score,
      maturity_level: maturityLevel
    }

    // Insert into database
    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save assessment', details: error.message },
        { status: 500 }
      )
    }

    // TODO: Trigger email with results (using Resend)
    // TODO: Generate PDF report

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      overallScore: score,
      maturityLevel: maturityLevel
    })

  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple scoring algorithm (can be enhanced later)
function calculateOverallScore(data: any): number {
  let score = 0
  let maxScore = 100

  // Team maturity (0-20 points)
  score += (data.teamMaturity / 5) * 20

  // Stakeholder commitment (0-15 points)
  score += (data.stakeholderCommitment / 5) * 15

  // PO availability (0-15 points)
  const poScores: Record<string, number> = {
    'dedicated': 15,
    'shared': 10,
    'committee': 5,
    'none': 0,
    'other': 7
  }
  score += poScores[data.poAvailability] || 0

  // Work challenges (0-15 points) - inverse scoring (lower is better)
  const workChallenges = data.workChallenges
  const avgWorkChallenge = (
    workChallenges.discoveryVsExecution +
    workChallenges.backlogClarity +
    workChallenges.unexpectedBlockers
  ) / 3
  score += (1 - (avgWorkChallenge - 1) / 4) * 15

  // Transparency scores (0-15 points)
  const transparencyScores = data.transparencyScores
  const avgTransparency = (
    transparencyScores.teamAwareness +
    transparencyScores.openDiscussion +
    transparencyScores.stakeholderVisibility
  ) / 3
  score += (avgTransparency / 5) * 15

  // Tools and events usage (0-10 points)
  const toolsCount = (data.currentTools || []).length
  const eventsCount = (data.currentEvents || []).length
  score += Math.min((toolsCount + eventsCount) / 2, 1) * 10

  // Automation usage (0-10 points)
  const automationCount = (data.automationUsage || []).length
  score += Math.min(automationCount / 3, 1) * 10

  return Math.round(score)
}

function getMaturityLevel(teamMaturity: number): string {
  switch (teamMaturity) {
    case 1:
      return 'Brand New'
    case 2:
      return 'Learning Basics'
    case 3:
      return 'Practicing'
    case 4:
      return 'Refining'
    case 5:
      return 'Mature'
    default:
      return 'Unknown'
  }
}
