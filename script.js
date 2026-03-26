let currentQuiz = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let questionLocked = false;

function getCurrentTopic() {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("statistics")) return "statistics";
  if (path.includes("accounting")) return "accounting";
  if (path.includes("finance")) return "accounting";
  return "economics";
}

const CURRENT_TOPIC = getCurrentTopic();

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

  const economicsMap = {
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
        focusMode: selectedMode
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("Invalid quiz response");
    }

    currentQuiz = data.questions;
    currentQuestionIndex = 0;
    currentScore = 0;
    questionLocked = false;

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

  if (selectedKey === correctKey) {
    currentScore += 1;

    if (feedbackText) feedbackText.innerText = "Correct · 答对了";
    if (feedbackBadge) {
      feedbackBadge.innerText = "✓";
      feedbackBadge.className = "feedback-badge correct-badge";
    }
  } else {
    if (feedbackText) feedbackText.innerText = `Incorrect · 正确答案是 ${correctKey}`;
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

function initHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  const map = {
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
window.showMainSection = showMainSection;
window.showWeek = showWeek;
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.goNextQuestion = goNextQuestion;