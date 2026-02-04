const express = require('express');
const app = express();

app.use(express.json());

const BIG_BRAIN_WEBHOOK = 'https://build.twin.so/triggers/ee1d2a2d-6652-4a84-a490-b2d9773e33fb/webhook'; const BIG_BRAIN_IN_CHANNEL = 'C0ACXEDBURJ';

app.post('/slack/events', async function(req, res) { const body = req.body; console.log('Payload:', JSON.stringify(body));

if (body.type === 'url_verification') { console.log('URL verification challenge received'); return res.json({ challenge: body.challenge }); }

res.status(200).send('ok');

const event = body.event;

if (event && (event.bot_id || event.subtype === 'bot_message')) { return; }

if (event && event.channel === BIG_BRAIN_IN_CHANNEL && event.text && event.text.includes('.go')) { try { const payload = { trigger: 'slack_go_command', channel: event.channel, user: event.user, timestamp: event.ts, text: event.text }; await fetch(BIG_BRAIN_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); console.log('Forwarded .go to Big Brain'); } catch (err) { console.error('Failed to forward:', err.message); } } });

app.get('/health', function(req, res) { res.send('ok'); });

const PORT = process.env.PORT || 3000; app.listen(PORT, '0.0.0.0', function() { console.log('Slack proxy running on port ' + PORT); });
