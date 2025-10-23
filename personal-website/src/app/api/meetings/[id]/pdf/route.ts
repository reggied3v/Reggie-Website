import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const supabase = createAdminClient()

    // Fetch meeting data
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    // Fetch team data
    const { data: team } = await supabase
      .from('teams')
      .select('*')
      .eq('id', meeting.team_id)
      .single()

    // Fetch action items
    const { data: actionItems } = await supabase
      .from('action_items')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('priority', { ascending: false })

    // Fetch coaching suggestions
    const { data: coachingSuggestions } = await supabase
      .from('coaching_suggestions')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('priority', { ascending: false })

    // Generate PDF
    const pdf = generatePDF(meeting, team, actionItems || [], coachingSuggestions || [])

    // Return PDF as response
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="meeting-analysis-${meetingId}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

function generatePDF(
  meeting: any,
  team: any,
  actionItems: any[],
  coachingSuggestions: any[]
): jsPDF {
  const doc = new jsPDF()
  const insights = meeting.insights || {}

  // Brand colors matching website
  const brandOrange = [255, 107, 53] // #FF6B35
  const darkGray = [51, 51, 51] // #333333
  const lightGray = [229, 229, 229] // #E5E5E5
  const mutedGray = [102, 102, 102] // #666666

  let yPosition = 20

  // Header with brand color
  doc.setFillColor(...brandOrange)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Meeting Analysis Report', 105, 18, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('AI Scrum Master', 105, 28, { align: 'center' })

  yPosition = 50

  // Team & Meeting Info
  doc.setTextColor(...darkGray)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const meetingTypeNames: Record<string, string> = {
    'standup': 'Daily Standup',
    'planning': 'Sprint Planning',
    'review': 'Sprint Review',
    'retrospective': 'Retrospective',
    'refinement': 'Backlog Refinement',
    'other': 'Meeting'
  }

  const meetingType = meetingTypeNames[meeting.meeting_type] || meeting.meeting_type
  const meetingDate = new Date(meeting.meeting_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  doc.text(`Team: ${team?.name || 'N/A'}`, 20, yPosition)
  doc.text(`Meeting Type: ${meetingType}`, 20, yPosition + 6)
  doc.text(`Date: ${meetingDate}`, 20, yPosition + 12)
  if (meeting.duration_minutes) {
    doc.text(`Duration: ${meeting.duration_minutes} minutes`, 20, yPosition + 18)
  }

  yPosition += 30

  // Health Scores Section
  doc.setFillColor(...lightGray)
  doc.rect(15, yPosition, 180, 8, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...brandOrange)
  doc.text('Health Scores', 20, yPosition + 6)

  yPosition += 15

  // Scores grid
  doc.setFontSize(10)
  doc.setTextColor(...darkGray)

  const scores = [
    { label: 'Overall Health', value: meeting.overall_health_score },
    { label: 'Engagement', value: meeting.engagement_score },
    { label: 'Transparency', value: meeting.transparency_score },
    { label: 'Collaboration', value: meeting.collaboration_score }
  ]

  const scoreBoxWidth = 40
  const scoreBoxHeight = 25
  const scoreBoxSpacing = 5

  scores.forEach((score, index) => {
    const xPos = 20 + (index % 2) * (scoreBoxWidth + scoreBoxSpacing + 40)
    const yPos = yPosition + Math.floor(index / 2) * (scoreBoxHeight + 5)

    // Score box background
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(xPos, yPos, scoreBoxWidth + 40, scoreBoxHeight, 3, 3, 'F')

    // Score label
    doc.setFontSize(8)
    doc.setTextColor(...mutedGray)
    doc.setFont('helvetica', 'normal')
    doc.text(score.label.toUpperCase(), xPos + 5, yPos + 8)

    // Score value
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text(String(score.value || '--'), xPos + 5, yPos + 20)
  })

  yPosition += 60

  // Summary Section
  if (insights.summary) {
    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('Summary', 20, yPosition + 6)

    yPosition += 15

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')

    const summaryLines = doc.splitTextToSize(insights.summary, 170)
    doc.text(summaryLines, 20, yPosition)
    yPosition += summaryLines.length * 5 + 10
  }

  // Check if we need a new page
  if (yPosition > 240) {
    doc.addPage()
    yPosition = 20
  }

  // Key Insights Section
  if (insights.key_insights && insights.key_insights.length > 0) {
    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('💡 Key Insights', 20, yPosition + 6)

    yPosition += 15

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')

    insights.key_insights.forEach((insight: string, index: number) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      const bulletPoint = `• ${insight}`
      const lines = doc.splitTextToSize(bulletPoint, 170)
      doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 3
    })

    yPosition += 5
  }

  // Positive Observations
  if (insights.positive_observations && insights.positive_observations.length > 0) {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('✅ What\'s Working Well', 20, yPosition + 6)

    yPosition += 15

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')

    insights.positive_observations.forEach((observation: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      const bulletPoint = `• ${observation}`
      const lines = doc.splitTextToSize(bulletPoint, 170)
      doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 3
    })

    yPosition += 5
  }

  // Areas for Improvement
  if (insights.areas_for_improvement && insights.areas_for_improvement.length > 0) {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('⚠️ Areas for Improvement', 20, yPosition + 6)

    yPosition += 15

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')

    insights.areas_for_improvement.forEach((area: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      const bulletPoint = `• ${area}`
      const lines = doc.splitTextToSize(bulletPoint, 170)
      doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 3
    })

    yPosition += 5
  }

  // Action Items Table
  if (actionItems.length > 0) {
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('🎯 Action Items', 20, yPosition + 6)

    yPosition += 12

    const tableData = actionItems.map(item => [
      item.title,
      item.assigned_to || 'Unassigned',
      item.priority?.toUpperCase() || 'MEDIUM',
      item.status?.replace('_', ' ') || 'Open'
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Action Item', 'Assigned To', 'Priority', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: brandOrange,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { left: 20, right: 20 }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10
  }

  // Coaching Suggestions
  if (coachingSuggestions.length > 0) {
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 8, 'F')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...brandOrange)
    doc.text('🎓 Coaching Suggestions', 20, yPosition + 6)

    yPosition += 15

    coachingSuggestions.forEach((suggestion, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Suggestion box
      doc.setDrawColor(...brandOrange)
      doc.setLineWidth(0.5)
      doc.roundedRect(18, yPosition, 174, 0, 3, 3, 'S') // Will auto-size

      // Category tag
      doc.setFillColor(...brandOrange)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      const category = suggestion.category.replace('_', ' ').toUpperCase()
      doc.text(category, 22, yPosition + 5)

      yPosition += 10

      // Title
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...darkGray)
      const titleLines = doc.splitTextToSize(suggestion.title, 166)
      doc.text(titleLines, 22, yPosition)
      yPosition += titleLines.length * 5 + 3

      // Description
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const descLines = doc.splitTextToSize(suggestion.description, 166)
      doc.text(descLines, 22, yPosition)
      yPosition += descLines.length * 4 + 8
    })
  }

  // Footer on each page
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...mutedGray)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Page ${i} of ${pageCount} • Generated with AI Scrum Master`,
      105,
      287,
      { align: 'center' }
    )
  }

  return doc
}
