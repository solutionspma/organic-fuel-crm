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
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and message are required' })
      };
    }

    // Require at least phone or email
    if (!data.phone && !data.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Phone or email is required' })
      };
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert lead into database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([{
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        source: 'chat',
        status: 'new',
        outbound_sms_count: 0
      }])
      .select()
      .single();

    if (leadError) {
      console.error('Supabase lead insert error:', leadError);
      throw new Error('Failed to create lead');
    }

    // Insert message into database
    const { error: messageError } = await supabase
      .from('messages')
      .insert([{
        lead_id: lead.id,
        direction: 'inbound',
        channel: 'chat',
        body: data.message
      }]);

    if (messageError) {
      console.error('Supabase message insert error:', messageError);
      throw new Error('Failed to save message');
    }

    // Trigger parallel notifications (non-blocking)
    const baseUrl = process.env.URL || 'http://localhost:8888';
    
    // Fire SMS notification
    fetch(`${baseUrl}/.netlify/functions/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, message: data.message })
    }).catch(err => console.error('SMS notification failed:', err));

    // Fire email notification
    fetch(`${baseUrl}/.netlify/functions/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, message: data.message })
    }).catch(err => console.error('Email notification failed:', err));

    // Return success immediately
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        leadId: lead.id
      })
    };

  } catch (error) {
    console.error('Chat submit error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}
