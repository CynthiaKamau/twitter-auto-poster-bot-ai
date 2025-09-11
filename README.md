# 🤖 AI-Powered Twitter Auto Poster Bot

Automate your Twitter/X account to post engaging, motivational content using AI! This bot generates dynamic tweets using Google Gemini AI and posts them automatically on a schedule.

## ✨ Features

- 🧠 **AI-Generated Content**: Uses Google Gemini to create unique, engaging tweets
- 📝 **Template Fallbacks**: Pre-written motivational templates for reliability
- ⏰ **Automated Scheduling**: GitHub Actions runs your bot at optimal times
- 🎯 **Customizable Content**: Easy to modify themes and messaging
- 📊 **Character Validation**: Ensures all tweets are under 280 characters
- 🔄 **Dynamic Variety**: Multiple prompt styles prevent repetitive content

## 🚀 Quick Start

### Prerequisites

Before getting started, ensure you have:

- **Node.js (v18 or higher)** - [Download here](https://nodejs.org/en/download/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Twitter Developer Account** - [Apply here](https://developer.twitter.com/en/apply-for-access)
- **Google AI Studio Account** - [Get API key here](https://makersuite.google.com/app/apikey)
- **GitHub Account** - [Sign up here](https://github.com/) (for automated scheduling)
- **Git** installed on your system

#### Verify Node.js Installation

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

If you don't have Node.js installed:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Follow the installation wizard
4. Restart your terminal/command prompt

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/twitter-auto-poster-bot-ai.git
cd twitter-auto-poster-bot-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your API credentials:

```env
APP_KEY=your_twitter_api_key
APP_SECRET=your_twitter_api_secret
ACCESS_TOKEN=your_twitter_access_token
ACCESS_SECRET=your_twitter_access_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 🔑 Getting API Keys

#### Twitter API Keys

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use existing one
3. Generate API Key, API Secret, Access Token, and Access Secret
4. Ensure your app has **Read and Write** permissions

#### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 🛠️ Development Commands

### Available Scripts

| Command         | Description                      | When to Use                |
| --------------- | -------------------------------- | -------------------------- |
| `npm start`     | Runs the bot once and exits      | Production, manual testing |
| `npm run dev`   | Same as start (development mode) | Local development          |
| `node index.js` | Direct Node.js execution         | Debugging, testing         |

### Development Workflow

#### 1. Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd twitter-auto-poster-bot-ai
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys
```

#### 2. Local Testing

```bash
# Test the bot locally (will post to Twitter)
npm start

# Check what content would be generated
node -e "
const { generateTemplateContent } = require('./index.js');
console.log(generateTemplateContent());
"
```

#### 3. Content Development

```bash
# Make changes to templates in index.js
# Test locally to see results
npm run dev

# Check character counts
node -e "
const content = 'Your test tweet content here #test #motivation';
console.log(\`Length: \${content.length}/280 characters\`);
"
```

#### 4. Deploy Changes

```bash
# Commit and push changes
git add .
git commit -m "Updated content templates"
git push origin main

# GitHub Actions will automatically run the bot on schedule
```

### Testing Different Content Types

Create a test script to preview your content:

```bash
# Create test-content.js
echo 'const { generateTemplateContent } = require("./index.js");

for (let i = 0; i < 5; i++) {
  const content = generateTemplateContent();
  console.log(`${i + 1}. ${content}`);
  console.log(`   Length: ${content.length}/280 characters\n`);
}' > test-content.js

# Run the test
node test-content.js
```

### Debugging Tips

#### Check Environment Variables

```bash
node -e "
require('dotenv').config();
console.log('APP_KEY:', process.env.APP_KEY ? '✓ Set' : '✗ Missing');
console.log('APP_SECRET:', process.env.APP_SECRET ? '✓ Set' : '✗ Missing');
console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
console.log('ACCESS_SECRET:', process.env.ACCESS_SECRET ? '✓ Set' : '✗ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
"
```

#### Test API Connections

```bash
# Test Twitter API (without posting)
node -e "
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

client.v2.me().then(user => {
  console.log('✓ Twitter API connected:', user.data.username);
}).catch(err => {
  console.error('✗ Twitter API error:', err.message);
});
"
```

### Automated Scheduling

1. **Push to GitHub:**

```bash
git add .
git commit -m "Setup Twitter bot"
git push origin main
```

2. **Add Repository Secrets:**

   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `APP_KEY`
     - `APP_SECRET`
     - `ACCESS_TOKEN`
     - `ACCESS_SECRET`
     - `GEMINI_API_KEY`

3. **Set up GitHub Environment (Optional):**
   - Go to Settings → Environments
   - Create environment named `twitter-bot`
   - Add your secrets there for better organization

The bot will automatically post at optimal engagement times:

- 12 PM UTC (Morning peak)
- 5 PM UTC (Lunch peak)
- 9 PM UTC (Evening peak)
- 2 AM UTC (Night peak)

## 🎨 Customization

### Creating Your Own Templates

The bot includes a robust template system that you can easily customize. Here's how to create your own content themes:

#### 1. Locate the Template Function

Open `index.js` and find the `generateTemplateContent()` function around line 70.

#### 2. Add New Content Types

```javascript
const contentTypes = [
  // Add your custom content type
  {
    type: "tech_tips",
    templates: [
      "Tech tip of the day: {tip} 💻 Share if this helps! #TechTips #Coding #Programming",
      "Did you know? {fact} Try it out and let me know! 🚀 #TechFacts #Development",
      "Quick productivity hack: {hack} What's your favorite? 🔥 #Productivity #TechHacks",
    ],
  },
  {
    type: "business_motivation",
    templates: [
      "Entrepreneur mindset: {mindset} 💡 Tag someone who needs this! #Entrepreneur #Business #Mindset",
      "Business tip: {tip} 📈 What's working for you? #BusinessTips #Success #Growth",
    ],
  },
  // ...existing content types
];
```

#### 3. Create Custom Replacements

Add variables for your placeholders:

```javascript
const replacements = {
  tip: [
    "Always comment your code",
    "Use version control",
    "Test early and often",
  ],
  fact: [
    "CSS Grid is more powerful than Flexbox for 2D layouts",
    "JavaScript is single-threaded",
  ],
  hack: [
    "Use keyboard shortcuts",
    "Batch similar tasks",
    "Take regular breaks",
  ],
  mindset: [
    "Think long-term",
    "Focus on value creation",
    "Embrace failure as learning",
  ],
  // ...existing replacements
};
```

#### 4. Template Best Practices

- Keep tweets under 280 characters including hashtags
- Use 2-3 relevant hashtags for better reach
- Include emojis to increase engagement
- Ask questions to encourage interaction
- Use action words like "Share", "Tag", "Try"

### Customizing AI Prompts

#### 1. Find the AI Function

Locate `generateAIContent()` function in `index.js` around line 30.

#### 2. Modify Prompts for Your Niche

```javascript
const prompts = [
  "Create a tech tip tweet about web development best practices. Include code-related emojis and hashtags like #WebDev #Coding. Under 280 characters.",
  "Write a motivational tweet for entrepreneurs about overcoming challenges. Use hashtags like #Entrepreneur #Business #Success. Under 280 characters.",
  "Generate a tweet about productivity tips for remote workers. Include hashtags like #RemoteWork #Productivity. Under 280 characters.",
  // Add more prompts specific to your content
];
```

#### 3. Content Themes You Can Use

- **Tech/Programming**: Web development, coding tips, tech news
- **Business**: Entrepreneurship, marketing, sales strategies
- **Lifestyle**: Productivity, health, personal development
- **Creative**: Design tips, writing advice, creative processes
- **Education**: Learning techniques, study tips, skill development

### Adjusting Post Frequency

#### Option 1: Quick Changes in Workflow File

Edit `.github/workflows/twitter-bot.yml`:

```yaml
on:
  schedule:
    # Post every 6 hours
    - cron: "0 */6 * * *"

    # Or post twice daily
    - cron: "0 9 * * *" # 9 AM UTC
    - cron: "0 21 * * *" # 9 PM UTC

    # Or post only on weekdays at 10 AM UTC
    - cron: "0 10 * * 1-5"
```

#### Option 2: Peak Engagement Times by Region

```yaml
# For US audience (EST/PST)
- cron: "0 13 * * *" # 9 AM EST / 6 AM PST
- cron: "0 17 * * *" # 1 PM EST / 10 AM PST
- cron: "0 22 * * *" # 6 PM EST / 3 PM PST

# For European audience (CET)
- cron: "0 7 * * *" # 8 AM CET
- cron: "0 11 * * *" # 12 PM CET
- cron: "0 17 * * *" # 6 PM CET
```

### Content Variables Reference

Use these placeholders in your templates - they'll be automatically replaced:

#### Personality Traits

- `{adjective}`: stronger, braver, more resilient, more capable, more beautiful, wiser, more powerful
- `{quality}`: beautiful, worthy, amazing, enough, valued, loved, important

#### Emotions & Actions

- `{emotion}`: passion, drive, ambition, focus, determination, courage, resilience
- `{action}`: resilience, courage, kindness, strength, growth, healing, journey

#### Affirmations & Goals

- `{affirmation}`: "enough as I am", "worthy of love", "deserving of happiness", "growing every day"
- `{desire}`: "love that stays", "peace that lasts", "joy that heals", "success that fulfills you"
- `{mantra}`: "I am exactly where I need to be", "I choose progress over perfection"

#### Example Usage

```javascript
"You are {adjective} than you think! Your {emotion} will lead you to {desire}. 💪 #Motivation";
// Becomes: "You are stronger than you think! Your determination will lead you to success that fulfills you. 💪 #Motivation"
```

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "start": "node index.js", // Run the bot once
    "dev": "node index.js", // Development mode
    "test": "echo 'No tests specified'" // Future: Add tests
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**403 Forbidden Error:**

- Ensure your Twitter app has Read and Write permissions
- Apply for Elevated access in Twitter Developer Portal
- Regenerate Access Token and Secret after permission changes

**401 Unauthorized Error:**

- Check if your API keys are correct
- Verify your app isn't suspended
- Ensure environment variables are properly set

**Character Limit Issues:**

- The bot automatically truncates tweets over 280 characters
- Adjust your prompts to generate shorter content

**AI Generation Fails:**

- Check your Gemini API key is valid
- Verify you haven't exceeded API quotas
- The bot will use template fallbacks automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for content generation
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api) for posting capabilities
- [GitHub Actions](https://github.com/features/actions) for automated scheduling

---

⭐ **Star this repo if it helped you automate your Twitter presence!**
