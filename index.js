const express = require('express');
const app = express();

app.use(express.json());

const BIG_BRAIN_WEBHOOK = 'https://build.twin.so/triggers/7421b7e8-38a9-40b0-8b46-466780a8b8d1/webhook'; const BIG_BRAIN_IN_CHANNEL = 'C0ACXEDBURJ';

app.post('/slack/events', async (req, res) => { const body = req.body; console.log('Payload:', JSON.stringify(body));

// Handle Slack URL verification challenge if (body.type === 'url_verification') { console.log('URL verification challenge received'); return res.json({ challenge: body.challenge }); }

// Acknowledge receipt immediately res.status(200).send('ok');

const event = body.event;

// Ignore bot messages if (event && (event.bot_id || event.subtype === 'bot_message')) { return; }

// Only forward .go messages from #big-brain-in if (event && event.channel === BIG_BRAIN_IN_CHANNEL && event.text && event.text.includes('.go')) {

try {
  await fetch(BIG_BRAIN_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trigger: 'slack_go_command',
      channel: event.channel,
      user: event.user,
      timestamp: event.ts,
      text: event.text
    })
  });
  console.log('Forwarded .go to Big Brain');
} catch (err) {
  console.error('Failed to forward:', err.message);
}

} });

app.get('/health', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000; app.listen(PORT, '0.0.0.0', () => { console.log('Slack proxy running on port ' + PORT); });

