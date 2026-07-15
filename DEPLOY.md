# Deploy to Railway (fastest option)

## One-time setup

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Connect your GitHub account and push this folder to a new repo first:
   ```
   git init
   git add .
   git commit -m "initial"
   gh repo create crestville-whatsapp-bot --public --push --source .
   ```
4. Select the repo in Railway → it auto-detects Node and deploys

## Set environment variables in Railway

In your Railway project dashboard → **Variables** tab, add:

| Key | Value |
|-----|-------|
| `VERIFY_TOKEN` | Pick any secret string, e.g. `crestville_secret_2024` |
| `WHATSAPP_TOKEN` | Permanent token from Meta Business Settings → System Users |
| `WHATSAPP_PHONE_NUMBER_ID` | The Phone Number ID from Meta WhatsApp API Setup page |
| `PORT` | `3000` |
| `ANTHROPIC_API_KEY` | Claude API key from the Anthropic Console |
| `CX_ALERT_NUMBER` | CX team's WhatsApp number, international format, no `+` |
| `RESPONDIO_WEBHOOK_URL` | Optional — only once Respond.io is configured |

## Get your public URL

Railway assigns a URL like:
```
https://crestville-whatsapp-bot-production.up.railway.app
```

Your webhook callback URL for Meta will be:
```
https://crestville-whatsapp-bot-production.up.railway.app/webhook
```

## What to paste into Meta's dashboard

| Meta field | Value |
|------------|-------|
| **Callback URL** | `https://your-railway-url.up.railway.app/webhook` |
| **Verify Token** | Exactly the string you set as `VERIFY_TOKEN` above |

Click **Verify and Save** — Meta will hit `GET /webhook` and the server will respond with the challenge. If it goes green, you're unblocked.

---

# Alternative: Deploy to Render

1. Go to https://render.com → **New → Web Service**
2. Connect your GitHub repo
3. Set **Start Command** to `node index.js`
4. Add the same environment variables under **Environment**
5. Your URL will be `https://crestville-whatsapp-bot.onrender.com`

> Note: Render's free tier spins down after inactivity — Railway stays warm and is better for a webhook that needs instant response times.
