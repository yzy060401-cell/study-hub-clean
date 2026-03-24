import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 托管静态前端文件
app.use(express.static(__dirname));

// 首页返回 index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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

// 稳定 10 题 economics 题库
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
    question: "In a competitive equilibrium, who are price takers?",
    questionZh: "在竞争均衡中，谁是价格接受者？",
    options: [
      { key: "A", text: "Only buyers" },
      { key: "B", text: "Only sellers" },
      { key: "C", text: "Both buyers and sellers" },
      { key: "D", text: "Only the largest firms" }
    ],
    correctAnswer: "C",
    explanation: "In competitive markets, both buyers and sellers take the market price as given.",
    explanationZh: "在竞争市场中，买方和卖方都把市场价格视为既定。"
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
    explanationZh: "通货膨胀指的是整个经济中的总体价格水平上升。"
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
    explanation: "Reservation wage is the minimum wage at which a person is willing to accept a job.",
    explanationZh: "保留工资是一个人愿意接受某份工作的最低工资。"
  },
  {
    question: "Employment rent is best defined as:",
    questionZh: "就业租最准确的定义是：",
    options: [
      { key: "A", text: "The tax paid on labour income" },
      { key: "B", text: "The extra value of keeping a job compared with the next best option" },
      { key: "C", text: "The cost of training a worker" },
      { key: "D", text: "The total wage bill of a firm" }
    ],
    correctAnswer: "B",
    explanation: "Employment rent is the difference between the value of having the job and the value of the next best alternative.",
    explanationZh: "就业租是拥有当前工作与次优选择之间价值差额。"
  },
  {
    question: "Which measure is commonly used to summarise inequality?",
    questionZh: "哪一个指标常用于概括不平等程度？",
    options: [
      { key: "A", text: "Phillips curve" },
      { key: "B", text: "GDP deflator" },
      { key: "C", text: "Gini coefficient" },
      { key: "D", text: "Marginal revenue" }
    ],
    correctAnswer: "C",
    explanation: "The Gini coefficient is a common summary measure of inequality.",
    explanationZh: "基尼系数是概括不平等程度的常见指标。"
  },
  {
    question: "A Nash equilibrium is a situation where:",
    questionZh: "纳什均衡是指哪种情况？",
    options: [
      { key: "A", text: "Everyone gets the same payoff" },
      { key: "B", text: "Each player chooses the best response given others’ choices" },
      { key: "C", text: "Everyone cooperates" },
      { key: "D", text: "There is always a dominant strategy" }
    ],
    correctAnswer: "B",
    explanation: "In Nash equilibrium, no player can do better by changing strategy alone.",
    explanationZh: "在纳什均衡中，任何玩家都不能通过单方面改变策略而获得更好结果。"
  },
  {
    question: "Why can monopoly create deadweight loss?",
    questionZh: "为什么垄断会造成无谓损失？",
    options: [
      { key: "A", text: "Because monopolists always sell too much" },
      { key: "B", text: "Because monopolists restrict output below the efficient level" },
      { key: "C", text: "Because monopolists eliminate all costs" },
      { key: "D", text: "Because demand disappears in monopoly" }
    ],
    correctAnswer: "B",
    explanation: "Monopoly restricts output, so some beneficial trades do not take place.",
    explanationZh: "垄断会限制产量，因此一些本可实现的互利交易不会发生。"
  },
  {
    question: "Which type of good is rival but non-excludable?",
    questionZh: "哪一种物品具有竞争性但不可排他？",
    options: [
      { key: "A", text: "Private good" },
      { key: "B", text: "Club good" },
      { key: "C", text: "Public good" },
      { key: "D", text: "Common good" }
    ],
    correctAnswer: "D",
    explanation: "Common goods are rival in use but difficult to exclude others from consuming.",
    explanationZh: "公地物品具有竞争性，但很难把他人排除在使用之外。"
  },
  {
    question: "Which statement best describes free-riding?",
    questionZh: "哪一句最能描述搭便车？",
    options: [
      { key: "A", text: "Paying more than others for a public benefit" },
      { key: "B", text: "Benefiting from collective effort without contributing fairly" },
      { key: "C", text: "Working overtime voluntarily" },
      { key: "D", text: "Paying a congestion charge" }
    ],
    correctAnswer: "B",
    explanation: "Free-riding means enjoying benefits without paying a fair share of the cost.",
    explanationZh: "搭便车指享受集体收益，却没有承担公平的成本。"
  },
  {
    question: "What is the main difference between CPI and GDP deflator?",
    questionZh: "CPI 与 GDP 平减指数的主要区别是什么？",
    options: [
      { key: "A", text: "They always use exactly the same basket" },
      { key: "B", text: "CPI tracks consumer purchases, GDP deflator tracks domestic production" },
      { key: "C", text: "GDP deflator only tracks imports" },
      { key: "D", text: "CPI only tracks investment goods" }
    ],
    correctAnswer: "B",
    explanation: "CPI focuses on consumer purchases, while GDP deflator focuses on domestically produced output.",
    explanationZh: "CPI 关注消费者购买篮子，GDP 平减指数关注国内生产总产出。"
  },
  {
    question: "What does the Lorenz curve show?",
    questionZh: "洛伦兹曲线展示什么？",
    options: [
      { key: "A", text: "The relationship between unemployment and inflation" },
      { key: "B", text: "The cumulative distribution of income or wealth" },
      { key: "C", text: "The demand for labour" },
      { key: "D", text: "The total cost of production" }
    ],
    correctAnswer: "B",
    explanation: "The Lorenz curve shows how income or wealth is cumulatively distributed across the population.",
    explanationZh: "洛伦兹曲线展示收入或财富在人口中的累计分布情况。"
  }
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const questions = shuffle(questionBank).slice(0, 10);
    res.json({ questions });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});