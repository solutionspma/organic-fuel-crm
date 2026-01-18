import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { lead, message } = JSON.parse(event.body);

    if (!lead || !lead.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Lead data required' })
      };
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Prepare email content
    const emailSubject = `🌱 New Lead: ${lead.name}`;
    const emailBody = `
NEW LEAD NOTIFICATION - Organic Fuel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT INFORMATION:
Name: ${lead.name}
Phone: ${lead.phone || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Source: ${lead.source}

MESSAGE:
${message || 'No message provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lead ID: ${lead.id}
Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST

Action Required: Follow up within 1 hour for best conversion rates.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organic Fuel CRM
Infrastructure Equity
    `.trim();

    // Email configuration
    const recipients = [
      process.env.NOTIFY_EMAIL_PRIMARY,
      process.env.NOTIFY_EMAIL_CC
    ];

    console.log('EMAIL NOTIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${recipients.join(', ')}`);
    console.log(`Subject: ${emailSubject}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(emailBody);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // TODO: Integrate with your email service provider
    // Options: SendGrid, Resend, Postmark, AWS SES, Mailgun
    // 
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: recipients,
    //   from: 'noreply@organicfuel.com',
    //   subject: emailSubject,
    //   text: emailBody,
    //   html: emailBody.replace(/\n/g, '<br>')
    // });
    //
    // Example with Resend:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Organic Fuel <noreply@organicfuel.com>',
    //   to: recipients,
    //   subject: emailSubject,
    //   text: emailBody
    // });

    // Log notification in database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert([{
        lead_id: lead.id,
        type: 'email',
        recipients: recipients.join(', '),
        status: 'sent'
      }]);

    if (notifError) {
      console.error('Failed to log notification:', notifError);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Email logged (SMTP integration pending)',
        recipients
      })
    };

  } catch (error) {
    console.error('Send email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        message: error.message 
      })
    };
  }
}
