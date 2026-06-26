require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const {
  VERIFY_TOKEN,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  PORT = 3000,
} = process.env;

// ─── Endpoint 1: Webhook Verification ────────────────────────────────────────
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified by Meta');
    return res.status(200).send(challenge);
  }

  console.warn('Webhook verification failed — token mismatch or wrong mode');
  return res.sendStatus(403);
});

// ─── Endpoint 2: Receive Messages ────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Respond immediately — Meta requires a fast acknowledgement
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    // Ignore status updates (delivered/read receipts)
    if (!change?.messages) return;

    const message = change.messages[0];
    if (message.type !== 'text') return;

    const from = message.from;
    const text = message.text.body;

    console.log(`Incoming message from ${from}: "${text}"`);

    // PHASE 2: Claude integration goes here — replace the hardcoded reply below
    // with a call to Claude to generate an intelligent, context-aware response.
    const reply =
      'Thanks for reaching out to Crestville! A team member will respond shortly. 🏡';

    await sendWhatsAppMessage(from, reply);
  } catch (err) {
    console.error('Error handling incoming message:', err.message);
  }
});

// ─── Send Message Helper ──────────────────────────────────────────────────────
async function sendWhatsAppMessage(to, messageText) {
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  try {
    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Reply sent to ${to}`);
  } catch (err) {
    console.error(
      'Failed to send WhatsApp message:',
      err.response?.data ?? err.message
    );
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('Crestville WhatsApp bot is running.'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
