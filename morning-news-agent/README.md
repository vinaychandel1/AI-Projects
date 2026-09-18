# 📰 Morning News AI Agent

An automated news delivery system that fetches, formats, and sends daily news briefings via WhatsApp/SMS at 7:30 AM IST.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 📰 **Automated News Fetching** - Gets latest headlines from NewsAPI
- 📱 **WhatsApp/SMS Delivery** - Sends formatted briefings via Twilio
- ⏰ **Daily Scheduler** - Automatically runs at 7:30 AM IST
- 🎨 **Beautiful Formatting** - Clean, readable news summaries
- 🔄 **Multiple Categories** - Top headlines, Business, Technology
- 🧪 **Test Mode** - Preview emails before sending

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NewsAPI key (free tier available)
- Twilio account (for WhatsApp/SMS)

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd morning-news-agent
npm install
```

### 2. Configure Environment Variables

Create/edit `.env` file:

```env
# News API (Required)
NEWS_API_KEY=your_newsapi_key_here

# Your Phone Number
WHATSAPP_TO_NUMBER=918219895658

# Twilio Configuration (for WhatsApp/SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=whatsapp:+14155238886

# Optional: Email Configuration
EMAIL_TO=your.email@gmail.com
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Schedule (7:30 AM IST = 2:00 AM UTC)
SCHEDULE_CRON=30 2 * * *
```

### 3. Get API Keys

#### NewsAPI (Free - Required)
1. Visit: https://newsapi.org/register
2. Sign up and verify email
3. Copy your API key
4. Add to `.env`: `NEWS_API_KEY=your_key`

#### Twilio (Optional - for WhatsApp/SMS)
1. Sign up: https://www.twilio.com/try-twilio
2. Get $15 free credit
3. Note: **Trial accounts have limitations** (see below)
4. For production: Add $20+ to remove restrictions

## 📱 Twilio WhatsApp Setup

### Join WhatsApp Sandbox (Required for Trial)

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. You'll see a join code like: `join happy-tiger`
3. From your WhatsApp, send that message to Twilio's number
4. Wait for confirmation

### Get Credentials

From Twilio Console:
- **Account SID** (starts with AC...)
- **Auth Token** (click to reveal)
- **From Number** (WhatsApp: `whatsapp:+14155238886`)

### ⚠️ Trial Account Limitations

**Twilio trial accounts have restrictions:**
- ✅ Can receive messages (for testing)
- ❌ Cannot send custom messages to WhatsApp
- ❌ Cannot send custom SMS content
- 💡 **Solution**: Add $20+ to your Twilio account to unlock full features

## 🎯 Usage

### Run Commands

```bash
# Get news immediately
npm run news

# Start daily scheduler (runs at 7:30 AM IST)
npm start

# Run once now + start scheduler
npm run now

# Test mode (no sending)
npm test
```

### Daily Scheduler

```bash
npm start
```

This will:
- Keep running in the background
- Send news every day at 7:30 AM IST
- Show status and logs
- Press `Ctrl+C` to stop

## 📂 Project Structure

```
morning-news-agent/
├── index.js           # Original implementation
├── send-news.js       # News fetcher & sender (current)
├── schedule.js        # Daily scheduler
├── news.js            # News API integration
├── ai.js              # AI summarization (optional)
├── whatsapp.js        # WhatsApp integration (optional)
├── .env               # Configuration (DO NOT COMMIT)
├── .env.example       # Example configuration
├── package.json       # Dependencies
├── README.md          # This file
└── SETUP.md           # Detailed setup guide
```

## 🔧 Configuration

### Schedule Time

Default: **7:30 AM IST**

To change, edit `.env`:
```env
SCHEDULE_CRON=30 2 * * *
```

Cron format: `minute hour * * *` (in UTC)
- 7:30 AM IST = 2:00 AM UTC = `30 2 * * *`
- 9:00 AM IST = 3:30 AM UTC = `30 3 * * *`

### News Categories

Currently fetches:
- 🔥 Top Headlines (US General News)
- 💰 Business (US Business)
- 🤖 Technology (US Tech)

Edit `news.js` to customize categories and countries.

## 📧 Email Delivery (Alternative)

If WhatsApp doesn't work, use email:

### Gmail Setup

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```env
   EMAIL_TO=your.email@gmail.com
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

### Test Email Preview

Without credentials, the system uses Ethereal (test SMTP):
- Creates preview links
- Shows what email looks like
- Doesn't send to real inbox

## 🧪 Testing

### Test News Fetching

```bash
npm run news
```

Shows:
- News articles fetched
- Message preview
- Delivery status

### Test Scheduler

```bash
npm run now
```

Runs immediately and starts scheduler.

## 🐛 Troubleshooting

### News Not Fetching

**Error: 401 Unauthorized**
- Check your `NEWS_API_KEY` in `.env`
- Verify key at: https://newsapi.org/account

**Error: 0 articles returned**
- NewsAPI free tier has limited data
- Try different country codes in `news.js`

### WhatsApp Not Sending

**Error: ContentSid Required**
- Twilio trial limitation
- Add funds to Twilio account ($20+)
- Or use email delivery instead

**Error: 21211 - Invalid destination**
- Make sure you joined WhatsApp sandbox
- Verify phone number format: `918219895658`

**Error: Authentication failed**
- Check Account SID and Auth Token
- Regenerate Auth Token if needed

### Scheduler Not Running

**Cron not triggering**
- Check timezone: Should be `Asia/Kolkata`
- Verify cron expression: `30 2 * * *`
- Keep terminal window open

## 🔐 Security

**Never commit `.env` file!**

It contains sensitive credentials:
- API keys
- Auth tokens
- Passwords

Always use `.env.example` for templates.

## 📊 API Limits

### NewsAPI (Free Tier)
- ✅ 500 requests/day
- ✅ Latest 24 hours only
- ❌ No commercial use

### Twilio (Trial)
- ✅ $15 free credit
- ✅ Test WhatsApp sandbox
- ❌ Limited to verified numbers
- ❌ Cannot send custom messages

**Upgrade for production use!**

## 🚀 Production Deployment

### Requirements
1. **Paid NewsAPI** ($449/month for commercial)
2. **Paid Twilio** ($20+ for WhatsApp)
3. **Server** (AWS, DigitalOcean, Heroku)
4. **Process Manager** (PM2, systemd)

### Deploy with PM2

```bash
npm install -g pm2
pm2 start schedule.js --name morning-news
pm2 save
pm2 startup
```

### Environment Variables on Server

Set via:
- `.env` file
- Environment variables
- Secrets manager (AWS, Heroku)

## 🎨 Customization

### Change News Sources

Edit `news.js`:
```javascript
const [usNews, indiaNews, techNews] = await Promise.all([
  fetchNews('general', 'us'),
  fetchNews('general', 'in'),
  fetchNews('technology', 'in')
]);
```

### Change Message Format

Edit `send-news.js` → `createMessage()` function

### Add AI Summarization

Uncomment AI integration in `ai.js`:
- Requires OpenRouter/OpenAI API key
- Add to `.env`: `OMNIROUTE_API_KEY`

## 📝 To-Do / Future Features

- [ ] Add AI-powered summarization
- [ ] Support multiple recipients
- [ ] Web dashboard for configuration
- [ ] More news sources (Reddit, Twitter)
- [ ] Sentiment analysis
- [ ] Custom news filters
- [ ] Weekly digest option
- [ ] Push notifications

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use and modify!

## 👤 Author

**Vinay Chandel**
- Phone: +91-8219895658
- Email: vinaychandel1525@gmail.com

## 🙏 Acknowledgments

- **NewsAPI** - News data provider
- **Twilio** - SMS/WhatsApp delivery
- **Node-cron** - Scheduling
- **Nodemailer** - Email delivery

## 📞 Support

Having issues?

1. Check this README
2. Read `SETUP.md`
3. Visit Twilio Console for message logs
4. Check NewsAPI dashboard for usage

## 🎯 Current Status

✅ **Working:**
- News fetching from NewsAPI
- Daily scheduling (7:30 AM IST)
- Message formatting
- Test email previews
- Complete codebase

⚠️ **Requires Upgrade:**
- WhatsApp delivery (Twilio trial limits)
- SMS delivery (Twilio trial limits)

💡 **Recommended:**
- Add $20 to Twilio → WhatsApp works
- Or use Gmail App Password → Email works

---

**Built with ❤️ for staying informed every morning!**

Last Updated: September 18, 2026
