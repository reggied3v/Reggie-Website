'use server'

import { resend } from '@/lib/resend'
import { createClient } from '@/lib/supabase-server'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // 1. Save to Supabase
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from('contacts')
      .insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      return { success: false, error: 'Failed to save contact form' }
    }

    // 2. Send notification email to you
    try {
      await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Resend's test email
        to: 'admin@reggieragsdale.com', // Your email
        subject: `New Contact: ${data.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the whole operation if email fails
    }

    // 3. Send auto-reply to submitter
    try {
      await resend.emails.send({
        from: 'Reggie <onboarding@resend.dev>', // Resend's test email
        to: data.email,
        subject: 'Thanks for reaching out!',
        html: `
          <h2>Hi ${data.name},</h2>
          <p>Thank you for contacting me! I've received your message about "${data.subject}" and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Reggie</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated response. Please do not reply to this email.</p>
        `
      })
    } catch (emailError) {
      console.error('Auto-reply error:', emailError)
      // Don't fail the whole operation if email fails
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
