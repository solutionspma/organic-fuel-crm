import axios from 'axios';
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

    // Check SMS limit: non-members get ONLY ONE outbound SMS
    if (lead.outbound_sms_count >= 1) {
      console.log(`SMS limit reached for lead ${lead.id}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'SMS limit reached' 
        })
      };
    }

    // Prepare SMS message
    const smsBody = `🌱 NEW LEAD - Organic Fuel\n\nName: ${lead.name}\nPhone: ${lead.phone || 'N/A'}\nEmail: ${lead.email || 'N/A'}\nMessage: ${message || 'No message provided'}\n\nReply via CRM`;

    // Send to both notification numbers
    const recipients = [
      process.env.NOTIFY_SMS_1,
      process.env.NOTIFY_SMS_2
    ];

    const results = [];

    for (const recipient of recipients) {
      try {
        const response = await axios.post(
          'https://api.telnyx.com/v2/messages',
          {
            from: process.env.TELNYX_FROM_NUMBER,
            to: recipient,
            text: smsBody
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        results.push({
          recipient,
          status: 'sent',
          messageId: response.data.data.id
        });

        console.log(`SMS sent to ${recipient}:`, response.data.data.id);

      } catch (smsError) {
        console.error(`SMS error for ${recipient}:`, smsError.response?.data || smsError.message);
        results.push({
          recipient,
          status: 'failed',
          error: smsError.message
        });
      }
    }

    // Increment outbound SMS count
    const { error: updateError } = await supabase
      .from('leads')
      .update({ outbound_sms_count: lead.outbound_sms_count + 1 })
      .eq('id', lead.id);

    if (updateError) {
      console.error('Failed to update SMS count:', updateError);
    }

    // Log notification in database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert([{
        lead_id: lead.id,
        type: 'sms',
        recipients: recipients.join(', '),
        status: results.every(r => r.status === 'sent') ? 'sent' : 'partial'
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
        results
      })
    };

  } catch (error) {
    console.error('Send SMS error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send SMS',
        message: error.message 
      })
    };
  }
}
