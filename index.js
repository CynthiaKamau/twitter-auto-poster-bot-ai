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
    // Generate AI content and tweet it; no fallback to avoid repeats
    const generatedText = await generateAIContent();
    console.log("Generated AI text:", generatedText);
    await sendTweet(generatedText);
  } catch (error) {
    console.error("Error generating AI content:", error);
    console.error(
      "No tweet sent. Fix Gemini API issues or re-enable fallback if desired."
    );
  }
}

async function generateAIContent() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Rotate between different prompt styles for variety
  const prompts = [
    "Create a Twitter/X post about living healthy, loving yourself, moving your body, reading, and embracing therapy. Warm tone, 2-3 relevant hashtags (e.g., #SelfLove #HealthyHabits #Therapy) and emojis. Under 280 characters.",
    "Write a Twitter/X post on working hard in career or business: discipline, consistency, shipping work. Confident but humble tone. Add 2-3 hashtags like #CareerGrowth #BuildInPublic #Discipline with emojis. Under 280 characters.",
    "Generate a Twitter/X post about peace and forgiveness—choosing to let go, protect energy, and stay kind. Include 2-3 hashtags such as #Peace #LetGo #Forgiveness with gentle emojis. Under 280 characters.",
    "Craft a Twitter/X post about living like it's the last day: gratitude, courage, giving your best. Add 2-3 hashtags like #Gratitude #BestDay #NoRegrets with emojis. Under 280 characters.",
    "Write a Twitter/X post on cultivating good relationships and being the bigger person: empathy, boundaries, checking on people. Include hashtags like #Relationships #Kindness #Growth with emojis. Under 280 characters.",
    "Create a Twitter/X carousel-friendly blurb for healthy routines: workout, water, reading, therapy, sleep. Conversational, 2-3 hashtags (#Wellness #Habits #SelfCare) with emojis. Under 280 characters.",
    "Generate a Twitter/X post about career focus: protect deep work, learn daily, document, ship. Motivating and clear. Use 2-3 hashtags (#WorkSmart #Career #Execution) with emojis. Under 280 characters.",
    "Write a Twitter/X post about forgiving others to free yourself, keeping relationships light, and choosing peace. 2-3 hashtags (#Healing #Peace #Growth) with soft emojis. Under 280 characters.",
  ];

  // Pick a prompt purely at random to reduce repetition
  const promptIndex = Math.floor(Math.random() * prompts.length);
  const selectedPrompt = prompts[promptIndex];

  const result = await model.generateContent(selectedPrompt);
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
    // Healthy lifestyle, self-love, movement, reading, therapy
    {
      type: "health_self_love",
      templates: [
        "New year rhythm: hydrate, move 30 mins, read 20 pages, therapy on the calendar, kind words in the mirror. 📚💪 #SelfLove #HealthyHabits #Therapy",
        "My self-love kit: morning stretch, nourishing meals, honest therapy session, a chapter before bed. Small rituals, big peace. 🌿 #Wellness #Routine #SelfCare",
        "Body, mind, heart checklist: workout done, pages read, feelings named, therapist texted, water refilled. Keep choosing you. ✨ #HealthyLifestyle #MentalHealth #Growth",
        "Protect your energy: gym shoes ready, book by the bed, therapist on speed dial, softer self-talk on repeat. 🧠💙 #Healing #SelfLove #Habits",
      ],
    },
    // Working hard in career/business
    {
      type: "career_grind",
      templates: [
        "Career mode: block deep work, ship something daily, ask better questions, document lessons. Consistency is the cheat code. 🚀 #CareerGrowth #Execution #Discipline",
        "Business note: momentum beats motivation. Build, test, learn, repeat. Less waiting, more shipping. ⚡ #BuildInPublic #StartupLife #Action",
        "Hard work isn't loud; results are. Protect focus, deliver value, follow up, stay humble. 📈 #WorkEthic #ProfessionalGrowth #Consistency",
        "Today's stack: early start, tight priorities, one brave email, one shipped deliverable. Show up, stack wins. 🛠️ #Career #Discipline #Progress",
      ],
    },
    // Peace and forgiveness
    {
      type: "peace_forgiveness",
      templates: [
        "Peace over replay: I release the reruns, keep the lesson, and choose a lighter heart. 🌿 #Peace #LetGo #Forgiveness",
        "Forgiveness isn't approval—it's freedom. I am choosing to walk lighter this year. 🤍 #Healing #Grace #Growth",
        "Not carrying last year's grudges into this year's plans. Protecting energy and keeping my heart soft. ✨ #Boundaries #Peace #Forgive",
        "Letting go is productive. Less rumination, more room for joy. 🌱 #MentalHealth #Peace #Clarity",
      ],
    },
    // Living like it's the last day
    {
      type: "last_day_energy",
      templates: [
        "Last-day energy: say the kind thing, take the shot, call your people, give your best, rest without guilt. 💫 #NoRegrets #Gratitude #LiveFully",
        "If today was the last chapter, would you be proud of this paragraph? Go all in. 📝 #BestDay #Courage #Presence",
        "No idle days: express gratitude, move your body, build something, love loudly. 🧭 #LiveNow #Purpose #Gratitude",
        "Leave nothing unsaid, no effort unmade. Love hard, work smart, rest well. 🌅 #NoRegrets #BestEffort #Life",
      ],
    },
    // Relationships and being the bigger person
    {
      type: "relationships",
      templates: [
        "Check on your people, celebrate their wins, listen without fixing. Relationships are built, not assumed. 🤝 #Relationships #Community #Kindness",
        "Being the bigger person = respect + boundaries + grace. Strength without being a doormat. 🧘 #Maturity #Growth #Empathy",
        "New year pact: fewer assumptions, more questions; fewer walls, more bridges. 🪜 #Connection #Relationships #Understanding",
        "Lead with kindness, keep your boundaries, choose repair over ego. 🌉 #BiggerPerson #Peace #HealthyRelationships",
      ],
    },
  ];

  const replacements = {
    adjective: ["stronger", "braver", "kinder", "steadier", "lighter"],
    quality: ["worthy", "enough", "valuable", "loved", "respected"],
    emotion: ["peace", "focus", "courage", "hope", "clarity", "joy"],
    action: ["healing", "growth", "kindness", "courage", "repair"],
    affirmation: [
      "exactly who I need to be",
      "worthy of rest and success",
      "capable of hard and soft things",
      "growing wiser daily",
      "deserving of healthy love",
    ],
    desire: [
      "peace that lasts",
      "love that is mutual",
      "growth that feels good",
      "work that matters",
      "rest that restores",
    ],
    mantra: [
      "I honor my pace",
      "I give my best and let go",
      "I am allowed to rest",
      "I lead with kindness and boundaries",
      "I choose peace and progress",
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
