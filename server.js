import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MEM0_API_KEY = process.env.MEM0_API_KEY || "";
const MEM0_BASE_URL = process.env.MEM0_BASE_URL || "https://api.mem0.ai";
const MEM0_APP_ID = process.env.MEM0_APP_ID || "ucl-study-hub";

const MAX_QUIZ_COUNT = 100;
const DEFAULT_BATCH_SIZE = 20;

const COURSE_BLUEPRINTS = {
  economics: {
    displayName: "Economics",
    audience:
      "first-year undergraduate students studying Business and Health",
    systemContext:
      "Focus on first-year economics revision for non-specialists. Questions should be accurate, clear, and exam-relevant.",
    concepts: [
      "climate change",
      "temperature anomaly",
      "GDP",
      "well-being",
      "correlation vs causation",
      "natural experiments",
      "difference-in-differences",
      "money creation",
      "bank lending",
      "supply",
      "demand",
      "equilibrium",
      "elasticity",
      "identification problem",
      "inflation",
      "GDP deflator",
      "CPI",
      "unemployment",
      "life satisfaction",
      "fiscal policy",
      "monetary policy",
      "firms",
      "marginal cost",
      "fixed cost",
      "variable cost",
      "reservation wage",
      "employment rent",
      "principal-agent problem",
      "productivity",
      "inequality",
      "Lorenz curve",
      "Gini coefficient",
      "redistribution",
      "predistribution",
      "game theory",
      "Nash equilibrium",
      "dominant strategy",
      "prisoners' dilemma",
      "Pareto efficiency",
      "monopoly",
      "oligopoly",
      "perfect competition",
      "market failure",
      "deadweight loss",
      "public goods",
      "common goods",
      "free riding",
      "Ostrom governance",
      "cost-benefit analysis",
      "willingness to pay"
    ]
  },

  statistics: {
    displayName: "Statistics",
    audience:
      "first-year undergraduate students studying introductory statistics and data insights in health and business",
    systemContext:
      "Focus on UCL-style first-year statistics revision. Questions should emphasise method choice, interpretation of statistical output, causal reasoning, and practical data literacy rather than heavy formula memorisation.",
    concepts: [
      "sampling",
      "population",
      "sample",
      "random sample",
      "sampling bias",
      "mean",
      "median",
      "percentile",
      "standard deviation",
      "standard error",
      "confidence interval",
      "descriptive statistics",
      "correlation",
      "linear regression",
      "scatter plot",
      "slope coefficient",
      "intercept",
      "R squared",
      "prediction",
      "inference",
      "null hypothesis",
      "alternative hypothesis",
      "p-value",
      "statistical significance",
      "causality",
      "confounding",
      "reverse causality",
      "omitted variable bias",
      "RCT",
      "experimentation",
      "difference-in-differences",
      "residuals",
      "fitted values",
      "heteroskedasticity",
      "nonlinear relationship",
      "variable transformation",
      "interaction effect",
      "effect modification",
      "logistic regression",
      "binary outcome",
      "odds",
      "odds ratio",
      "risk difference",
      "risk ratio",
      "predicted probability",
      "classification threshold",
      "survival analysis",
      "time-to-event data",
      "censoring",
      "survival curve",
      "discrete-time survival model",
      "data visualisation",
      "Tableau",
      "dimension",
      "measure",
      "histogram",
      "box plot",
      "line chart",
      "dashboard",
      "data science workflow",
      "raw data",
      "insight",
      "prediction",
      "prescription",
      "train-test split",
      "baseline model",
      "data leakage",
      "no-show prediction",
      "machine learning",
      "decision tree",
      "split",
      "leaf node",
      "overfitting",
      "interpretability",
      "random forest"
    ]
  },

  accounting: {
    displayName: "Accounting and Finance",
    audience:
      "first-year undergraduate students studying introductory accounting and finance for managers in business and health",
    systemContext:
      "Focus on first-year Accounting and Finance revision for non-specialists. Questions should cover financial statements, cash flow, costing, budgeting, time value of money, investment appraisal, financing decisions, and healthcare-relevant managerial applications. Keep the language clear, natural, and exam-oriented.",
    concepts: [
      "business and firm",
      "financing assets operations revenue",
      "financial accounting",
      "management accounting",
      "shareholders",
      "board of directors",
      "ownership and control",
      "limited liability",

      "balance sheet",
      "statement of financial position",
      "income statement",
      "profit and loss statement",
      "assets",
      "liabilities",
      "equity",
      "retained earnings",
      "revenue",
      "expenses",
      "gross profit",
      "operating profit",
      "net profit",
      "depreciation",

      "statement of cash flows",
      "cash equivalents",
      "operating activities",
      "investing activities",
      "financing activities",
      "cash versus profit",
      "liquidity",
      "working capital",
      "trade receivables",
      "trade payables",
      "inventory",

      "ratio analysis",
      "profitability ratio",
      "efficiency ratio",
      "liquidity ratio",
      "gross profit margin",
      "operating profit margin",
      "return on shareholders funds",
      "return on capital employed",
      "inventory turnover period",
      "trade receivables collection period",
      "trade payables settlement period",
      "sales revenue to capital employed",

      "cost",
      "expense",
      "cost behaviour",
      "fixed cost",
      "variable cost",
      "semi-variable cost",
      "contribution margin",
      "cost structure",
      "breakeven point",
      "margin of safety",
      "pricing decision",

      "budget",
      "forecast",
      "budgetary control",
      "top-down budgeting",
      "bottom-up budgeting",
      "master budget",
      "flexible budget",
      "variance analysis",
      "favourable variance",
      "unfavourable variance",
      "sales volume variance",
      "sales price variance",
      "material price variance",
      "material usage variance",
      "labour rate variance",
      "labour efficiency variance",
      "profit reconciliation",

      "timeline",
      "time value of money",
      "present value",
      "future value",
      "discounting",
      "compounding",
      "cash flow stream",
      "perpetuity",
      "annuity",

      "NPV",
      "NPV rule",
      "IRR",
      "IRR rule",
      "payback period",
      "payback rule",
      "stand-alone project",
      "mutually exclusive projects",
      "scale timing risk problem",
      "profitability index",
      "capital constraints",
      "resource constraints",

      "sensitivity analysis",
      "scenario analysis",
      "risk analysis",
      "capital structure",
      "debt",
      "equity",
      "MM proposition 1",
      "MM proposition 2",
      "trade-off theory",

      "private placing",
      "IPO",
      "rights issue",
      "bank borrowing",
      "bonds",
      "venture capital",
      "angel investors",
      "crowdfunding",
      "weighted average cost of capital",
      "WACC",
      "shareholder payout policy",

      "healthcare finance",
      "hospital budgeting",
      "healthcare investment appraisal",
      "NHS project evaluation"
    ]
  }
};

function clampQuizCount(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 10;
  return Math.max(1, Math.min(MAX_QUIZ_COUNT, Math.floor(parsed)));
}

function shuffleArray(input) {
  const arr = [...input];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function extractJsonPayload(text) {
  const raw = cleanText(text)
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No valid JSON object found in model response.");
  }

  return raw.slice(firstBrace, lastBrace + 1);
}

function normalizeQuestion(rawQuestion, index, fallbackConcept = "general") {
  const letters = ["A", "B", "C", "D"];
  const rawOptions = Array.isArray(rawQuestion?.options) ? rawQuestion.options : [];

  const normalizedOptions = letters.map((letter, optionIndex) => {
    const candidate = rawOptions[optionIndex];

    if (typeof candidate === "string") {
      return {
        key: letter,
        text: cleanText(candidate) || `Option ${letter}`
      };
    }

    if (candidate && typeof candidate === "object") {
      return {
        key: letter,
        text:
          cleanText(candidate.text) ||
          cleanText(candidate.option) ||
          cleanText(candidate.label) ||
          `Option ${letter}`
      };
    }

    return {
      key: letter,
      text: `Option ${letter}`
    };
  });

  let correctAnswer = cleanText(
    rawQuestion?.correctAnswer || rawQuestion?.correct || "A"
  ).toUpperCase();

  if (!letters.includes(correctAnswer)) {
    correctAnswer = "A";
  }

  const difficulty = cleanText(rawQuestion?.difficulty || "medium").toLowerCase();
  const safeDifficulty = ["easy", "medium", "hard"].includes(difficulty)
    ? difficulty
    : "medium";

  return {
    question: cleanText(rawQuestion?.question) || `Question ${index + 1}`,
    questionZh: cleanText(rawQuestion?.questionZh),
    options: normalizedOptions,
    correctAnswer,
    explanation:
      cleanText(rawQuestion?.explanation) ||
      "Review the concept carefully and compare the options one by one.",
    explanationZh:
      cleanText(rawQuestion?.explanationZh) ||
      "请回到该知识点，逐个比较四个选项。",
    concept: cleanText(rawQuestion?.concept) || fallbackConcept,
    difficulty: safeDifficulty
  };
}

function dedupeQuestions(questions) {
  const seen = new Set();
  const unique = [];

  for (const question of questions) {
    const key = `${cleanText(question.question).toLowerCase()}__${cleanText(
      question.concept
    ).toLowerCase()}`;

    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(question);
  }

  return unique;
}

function dedupeTextList(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const normalized = cleanText(item).toLowerCase();
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    result.push(cleanText(item));
  }

  return result;
}

function tallyConcepts(attempts = []) {
  const map = {};

  for (const attempt of attempts) {
    const concept = cleanText(attempt?.concept || "general");

    if (!map[concept]) {
      map[concept] = { correct: 0, incorrect: 0 };
    }

    if (attempt?.isCorrect) {
      map[concept].correct += 1;
    } else {
      map[concept].incorrect += 1;
    }
  }

  return map;
}

function summarizeConceptPerformance(attempts = []) {
  const tallied = tallyConcepts(attempts);

  const weakAreas = Object.entries(tallied)
    .filter(([, stats]) => stats.incorrect > 0)
    .sort((a, b) => b[1].incorrect - a[1].incorrect)
    .map(([concept, stats]) => `${concept} (missed ${stats.incorrect})`);

  const strongAreas = Object.entries(tallied)
    .filter(([, stats]) => stats.correct > 0 && stats.incorrect === 0)
    .sort((a, b) => b[1].correct - a[1].correct)
    .map(([concept, stats]) => `${concept} (correct ${stats.correct})`);

  return {
    weakAreas,
    strongAreas
  };
}

async function mem0Request(endpoint, payload) {
  if (!MEM0_API_KEY) return null;

  const response = await fetch(`${MEM0_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${MEM0_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mem0 request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function searchMem0Context({ userId, topic, weakTopics = [] }) {
  if (!MEM0_API_KEY || !userId) {
    return {
      usedMem0: false,
      memories: []
    };
  }

  const weakTopicText = weakTopics.length
    ? weakTopics
        .map((item) => `${item.concept}${item.score ? ` (${item.score})` : ""}`)
        .join(", ")
    : "none yet";

  const payload = {
    query: `This learner is practising ${topic}. What weak areas, repeated mistakes, strengths, or question preferences should a quiz generator know? Recent weak topics: ${weakTopicText}`,
    version: "v2",
    top_k: 6,
    threshold: 0.1,
    filters: {
      OR: [
        {
          AND: [{ user_id: userId }, { app_id: MEM0_APP_ID }]
        },
        {
          user_id: userId
        }
      ]
    }
  };

  try {
    const data = await mem0Request("/v2/memories/search", payload);
    const memories = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    return {
      usedMem0: true,
      memories
    };
  } catch (error) {
    console.error("Mem0 search error:", error.message);
    return {
      usedMem0: false,
      memories: []
    };
  }
}

async function addMem0QuizMemory({ userId, topic, messages, metadata = {} }) {
  if (!MEM0_API_KEY || !userId) {
    return {
      usedMem0: false,
      stored: false
    };
  }

  const payload = {
    user_id: userId,
    app_id: MEM0_APP_ID,
    messages,
    metadata: {
      topic,
      ...metadata
    },
    async_mode: true,
    output_format: "v1.1",
    infer: true,
    custom_instructions:
      "Store only useful long-term study patterns, weak concepts, strong concepts, and quiz preferences. Ignore temporary UI details."
  };

  try {
    await mem0Request("/v1/memories", payload);

    return {
      usedMem0: true,
      stored: true
    };
  } catch (error) {
    console.error("Mem0 add error:", error.message);
    return {
      usedMem0: false,
      stored: false
    };
  }
}

function buildConceptTargets(
  blueprint,
  weakTopics = [],
  requestedAmount = 12,
  focusMode = "balanced"
) {
  const baseConcepts = shuffleArray(blueprint.concepts || []);
  const weakConcepts = weakTopics
    .map((item) => cleanText(item?.concept))
    .filter(Boolean);

  let combined = [...baseConcepts];

  if (focusMode === "weak" && weakConcepts.length) {
    combined = shuffleArray([...weakConcepts, ...baseConcepts]);
  }

  if (focusMode === "random") {
    combined = shuffleArray([...baseConcepts, ...weakConcepts]);
  }

  return dedupeTextList(combined).slice(0, requestedAmount);
}

function buildMemorySummary(memories = []) {
  if (!memories.length) return "";

  return memories
    .slice(0, 6)
    .map((item, index) => `${index + 1}. ${cleanText(item.memory)}`)
    .join("\n");
}

async function generateQuizBatch({
  topic,
  batchCount,
  existingQuestions = [],
  weakTopics = [],
  memorySummary = "",
  focusMode = "balanced",
  batchIndex = 0
}) {
  const blueprint = COURSE_BLUEPRINTS[topic] || COURSE_BLUEPRINTS.economics;

  const conceptTargets = buildConceptTargets(
    blueprint,
    weakTopics,
    Math.max(batchCount, 10),
    focusMode
  );

  const avoidStems = existingQuestions
    .slice(-25)
    .map((question) => `- ${question.question}`)
    .join("\n");

  const weakTopicText = weakTopics.length
    ? weakTopics
        .map((item) => `${item.concept}${item.score ? ` (${item.score})` : ""}`)
        .join(", ")
    : "none";

  const userPrompt = `
Create EXACTLY ${batchCount} unique multiple-choice questions for ${blueprint.displayName}.

Audience:
${blueprint.audience}

Course framing:
${blueprint.systemContext}

Target concepts for this batch:
${conceptTargets.join(", ")}

Weak areas from recent practice:
${weakTopicText}

Memory summary from previous sessions:
${memorySummary || "none"}

Quiz mode:
${focusMode}

Avoid repeating or lightly paraphrasing these previous question stems:
${avoidStems || "none"}

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "English question",
      "questionZh": "简短中文翻译",
      "options": [
        { "key": "A", "text": "option A" },
        { "key": "B", "text": "option B" },
        { "key": "C", "text": "option C" },
        { "key": "D", "text": "option D" }
      ],
      "correctAnswer": "A",
      "explanation": "short English explanation",
      "explanationZh": "简短中文解释",
      "concept": "short concept label",
      "difficulty": "easy"
    }
  ]
}

Rules:
1. EXACTLY ${batchCount} questions.
2. EXACTLY 4 options per question.
3. EXACTLY one correct answer.
4. Use only A, B, C, D.
5. Difficulty must be only easy, medium, or hard.
6. Make the options plausible.
7. Include a good mix of direct concept questions and short applied questions.
8. For statistics, include method-choice and interpretation questions where appropriate.
9. For accounting and finance, include a balanced mix of financial statement interpretation, costing, budgeting, variance logic, time value of money, NPV/IRR/payback/PI decisions, and financing questions.
10. Keep the English natural and student-friendly.
11. Keep the Chinese concise.
12. Never include markdown fences or commentary.
13. This is batch ${batchIndex + 1}, so make it feel fresh and non-repetitive.
`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: focusMode === "random" ? 1 : 0.85,
    messages: [
      {
        role: "system",
        content:
          "You are a strict JSON-only quiz generator. Never include markdown fences. Never include commentary before or after JSON."
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  const rawText = completion.choices?.[0]?.message?.content || "";
  const jsonText = extractJsonPayload(rawText);
  const parsed = JSON.parse(jsonText);
  const rawQuestions = Array.isArray(parsed?.questions) ? parsed.questions : [];

  return rawQuestions.map((question, index) =>
    normalizeQuestion(question, index, topic)
  );
}

async function generateAdaptiveQuiz({
  topic = "economics",
  count = 10,
  userId = "",
  weakTopics = [],
  focusMode = "balanced"
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing on the server.");
  }

  const safeTopic = cleanText(topic).toLowerCase() || "economics";
  const blueprint = COURSE_BLUEPRINTS[safeTopic] || COURSE_BLUEPRINTS.economics;
  const safeCount = clampQuizCount(count);

  const mem0Context = await searchMem0Context({
    userId,
    topic: safeTopic,
    weakTopics
  });

  const memorySummary = buildMemorySummary(mem0Context.memories);

  let questions = [];
  let attempts = 0;
  const maxAttempts = Math.max(6, Math.ceil(safeCount / 10) + 5);

  while (questions.length < safeCount && attempts < maxAttempts) {
    const remaining = safeCount - questions.length;
    const batchCount = Math.min(DEFAULT_BATCH_SIZE, remaining);

    const batch = await generateQuizBatch({
      topic: safeTopic,
      batchCount,
      existingQuestions: questions,
      weakTopics,
      memorySummary,
      focusMode,
      batchIndex: attempts
    });

    questions = dedupeQuestions([...questions, ...batch]);
    attempts += 1;
  }

  if (!questions.length) {
    throw new Error("Quiz generation returned no questions.");
  }

  const finalQuestions = shuffleArray(questions).slice(0, safeCount);

  return {
    questions: finalQuestions,
    personalization: {
      usedMem0: mem0Context.usedMem0,
      mem0MemoriesUsed: mem0Context.memories.length,
      usedLocalWeakTopics: Array.isArray(weakTopics) && weakTopics.length > 0,
      weakTopicsApplied: weakTopics.map((item) => item.concept),
      topic: blueprint.displayName
    }
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mem0Enabled: Boolean(MEM0_API_KEY),
    appId: MEM0_APP_ID
  });
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const {
      topic = "economics",
      count = 10,
      userId = "",
      weakTopics = [],
      focusMode = "balanced"
    } = req.body || {};

    const result = await generateAdaptiveQuiz({
      topic,
      count,
      userId,
      weakTopics,
      focusMode
    });

    res.json(result);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({
      error: "Failed to generate quiz.",
      detail: error.message
    });
  }
});

app.post("/api/quiz-memory", async (req, res) => {
  try {
    const {
      userId = "",
      topic = "economics",
      attempts = [],
      score = 0,
      total = 0,
      focusMode = "balanced"
    } = req.body || {};

    if (!userId || !Array.isArray(attempts) || attempts.length === 0) {
      return res.json({
        ok: true,
        usedMem0: false,
        stored: false
      });
    }

    const summary = summarizeConceptPerformance(attempts);

    const userSummary = [
      `Quiz session in ${topic}.`,
      `Score: ${score}/${total}.`,
      summary.weakAreas.length
        ? `Weak areas: ${summary.weakAreas.join(", ")}.`
        : "No repeated weak areas in this session.",
      summary.strongAreas.length
        ? `Strong areas: ${summary.strongAreas.join(", ")}.`
        : "No fully consistent strength area identified yet.",
      `Focus mode used: ${focusMode}.`
    ].join(" ");

    const assistantSummary = summary.weakAreas.length
      ? `Understood. In future quizzes, I should reinforce these weaker concepts first while still mixing in other topics for spaced revision: ${summary.weakAreas.join(", ")}.`
      : "Understood. Future quizzes can gradually raise difficulty and keep variety high.";

    const result = await addMem0QuizMemory({
      userId,
      topic,
      messages: [
        {
          role: "user",
          content: userSummary
        },
        {
          role: "assistant",
          content: assistantSummary
        }
      ],
      metadata: {
        type: "quiz_session",
        topic,
        score,
        total,
        focusMode
      }
    });

    res.json({
      ok: true,
      usedMem0: result.usedMem0,
      stored: result.stored
    });
  } catch (error) {
    console.error("Quiz memory error:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to save quiz memory.",
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Study Hub server running on port ${PORT}`);
});