let currentQuiz = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let questionLocked = false;
let currentAttempts = [];
let quizSessionSaved = false;

const LOCAL_USER_KEY = "studyhub_user_id";
const LOCAL_WEAK_TOPICS_PREFIX = "studyhub_weak_topics_";

function getCurrentTopic() {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("statistics")) return "statistics";
  if (path.includes("accounting")) return "accounting";
  if (path.includes("finance")) return "accounting";

  return "economics";
}

const CURRENT_TOPIC = getCurrentTopic();

function getOrCreateUserId() {
  let userId = localStorage.getItem(LOCAL_USER_KEY);

  if (!userId) {
    userId =
      "user_" +
      Math.random().toString(36).slice(2) +
      "_" +
      Date.now().toString(36);
    localStorage.setItem(LOCAL_USER_KEY, userId);
  }

  return userId;
}

function getWeakTopicsStorageKey(topic) {
  return `${LOCAL_WEAK_TOPICS_PREFIX}${topic}`;
}

function getLocalWeakTopics(topic) {
  try {
    const raw = localStorage.getItem(getWeakTopicsStorageKey(topic));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object" && item.concept)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 8);
  } catch (error) {
    console.error("Failed to read local weak topics:", error);
    return [];
  }
}

function updateLocalWeakTopic(topic, concept, isCorrect) {
  if (!concept) return;

  try {
    const key = getWeakTopicsStorageKey(topic);
    const current = getLocalWeakTopics(topic);
    const map = {};

    current.forEach((item) => {
      map[item.concept] = {
        concept: item.concept,
        score: Number(item.score || 0)
      };
    });

    if (!map[concept]) {
      map[concept] = { concept, score: 0 };
    }

    if (isCorrect) {
      map[concept].score = Math.max(0, map[concept].score - 1);
    } else {
      map[concept].score += 1;
    }

    const next = Object.values(map)
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    localStorage.setItem(key, JSON.stringify(next));
  } catch (error) {
    console.error("Failed to update local weak topics:", error);
  }
}

function getSelectedQuizCount() {
  const countSelect = document.getElementById("quizCount");
  const value = countSelect ? parseInt(countSelect.value, 10) : 10;

  if (!Number.isFinite(value)) return 10;
  return value;
}

function getSelectedFocusMode() {
  const modeSelect = document.getElementById("focusMode");
  return modeSelect ? modeSelect.value : "balanced";
}

function goToCourse(course) {
  const target = String(course || "").toLowerCase();

  if (target === "economics" || target === "econ") {
    window.location.href = "economics.html";
    return;
  }

  if (
    target === "statistics" ||
    target === "stats" ||
    target === "statistic"
  ) {
    window.location.href = "statistics.html";
    return;
  }

  if (
    target === "finance" ||
    target === "accounting" ||
    target === "fin" ||
    target === "acc"
  ) {
    window.location.href = "accounting.html";
    return;
  }

  if (target === "ucl" || target === "other" || target === "others") {
    window.location.href = "accounting.html";
    return;
  }

  alert("Course page not ready yet.");
}

function getEconomicsKeywordMap() {
  return {
    gdp: "economics.html#week1-gdp",
    climate: "economics.html#week1-gdp",
    temperature: "economics.html#week1-gdp",
    "气候": "economics.html#week1-gdp",
    "温度": "economics.html#week1-gdp",

    cash: "economics.html#week2-cash",
    money: "economics.html#week2-cash",
    bank: "economics.html#week2-cash",
    wellbeing: "economics.html#week2-cash",
    "well-being": "economics.html#week2-cash",
    "货币": "economics.html#week2-cash",
    "银行": "economics.html#week2-cash",

    supply: "economics.html#week3-supply",
    demand: "economics.html#week3-supply",
    equilibrium: "economics.html#week3-supply",
    elasticity: "economics.html#week3-supply",
    "供给": "economics.html#week3-supply",
    "需求": "economics.html#week3-supply",
    "均衡": "economics.html#week3-supply",

    inflation: "economics.html#week4-inflation",
    unemployment: "economics.html#week4-unemployment",
    cpi: "economics.html#week4-inflation",
    "通胀": "economics.html#week4-inflation",
    "失业": "economics.html#week4-unemployment",

    labour: "economics.html#week5-labour",
    labor: "economics.html#week5-labour",
    wage: "economics.html#week5-labour",
    "employment rent": "economics.html#week5-labour",
    "reservation wage": "economics.html#week5-labour",
    "劳动": "economics.html#week5-labour",
    "工资": "economics.html#week5-labour",

    inequality: "economics.html#week6-inequality",
    gini: "economics.html#week6-inequality",
    lorenz: "economics.html#week6-inequality",
    "不平等": "economics.html#week6-inequality",
    "基尼": "economics.html#week6-inequality",

    game: "economics.html#week7-game",
    nash: "economics.html#week7-game",
    prisoners: "economics.html#week7-game",
    "prisoner's dilemma": "economics.html#week7-game",
    "博弈": "economics.html#week7-game",
    "纳什": "economics.html#week7-game",

    monopoly: "economics.html#week8-monopoly",
    oligopoly: "economics.html#week8-monopoly",
    "market failure": "economics.html#week8-monopoly",
    "垄断": "economics.html#week8-monopoly",
    "寡头": "economics.html#week8-monopoly",

    commons: "economics.html#week9-commons",
    ostrom: "economics.html#week9-commons",
    governance: "economics.html#week9-commons",
    "free riding": "economics.html#week9-commons",
    "公地": "economics.html#week9-commons",
    "治理": "economics.html#week9-commons",

    revision: "economics.html#week10-revision",
    review: "economics.html#week10-revision",
    "mock exam": "economics.html#week10-revision",
    "复习": "economics.html#week10-revision"
  };
}

function getStatisticsKeywordMap() {
  return {
    sampling: "statistics.html#week1-sampling",
    sample: "statistics.html#week1-sampling",
    population: "statistics.html#week1-sampling",
    mean: "statistics.html#week1-sampling",
    median: "statistics.html#week1-sampling",
    percentile: "statistics.html#week1-sampling",
    "standard deviation": "statistics.html#week1-sampling",
    "standard error": "statistics.html#week1-sampling",
    "confidence interval": "statistics.html#week1-sampling",
    "抽样": "statistics.html#week1-sampling",
    "样本": "statistics.html#week1-sampling",
    "总体": "statistics.html#week1-sampling",
    "均值": "statistics.html#week1-sampling",
    "中位数": "statistics.html#week1-sampling",

    correlation: "statistics.html#week2-correlation",
    regression: "statistics.html#week2-correlation",
    scatter: "statistics.html#week2-correlation",
    prediction: "statistics.html#week2-correlation",
    "r squared": "statistics.html#week2-correlation",
    r2: "statistics.html#week2-correlation",
    "相关": "statistics.html#week2-correlation",
    "回归": "statistics.html#week2-correlation",
    "预测": "statistics.html#week2-correlation",

    inference: "statistics.html#week3-inference",
    hypothesis: "statistics.html#week3-inference",
    "hypothesis testing": "statistics.html#week3-inference",
    "p-value": "statistics.html#week3-inference",
    significance: "statistics.html#week3-inference",
    "null hypothesis": "statistics.html#week3-inference",
    "统计推断": "statistics.html#week3-inference",
    "假设检验": "statistics.html#week3-inference",
    "显著性": "statistics.html#week3-inference",
    p值: "statistics.html#week3-inference",

    causality: "statistics.html#week4-causality",
    causation: "statistics.html#week4-causality",
    confounding: "statistics.html#week4-causality",
    confounder: "statistics.html#week4-causality",
    experiment: "statistics.html#week4-causality",
    rct: "statistics.html#week4-causality",
    "reverse causality": "statistics.html#week4-causality",
    "difference-in-differences": "statistics.html#week4-causality",
    "因果": "statistics.html#week4-causality",
    "混杂": "statistics.html#week4-causality",
    "随机对照试验": "statistics.html#week4-causality",
    "实验": "statistics.html#week4-causality",

    residuals: "statistics.html#week5-residuals",
    residual: "statistics.html#week5-residuals",
    transform: "statistics.html#week5-residuals",
    transformation: "statistics.html#week5-residuals",
    interaction: "statistics.html#week5-residuals",
    heteroskedasticity: "statistics.html#week5-residuals",
    nonlinear: "statistics.html#week5-residuals",
    "残差": "statistics.html#week5-residuals",
    "变量变换": "statistics.html#week5-residuals",
    "交互项": "statistics.html#week5-residuals",

    logistic: "statistics.html#week6-logistic",
    "logistic regression": "statistics.html#week6-logistic",
    binary: "statistics.html#week6-logistic",
    odds: "statistics.html#week6-logistic",
    "odds ratio": "statistics.html#week6-logistic",
    "risk ratio": "statistics.html#week6-logistic",
    probability: "statistics.html#week6-logistic",
    "逻辑回归": "statistics.html#week6-logistic",
    "二分类": "statistics.html#week6-logistic",
    "比值比": "statistics.html#week6-logistic",
    "概率": "statistics.html#week6-logistic",

    survival: "statistics.html#week7-survival",
    censoring: "statistics.html#week7-survival",
    "time to event": "statistics.html#week7-survival",
    "discrete survival": "statistics.html#week7-survival",
    relapse: "statistics.html#week7-survival",
    "生存分析": "statistics.html#week7-survival",
    "删失": "statistics.html#week7-survival",
    "事件发生时间": "statistics.html#week7-survival",

    visualisation: "statistics.html#week8-visualisation",
    visualization: "statistics.html#week8-visualisation",
    tableau: "statistics.html#week8-visualisation",
    dashboard: "statistics.html#week8-visualisation",
    histogram: "statistics.html#week8-visualisation",
    "box plot": "statistics.html#week8-visualisation",
    "line chart": "statistics.html#week8-visualisation",
    dimension: "statistics.html#week8-visualisation",
    measure: "statistics.html#week8-visualisation",
    "数据可视化": "statistics.html#week8-visualisation",
    "图表": "statistics.html#week8-visualisation",

    "data science": "statistics.html#week9-datascience",
    workflow: "statistics.html#week9-datascience",
    insight: "statistics.html#week9-datascience",
    prediction: "statistics.html#week9-datascience",
    prescription: "statistics.html#week9-datascience",
    "train test": "statistics.html#week9-datascience",
    "no-show": "statistics.html#week9-datascience",
    "数据科学": "statistics.html#week9-datascience",
    "工作流": "statistics.html#week9-datascience",

    "machine learning": "statistics.html#week10-ml",
    "decision tree": "statistics.html#week10-ml",
    "decision trees": "statistics.html#week10-ml",
    "random forest": "statistics.html#week10-ml",
    overfitting: "statistics.html#week10-ml",
    interpretability: "statistics.html#week10-ml",
    leakage: "statistics.html#week10-ml",
    "机器学习": "statistics.html#week10-ml",
    "决策树": "statistics.html#week10-ml",
    "过拟合": "statistics.html#week10-ml",
    "可解释性": "statistics.html#week10-ml"
  };
}

function getAccountingKeywordMap() {
  return {
    business: "accounting.html#week1-foundations",
    firm: "accounting.html#week1-foundations",
    shareholder: "accounting.html#week1-foundations",
    board: "accounting.html#week1-foundations",
    manager: "accounting.html#week1-foundations",
    "financial accounting": "accounting.html#week1-foundations",
    "management accounting": "accounting.html#week1-foundations",
    healthcare: "accounting.html#week1-foundations",
    "企业": "accounting.html#week1-foundations",
    "股东": "accounting.html#week1-foundations",
    "董事会": "accounting.html#week1-foundations",
    "管理会计": "accounting.html#week1-foundations",
    "财务会计": "accounting.html#week1-foundations",

    "balance sheet": "accounting.html#week2-statements",
    "income statement": "accounting.html#week2-statements",
    "statement of financial position": "accounting.html#week2-statements",
    assets: "accounting.html#week2-statements",
    liabilities: "accounting.html#week2-statements",
    equity: "accounting.html#week2-statements",
    revenue: "accounting.html#week2-statements",
    expense: "accounting.html#week2-statements",
    profit: "accounting.html#week2-statements",
    depreciation: "accounting.html#week2-statements",
    "资产负债表": "accounting.html#week2-statements",
    "利润表": "accounting.html#week2-statements",
    "资产": "accounting.html#week2-statements",
    "负债": "accounting.html#week2-statements",
    "权益": "accounting.html#week2-statements",
    "折旧": "accounting.html#week2-statements",

    "cash flow": "accounting.html#week3-cashflow",
    "cash flows": "accounting.html#week3-cashflow",
    liquidity: "accounting.html#week3-cashflow",
    ratio: "accounting.html#week3-cashflow",
    ratios: "accounting.html#week3-cashflow",
    roce: "accounting.html#week3-cashflow",
    margin: "accounting.html#week3-cashflow",
    turnover: "accounting.html#week3-cashflow",
    "operating activities": "accounting.html#week3-cashflow",
    "investing activities": "accounting.html#week3-cashflow",
    "financing activities": "accounting.html#week3-cashflow",
    "现金流": "accounting.html#week3-cashflow",
    "现金流量表": "accounting.html#week3-cashflow",
    "流动性": "accounting.html#week3-cashflow",
    "比率": "accounting.html#week3-cashflow",
    "周转": "accounting.html#week3-cashflow",

    costing: "accounting.html#week4-costing",
    cost: "accounting.html#week4-costing",
    "fixed cost": "accounting.html#week4-costing",
    "variable cost": "accounting.html#week4-costing",
    contribution: "accounting.html#week4-costing",
    breakeven: "accounting.html#week4-costing",
    "break-even": "accounting.html#week4-costing",
    "margin of safety": "accounting.html#week4-costing",
    "固定成本": "accounting.html#week4-costing",
    "变动成本": "accounting.html#week4-costing",
    "贡献边际": "accounting.html#week4-costing",
    "盈亏平衡": "accounting.html#week4-costing",

    budget: "accounting.html#week5-budgeting",
    budgeting: "accounting.html#week5-budgeting",
    variance: "accounting.html#week5-budgeting",
    forecast: "accounting.html#week5-budgeting",
    "flexible budget": "accounting.html#week5-budgeting",
    "master budget": "accounting.html#week5-budgeting",
    labour: "accounting.html#week5-budgeting",
    labor: "accounting.html#week5-budgeting",
    material: "accounting.html#week5-budgeting",
    "预算": "accounting.html#week5-budgeting",
    "差异": "accounting.html#week5-budgeting",
    "弹性预算": "accounting.html#week5-budgeting",
    "总预算": "accounting.html#week5-budgeting",

    timeline: "accounting.html#week6-tvm",
    "time value": "accounting.html#week6-tvm",
    tvm: "accounting.html#week6-tvm",
    pv: "accounting.html#week6-tvm",
    fv: "accounting.html#week6-tvm",
    perpetuity: "accounting.html#week6-tvm",
    annuity: "accounting.html#week6-tvm",
    discounting: "accounting.html#week6-tvm",
    compounding: "accounting.html#week6-tvm",
    "时间价值": "accounting.html#week6-tvm",
    "现值": "accounting.html#week6-tvm",
    "终值": "accounting.html#week6-tvm",
    "永续年金": "accounting.html#week6-tvm",
    "年金": "accounting.html#week6-tvm",
    "贴现": "accounting.html#week6-tvm",
    "复利": "accounting.html#week6-tvm",

    npv: "accounting.html#week7-investment",
    irr: "accounting.html#week7-investment",
    payback: "accounting.html#week7-investment",
    pi: "accounting.html#week7-investment",
    "profitability index": "accounting.html#week7-investment",
    investment: "accounting.html#week7-investment",
    investments: "accounting.html#week7-investment",
    "mutually exclusive": "accounting.html#week7-investment",
    "capital constraint": "accounting.html#week7-investment",
    "资源约束": "accounting.html#week7-investment",
    "投资": "accounting.html#week7-investment",
    "净现值": "accounting.html#week7-investment",
    "内部收益率": "accounting.html#week7-investment",
    "回收期": "accounting.html#week7-investment",
    "盈利指数": "accounting.html#week7-investment",

    sensitivity: "accounting.html#week8-risk",
    scenario: "accounting.html#week8-risk",
    risk: "accounting.html#week8-risk",
    "capital structure": "accounting.html#week8-risk",
    debt: "accounting.html#week8-risk",
    "trade-off theory": "accounting.html#week8-risk",
    mm: "accounting.html#week8-risk",
    "敏感性分析": "accounting.html#week8-risk",
    "情景分析": "accounting.html#week8-risk",
    "资本结构": "accounting.html#week8-risk",
    "债务": "accounting.html#week8-risk",
    "风险": "accounting.html#week8-risk",

    ipo: "accounting.html#week9-financing",
    "private placing": "accounting.html#week9-financing",
    "rights issue": "accounting.html#week9-financing",
    bond: "accounting.html#week9-financing",
    bonds: "accounting.html#week9-financing",
    loan: "accounting.html#week9-financing",
    loans: "accounting.html#week9-financing",
    wacc: "accounting.html#week9-financing",
    "venture capital": "accounting.html#week9-financing",
    crowdfunding: "accounting.html#week9-financing",
    financing: "accounting.html#week9-financing",
    finance: "accounting.html#week9-financing",
    "股权": "accounting.html#week9-financing",
    "债券": "accounting.html#week9-financing",
    "借款": "accounting.html#week9-financing",
    "融资": "accounting.html#week9-financing",
    "配股": "accounting.html#week9-financing",

    revision: "accounting.html#week10-revision",
    review: "accounting.html#week10-revision",
    consolidation: "accounting.html#week10-revision",
    presentation: "accounting.html#week10-revision",
    "复习": "accounting.html#week10-revision",
    "整合": "accounting.html#week10-revision",
    "展示": "accounting.html#week10-revision"
  };
}

function searchCourse() {
  const input = document.getElementById("search");
  if (!input) return;

  const query = input.value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a subject or keyword.");
    return;
  }

  if (
    query.includes("economics") ||
    query.includes("econ") ||
    query.includes("经济")
  ) {
    window.location.href = "economics.html";
    return;
  }

  if (
    query.includes("statistics") ||
    query.includes("stats") ||
    query.includes("statistic") ||
    query.includes("统计")
  ) {
    window.location.href = "statistics.html";
    return;
  }

  if (
    query.includes("finance") ||
    query.includes("accounting") ||
    query.includes("fin") ||
    query.includes("acc") ||
    query.includes("金融") ||
    query.includes("会计")
  ) {
    window.location.href = "accounting.html";
    return;
  }

  const accountingMap = getAccountingKeywordMap();
  for (const key in accountingMap) {
    if (query.includes(key)) {
      window.location.href = accountingMap[key];
      return;
    }
  }

  const statisticsMap = getStatisticsKeywordMap();
  for (const key in statisticsMap) {
    if (query.includes(key)) {
      window.location.href = statisticsMap[key];
      return;
    }
  }

  const economicsMap = getEconomicsKeywordMap();
  for (const key in economicsMap) {
    if (query.includes(key)) {
      window.location.href = economicsMap[key];
      return;
    }
  }

  alert("No matching subject or keyword found yet.");
}

function showMainSection(sectionId, btn) {
  const weeklySection = document.getElementById("weeklySection");
  const practiceSection = document.getElementById("practiceSection");
  const targetSection = document.getElementById(sectionId);

  if (weeklySection) weeklySection.style.display = "none";
  if (practiceSection) practiceSection.style.display = "none";
  if (targetSection) targetSection.style.display = "block";

  const navBtns = document.querySelectorAll(".course-nav-btn");
  navBtns.forEach((button) => button.classList.remove("active-nav"));

  if (btn) {
    btn.classList.add("active-nav");
  }
}

function showWeek(weekId, btn) {
  const allWeeks = document.querySelectorAll(".week-panel");

  allWeeks.forEach((week) => {
    week.style.display = "none";
  });

  const targetWeek = document.getElementById(weekId);
  if (targetWeek) {
    targetWeek.style.display = "block";
  }

  const weekBtns = document.querySelectorAll(".week-chip");
  weekBtns.forEach((button) => button.classList.remove("active-week"));

  if (btn) {
    btn.classList.add("active-week");
  }
}

async function startQuiz() {
  const quizContainer = document.getElementById("quizContainer");
  const quizMeta = document.getElementById("quizMeta");

  if (!quizContainer || !quizMeta) return;

  const selectedCount = getSelectedQuizCount();
  const selectedMode = getSelectedFocusMode();
  const userId = getOrCreateUserId();
  const weakTopics = getLocalWeakTopics(CURRENT_TOPIC);

  quizContainer.innerHTML = `
    <div class="quiz-loading-card">
      <div class="quiz-loading-spinner"></div>
      <p>Generating your ${selectedCount}-question quiz...</p>
      <p>正在生成 ${selectedCount} 道练习题...</p>
    </div>
  `;

  quizMeta.innerText = "Generating quiz...";

  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: CURRENT_TOPIC,
        count: selectedCount,
        focusMode: selectedMode,
        userId,
        weakTopics
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data.questions ||
      !Array.isArray(data.questions) ||
      data.questions.length === 0
    ) {
      throw new Error("Invalid quiz response");
    }

    currentQuiz = data.questions;
    currentQuestionIndex = 0;
    currentScore = 0;
    questionLocked = false;
    currentAttempts = [];
    quizSessionSaved = false;

    renderQuestion();
  } catch (error) {
    console.error("Quiz generation failed:", error);

    quizContainer.innerHTML = `
      <div class="quiz-error-card">
        <p>Failed to generate quiz.</p>
        <p>生成题目失败。</p>
      </div>
    `;

    quizMeta.innerText = "Quiz generation failed";
  }
}

function renderQuestion() {
  const quizContainer = document.getElementById("quizContainer");
  const quizMeta = document.getElementById("quizMeta");

  if (!quizContainer || !quizMeta || !currentQuiz.length) return;

  if (currentQuestionIndex >= currentQuiz.length) {
    quizContainer.innerHTML = `
      <div class="quiz-result-card">
        <div class="result-ring">${currentScore}/${currentQuiz.length}</div>
        <h3>Quiz Complete</h3>
        <p>You answered ${currentScore} out of ${currentQuiz.length} correctly.</p>
        <p>你答对了 ${currentScore} / ${currentQuiz.length} 题。</p>
        <button class="next-btn" onclick="startQuiz()">Try Another Quiz</button>
      </div>
    `;

    quizMeta.innerText = `Finished · Score ${currentScore}/${currentQuiz.length}`;

    if (!quizSessionSaved) {
      quizSessionSaved = true;
      saveQuizMemory();
    }

    return;
  }

  const q = currentQuiz[currentQuestionIndex];
  questionLocked = false;

  quizMeta.innerText = `Question ${currentQuestionIndex + 1} of ${currentQuiz.length} · Score ${currentScore}`;

  const optionsHtml = (q.options || [])
    .map((option) => {
      return `
        <button class="option-btn" onclick="selectAnswer('${option.key}')">
          <span class="option-key">${option.key}</span>
          <span class="option-text">${option.text}</span>
        </button>
      `;
    })
    .join("");

  quizContainer.innerHTML = `
    <div class="quiz-question-card">
      <div class="quiz-progress">Q${currentQuestionIndex + 1} / ${currentQuiz.length}</div>

      <h3 class="quiz-question-title">${q.question || ""}</h3>
      <p class="quiz-question-zh">${q.questionZh || ""}</p>

      <div class="quiz-tag-row">
        <span class="quiz-mini-tag">${q.concept || CURRENT_TOPIC}</span>
        <span class="quiz-mini-tag">${q.difficulty || "medium"}</span>
      </div>

      <div class="quiz-options" id="quizOptions">
        ${optionsHtml}
      </div>

      <div class="quiz-feedback-row">
        <div id="feedbackText" class="feedback-text">Choose one option · 请选择一个答案</div>
        <div id="feedbackBadge" class="feedback-badge neutral-badge">…</div>
      </div>

      <div id="explanationBox" class="explanation-box" style="display:none;"></div>

      <div class="quiz-actions">
        <button id="nextBtn" class="next-btn" style="display:none;" onclick="goNextQuestion()">Next Question</button>
      </div>
    </div>
  `;
}

function selectAnswer(selectedKey) {
  if (questionLocked) return;

  const q = currentQuiz[currentQuestionIndex];
  if (!q) return;

  questionLocked = true;

  const correctKey = q.correctAnswer;
  const optionButtons = document.querySelectorAll(".option-btn");
  const feedbackText = document.getElementById("feedbackText");
  const feedbackBadge = document.getElementById("feedbackBadge");
  const explanationBox = document.getElementById("explanationBox");
  const nextBtn = document.getElementById("nextBtn");

  optionButtons.forEach((button) => {
    button.disabled = true;

    const keyElement = button.querySelector(".option-key");
    const key = keyElement ? keyElement.innerText.trim() : "";

    if (key === correctKey) {
      button.classList.add("correct-option");
    }

    if (key === selectedKey && key !== correctKey) {
      button.classList.add("wrong-option");
    }
  });

  const isCorrect = selectedKey === correctKey;

  currentAttempts.push({
    concept: q.concept || CURRENT_TOPIC,
    isCorrect
  });

  updateLocalWeakTopic(CURRENT_TOPIC, q.concept || CURRENT_TOPIC, isCorrect);

  if (isCorrect) {
    currentScore += 1;

    if (feedbackText) feedbackText.innerText = "Correct · 答对了";
    if (feedbackBadge) {
      feedbackBadge.innerText = "✓";
      feedbackBadge.className = "feedback-badge correct-badge";
    }
  } else {
    if (feedbackText) {
      feedbackText.innerText = `Incorrect · 正确答案是 ${correctKey}`;
    }
    if (feedbackBadge) {
      feedbackBadge.innerText = "✕";
      feedbackBadge.className = "feedback-badge wrong-badge";
    }
  }

  if (explanationBox) {
    explanationBox.style.display = "block";
    explanationBox.innerHTML = `
      <strong>Explanation:</strong> ${q.explanation || ""}
      <br><br>
      <strong>中文解释：</strong>${q.explanationZh || ""}
    `;
  }

  if (nextBtn) {
    nextBtn.style.display = "inline-block";
  }
}

function goNextQuestion() {
  currentQuestionIndex += 1;
  renderQuestion();
}

async function saveQuizMemory() {
  try {
    if (!currentAttempts.length) return;

    const userId = getOrCreateUserId();
    const focusMode = getSelectedFocusMode();

    await fetch("/api/quiz-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        topic: CURRENT_TOPIC,
        attempts: currentAttempts,
        score: currentScore,
        total: currentQuiz.length,
        focusMode
      })
    });
  } catch (error) {
    console.error("Failed to save quiz memory:", error);
  }
}

function getHashWeekMapByTopic() {
  if (CURRENT_TOPIC === "statistics") {
    return {
      "#week1-sampling": "week1",
      "#week2-correlation": "week2",
      "#week3-inference": "week3",
      "#week4-causality": "week4",
      "#week5-residuals": "week5",
      "#week6-logistic": "week6",
      "#week7-survival": "week7",
      "#week8-visualisation": "week8",
      "#week9-datascience": "week9",
      "#week10-ml": "week10"
    };
  }

  if (CURRENT_TOPIC === "accounting") {
    return {
      "#week1-foundations": "week1",
      "#week2-statements": "week2",
      "#week3-cashflow": "week3",
      "#week4-costing": "week4",
      "#week5-budgeting": "week5",
      "#week6-tvm": "week6",
      "#week7-investment": "week7",
      "#week8-risk": "week8",
      "#week9-financing": "week9",
      "#week10-revision": "week10"
    };
  }

  return {
    "#week1-gdp": "week1",
    "#week2-cash": "week2",
    "#week3-supply": "week3",
    "#week4-inflation": "week4",
    "#week4-unemployment": "week4",
    "#week5-labour": "week5",
    "#week6-inequality": "week6",
    "#week7-game": "week7",
    "#week8-monopoly": "week8",
    "#week9-commons": "week9",
    "#week10-revision": "week10"
  };
}

function initHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  const map = getHashWeekMapByTopic();
  const targetWeek = map[hash];

  if (!targetWeek) return;

  const weeklySection = document.getElementById("weeklySection");
  const practiceSection = document.getElementById("practiceSection");

  if (weeklySection) weeklySection.style.display = "block";
  if (practiceSection) practiceSection.style.display = "none";

  const navBtns = document.querySelectorAll(".course-nav-btn");
  navBtns.forEach((button) => button.classList.remove("active-nav"));
  if (navBtns[0]) navBtns[0].classList.add("active-nav");

  const allWeeks = document.querySelectorAll(".week-panel");
  allWeeks.forEach((week) => {
    week.style.display = "none";
  });

  const targetWeekPanel = document.getElementById(targetWeek);
  if (targetWeekPanel) {
    targetWeekPanel.style.display = "block";
  }

  const weekBtns = document.querySelectorAll(".week-chip");
  weekBtns.forEach((button) => button.classList.remove("active-week"));

  const weekIndexMap = {
    week1: 0,
    week2: 1,
    week3: 2,
    week4: 3,
    week5: 4,
    week6: 5,
    week7: 6,
    week8: 7,
    week9: 8,
    week10: 9
  };

  const btnIndex = weekIndexMap[targetWeek];
  if (typeof btnIndex === "number" && weekBtns[btnIndex]) {
    weekBtns[btnIndex].classList.add("active-week");
  }

  setTimeout(() => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, 250);
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");

  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchCourse();
      }
    });
  }

  initHashNavigation();
});

window.searchCourse = searchCourse;
window.goToCourse = goToCourse;
window.showMainSection = showMainSection;
window.showWeek = showWeek;
window.startQuiz = startQuiz;
window.goNextQuestion = goNextQuestion;
window.selectAnswer = selectAnswer;