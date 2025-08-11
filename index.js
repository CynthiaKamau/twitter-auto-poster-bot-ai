require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const genAI = new GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  try {
    // Try to generate AI content first
    const generatedText = await generateAIContent();
    console.log("Generated AI text:", generatedText);
    sendTweet(generatedText);
  } catch (error) {
    console.error("Error generating AI content:", error);
    // Only use fallback if AI generation fails
    const fallbackText = generateTemplateContent();
    console.log("Using template-generated message:", fallbackText);
    sendTweet(fallbackText);
  }
}

async function generateAIContent() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "You are creating content for Twitter/X. Generate an uplifting and motivational tweet. Focus on positivity, achieving goals, overcoming challenges, and inspiring others. The message should be authentic and remind people of their potential. IMPORTANT: The tweet must be EXACTLY under 280 characters including spaces, emojis, and hashtags. Use plain text with emojis and include 2-3 relevant hashtags like #Motivation #Inspiration #Success. Make it feel personal and supportive. Do not exceed 280 characters.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up and ensure it's tweet-appropriate
  text = text.trim();

  // Extra safety check - if still too long after Gemini's attempt
  if (text.length > 280) {
    console.log(`⚠️ Gemini generated ${text.length} characters. Truncating...`);
    text = text.substring(0, 277) + "...";
  }

  if (!text || text.length < 20) {
    throw new Error("Generated text too short");
  }

  console.log(`📝 AI generated text: ${text.length}/280 characters`);
  return text;
}

function generateTemplateContent() {
  // Enhanced content with general motivational themes
  const contentTypes = [
    // General motivational quotes
    {
      type: "motivational_quotes",
      templates: [
        '"The only way to do great work is to love what you do." - Steve Jobs 🚀 #Motivation #Inspiration #Success',
        '"Believe you can and you\'re halfway there." - Theodore Roosevelt 💪 #Mindset #Believe #PositiveThinking',
        '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt ✨ #Dreams #Future #Hope',
        '"Don\'t watch the clock; do what it does. Keep going." - Sam Levenson 🌟 #Motivation #HardWork #Persistence',
        '"The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt 📈 #Inspiration #Mindset #Success',
        '"It always seems impossible until it\'s done." - Nelson Mandela 🌈 #Impossible #Achievement #Motivation',
        '"The best way to predict your future is to create it." - Peter Drucker 🌱 #Future #CreateYourLife #Inspiration',
        '"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill 💖 #Success #Courage #Resilience',
      ],
    },
    // Empowerment with trending hashtags
    {
      type: "empowerment",
      templates: [
        "You are {adjective} than you think. You are {quality} beyond measure. Remember that today. 💖 #SelfLove #Empowerment #Motivation",
        "Your {emotion} is valid. Your journey is yours alone. Trust the process. 🦋 #MentalHealthMatters #SelfCare #Mindfulness",
        "Stop shrinking yourself to make others comfortable. Take up space. You belong here. 👑 #SelfWorth #Confidence #BeBold",
        "Your past doesn't define you. Your {action} does. Keep going. 🌟 #NewBeginnings #Growth #Motivation",
      ],
    },
    // Daily affirmations with engagement
    {
      type: "affirmations",
      templates: [
        'Daily Affirmation: "I am {affirmation}" 🌸 Save this if you need the reminder! #DailyAffirmation #SelfLove #Mindset',
        'Repeat after me: "I am worthy of {desire}" 💕 Like if you believe it! #Affirmations #SelfWorth #LoveYourself',
        "Today's mantra: \"{mantra}\" 🧘‍♀️ What's yours? Share below! #Mindfulness #Meditation #SelfCare",
      ],
    },
    // Questions for engagement
    {
      type: "engagement",
      templates: [
        "What's one thing you're grateful for today? Let's spread some positivity! 🌻 #Gratitude #Positivity #MentalHealth",
        "What's your favorite way to stay motivated? Share your tips! 💛 #Motivation #Productivity #SelfCare",
        "What song instantly lifts your mood? Drop it below! 🎵 #MusicHeals #Mood #ShareYourVibes",
        "What's one piece of advice you'd give to your younger self? 💭 #Wisdom #Life #Reflection",
      ],
    },
  ];

  const replacements = {
    adjective: [
      "stronger",
      "braver",
      "more resilient",
      "more capable",
      "more beautiful",
      "wiser",
      "more powerful",
    ],
    quality: [
      "beautiful",
      "worthy",
      "amazing",
      "enough",
      "valued",
      "loved",
      "important",
    ],
    emotion: [
      "passion",
      "drive",
      "ambition",
      "focus",
      "determination",
      "courage",
      "resilience",
    ],
    action: [
      "resilience",
      "courage",
      "kindness",
      "strength",
      "growth",
      "healing",
      "journey",
    ],
    affirmation: [
      "enough as I am",
      "worthy of love",
      "deserving of happiness",
      "growing every day",
      "capable of anything",
      "stronger than I know",
    ],
    desire: [
      "love that stays",
      "peace that lasts",
      "joy that heals",
      "respect that honors you",
      "success that fulfills you",
      "happiness that sustains you",
    ],
    mantra: [
      "I am exactly where I need to be",
      "I choose progress over perfection",
      "I am worthy of good things",
      "I trust my journey",
      "I am capable of achieving my goals",
    ],
  };

  // Randomly select content type
  const contentType =
    contentTypes[Math.floor(Math.random() * contentTypes.length)];
  const template =
    contentType.templates[
      Math.floor(Math.random() * contentType.templates.length)
    ];

  let result = template;
  Object.keys(replacements).forEach((key) => {
    if (result.includes(`{${key}}`)) {
      const options = replacements[key];
      const replacement = options[Math.floor(Math.random() * options.length)];
      result = result.replace(`{${key}}`, replacement);
    }
  });

  return result;
}

run();

async function sendTweet(tweetText) {
  try {
    // Validate tweet length before sending
    if (tweetText.length > 280) {
      console.log(
        `⚠️ Tweet too long (${tweetText.length} characters). Truncating...`
      );
      tweetText = tweetText.substring(0, 277) + "...";
    }

    console.log(`📝 Tweet length: ${tweetText.length}/280 characters`);
    console.log("Attempting to tweet:", tweetText);
    console.log("Using credentials:");
    console.log("- APP_KEY:", SECRETS.APP_KEY ? "✓ Set" : "✗ Missing");
    console.log("- APP_SECRET:", SECRETS.APP_SECRET ? "✓ Set" : "✗ Missing");
    console.log(
      "- ACCESS_TOKEN:",
      SECRETS.ACCESS_TOKEN ? "✓ Set" : "✗ Missing"
    );
    console.log(
      "- ACCESS_SECRET:",
      SECRETS.ACCESS_SECRET ? "✓ Set" : "✗ Missing"
    );

    const tweet = await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!", tweet);
  } catch (error) {
    console.error("Error sending tweet:", error);
    console.error("Error details:", error.data || error.message);

    // Check if it's a credentials issue
    if (error.code === 401) {
      console.log("\n🔑 Twitter API Authentication Error!");
      console.log("Please verify your Twitter API credentials:");
      console.log("1. Check that your API keys are correct in the .env file");
      console.log("2. Ensure your Twitter app has Read and Write permissions");
      console.log("3. Make sure you're using the correct API version (v2)");
      console.log("4. Verify your app is not suspended or restricted");
    } else if (error.code === 403) {
      console.log("\n🚫 Twitter API Permission Error!");
      console.log(
        "This could be an API access level issue. You may need Elevated access."
      );
    }
  }
}
