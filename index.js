index.js
const express = require('express');
const app = express();

app.use(express.json());

const TWIN_WEBHOOK = 'https://build.twin.so/triggers/a7558d78-64df-41df-8538-86012d24ac56/webhook';

app.post('/slack/events', async (req, res) => { const body = req.body;

// Handle Slack URL verification challenge if (body.type === 'url_verification') { console.log('URL verification challenge received'); return res.json({ challenge: body.challenge }); }

// Respond to Slack immediately (avoid 3s timeout) res.status(200).send('ok');

// Ignore bot messages and retries if (body.event?.bot_id || body.event?.subtype === 'bot_message') { return; }

// Forward to Twin webhook try { await fetch(TWIN_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); console.log('Forwarded to Twin:', body.event?.text); } catch (err) { console.error('Failed to forward:', err.message); } });

app.get('/health', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log(Slack proxy running on port ${PORT}));
