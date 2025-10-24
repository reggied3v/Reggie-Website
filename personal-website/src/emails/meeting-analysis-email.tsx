import * as React from 'react'

interface MeetingAnalysisEmailProps {
  teamName: string
  meetingType: string
  meetingDate: string
  overallHealthScore: number
  engagementScore: number
  transparencyScore: number
  collaborationScore: number
  summary: string
  keyInsights: string[]
  positiveObservations: string[]
  areasForImprovement: string[]
  actionItems: Array<{
    title: string
    assignedTo?: string
    priority?: string
  }>
  coachingSuggestions: Array<{
    category: string
    title: string
    description: string
    priority?: string
  }>
  meetingUrl: string
}

export const MeetingAnalysisEmail = ({
  teamName,
  meetingType,
  meetingDate,
  overallHealthScore,
  engagementScore,
  transparencyScore,
  collaborationScore,
  summary,
  keyInsights = [],
  positiveObservations = [],
  areasForImprovement = [],
  actionItems = [],
  coachingSuggestions = [],
  meetingUrl
}: MeetingAnalysisEmailProps) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e5e5e5;
        }
        .header h1 {
          color: #FF6B35;
          margin: 0 0 8px 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }
        .scores {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 24px 0;
        }
        .score-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        .score-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .score-value {
          font-size: 32px;
          font-weight: bold;
          color: #FF6B35;
        }
        .section {
          margin: 24px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon {
          width: 20px;
          height: 20px;
        }
        .summary {
          background-color: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 16px;
          margin: 16px 0;
          border-radius: 4px;
        }
        .list {
          list-style: none;
          padding: 0;
          margin: 12px 0;
        }
        .list-item {
          padding: 12px;
          margin: 8px 0;
          background-color: #f9f9f9;
          border-radius: 6px;
          border-left: 3px solid #FF6B35;
        }
        .positive-item {
          border-left-color: #22c55e;
        }
        .improvement-item {
          border-left-color: #f59e0b;
        }
        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }
        .action-meta {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        .priority-high {
          color: #ef4444;
          font-weight: 600;
        }
        .priority-medium {
          color: #f59e0b;
          font-weight: 600;
        }
        .priority-low {
          color: #3b82f6;
          font-weight: 600;
        }
        .coaching-card {
          background: linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%);
          border: 2px solid #FF6B35;
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
        }
        .coaching-category {
          display: inline-block;
          background-color: #FF6B35;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .coaching-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 8px 0;
        }
        .coaching-description {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          background-color: #FF6B35;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
          margin: 24px auto;
          display: block;
          width: fit-content;
        }
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e5e5e5;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1>Meeting Analysis Complete</h1>
          <p>{teamName} • {meetingType} • {new Date(meetingDate).toLocaleDateString()}</p>
        </div>

        <div className="scores">
          <div className="score-card">
            <div className="score-label">Overall Health</div>
            <div className="score-value">{overallHealthScore}</div>
          </div>
          <div className="score-card">
            <div className="score-label">Engagement</div>
            <div className="score-value">{engagementScore}</div>
          </div>
          <div className="score-card">
            <div className="score-label">Transparency</div>
            <div className="score-value">{transparencyScore}</div>
          </div>
          <div className="score-card">
            <div className="score-label">Collaboration</div>
            <div className="score-value">{collaborationScore}</div>
          </div>
        </div>

        {summary && (
          <div className="summary">
            <strong>Summary:</strong> {summary}
          </div>
        )}

        {keyInsights.length > 0 && (
          <div className="section">
            <div className="section-title">💡 Key Insights</div>
            <ul className="list">
              {keyInsights.map((insight, index) => (
                <li key={index} className="list-item">{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {positiveObservations.length > 0 && (
          <div className="section">
            <div className="section-title">✅ What&apos;s Working Well</div>
            <ul className="list">
              {positiveObservations.map((observation, index) => (
                <li key={index} className="list-item positive-item">{observation}</li>
              ))}
            </ul>
          </div>
        )}

        {areasForImprovement.length > 0 && (
          <div className="section">
            <div className="section-title">⚠️ Areas for Improvement</div>
            <ul className="list">
              {areasForImprovement.map((area, index) => (
                <li key={index} className="list-item improvement-item">{area}</li>
              ))}
            </ul>
          </div>
        )}

        {actionItems.length > 0 && (
          <div className="section">
            <div className="section-title">🎯 Action Items</div>
            <ul className="list">
              {actionItems.map((item, index) => (
                <li key={index} className="list-item">
                  <div className="action-item">
                    <div>
                      <strong>{item.title}</strong>
                      {item.assignedTo && (
                        <div className="action-meta">Assigned to: {item.assignedTo}</div>
                      )}
                    </div>
                    {item.priority && (
                      <span className={`priority-${item.priority}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {coachingSuggestions.length > 0 && (
          <div className="section">
            <div className="section-title">🎓 Coaching Suggestions</div>
            {coachingSuggestions.map((suggestion, index) => (
              <div key={index} className="coaching-card">
                <span className="coaching-category">{suggestion.category.replace('_', ' ')}</span>
                {suggestion.priority && (
                  <span className={`priority-${suggestion.priority}`} style={{ marginLeft: '8px', fontSize: '12px' }}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                )}
                <div className="coaching-title">{suggestion.title}</div>
                <div className="coaching-description">{suggestion.description}</div>
              </div>
            ))}
          </div>
        )}

        <a href={meetingUrl} className="button">
          View Full Analysis
        </a>

        <div className="footer">
          <p>This analysis was generated by AI Scrum Master</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Powered by Claude AI • <a href="https://claude.com/claude-code" style={{ color: '#FF6B35' }}>Built with Claude Code</a>
          </p>
        </div>
      </div>
    </body>
  </html>
)

export default MeetingAnalysisEmail
