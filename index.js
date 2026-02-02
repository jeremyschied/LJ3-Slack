const express = require('express');
const app = express();

app.use(express.json());

const TWIN_WEBHOOK = 'https://build.twin.so/triggers/746aa7d4-0fe9-46bf-83b0-5a78527b11e3/webhook';

app.post('/slack/events', async (req, res) => {
  const body = req.body;
  console.log('Payload:', JSON.stringify(body));


                                              

if (body.type === 'url_verification') { console.log('URL verification challenge received'); return res.json({ challenge: body.challenge }); }

res.status(200).send('ok');

if (body.event && (body.event.bot_id || body.event.subtype === 'bot_message')) { return; }

try { await fetch(TWIN_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); console.log('Forwarded to Twin'); } catch (err) { console.error('Failed to forward:', err.message); } });

app.get('/health', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000; app.listen(PORT, '0.0.0.0', () => { console.log('Slack proxy running on port ' + PORT); });
