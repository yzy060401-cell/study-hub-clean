import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 解决 ES module 下没有 __dirname 的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ 托管静态文件（你的 html / css / js）
app.use(express.static(__dirname));

// ✅ 首页强制返回 index.html（关键！！）
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= AI接口 =================

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    res.json({
      answer: "This endpoint is kept for future expansion."
    });
  } catch (error) {
    console.error("ASK-AI ERROR:", error);
    res.status(500).json({ error: "Failed to answer question." });
  }
});

// ================= 题库 =================

const questionBank = [
  {
    question: "Which statement best describes opportunity cost?",
    questionZh: "下列哪项最能描述机会成本？",
    options: [
      { key: "A", text: "The money actually spent on a choice" },
      { key: "B", text: "The value of the next best alternative given up" },
      { key: "C", text: "The firm's accounting profit" },
      { key: "D", text: "A fixed production cost" }
    ],
    correctAnswer: "B",
    explanation: "Opportunity cost is the value of the next best alternative that is forgone.",
    explanationZh: "机会成本是做出某项选择时所放弃的次优选择的价值。"
  },
  {
    question: "What is inflation?",
    questionZh: "什么是通货膨胀？",
    options: [
      { key: "A", text: "A fall in unemployment only" },
      { key: "B", text: "A general rise in the price level" },
      { key: "C", text: "A fall in GDP only" },
      { key: "D", text: "A rise in exports only" }
    ],
    correctAnswer: "B",
    explanation: "Inflation refers to a general increase in prices across the economy.",
    explanationZh: "通货膨胀指的是总体价格水平上升。"
  },
  {
    question: "What is the reservation wage?",
    questionZh: "什么是保留工资？",
    options: [
      { key: "A", text: "The legal minimum wage" },
      { key: "B", text: "The average wage in a sector" },
      { key: "C", text: "The minimum wage a worker is willing to accept" },
      { key: "D", text: "The wage a firm wants to pay" }
    ],
    correctAnswer: "C",
    explanation: "Reservation wage is the minimum wage a worker accepts.",
    explanationZh: "保留工资是劳动者愿意接受的最低工资。"
  }
];

// 打乱顺序
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 生成题目接口
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const questions = shuffle(questionBank).slice(0, 10);
    res.json({ questions });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// ================= 启动 =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});