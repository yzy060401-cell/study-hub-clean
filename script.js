function normalizeQuery(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[&/,+()\-]/g, " ")
    .replace(/\s+/g, " ");
}

function includesAny(query, keywords) {
  return keywords.some(keyword => query.includes(keyword));
}

function searchCourse() {
  const searchInput = document.getElementById("search");
  const rawQuery = searchInput ? searchInput.value : "";
  const query = normalizeQuery(rawQuery);

  if (!query) {
    window.location.href = "courses.html";
    return;
  }

  // ===== 课程直达 =====
  if (includesAny(query, ["economics", "econ"])) {
    window.location.href = "economics.html";
    return;
  }

  if (includesAny(query, ["statistics", "stats", "stat"])) {
    window.location.href = "statistics.html";
    return;
  }

  if (
    includesAny(query, [
      "finance and accounting",
      "finance accounting",
      "finance",
      "accounting",
      "fa"
    ])
  ) {
    window.location.href = "accounting.html";
    return;
  }

  // ===== Economics 智能关键词跳转 =====
  const economicsRoutes = [
    {
      target: "economics.html#week1-gdp",
      keywords: [
        "week 1",
        "w1",
        "gdp",
        "gross domestic product",
        "wellbeing",
        "well being",
        "climate",
        "climate change",
        "temperature",
        "temperature anomaly",
        "co2",
        "carbon dioxide",
        "correlation",
        "causation",
        "spurious correlation",
        "opportunity cost",
        "distribution shift"
      ]
    },
    {
      target: "economics.html#week2-cash",
      keywords: [
        "week 2",
        "w2",
        "cash",
        "cache",
        "money",
        "bank",
        "banks",
        "loan",
        "loans",
        "bank loan",
        "private money",
        "common money",
        "public money",
        "money creation",
        "create money",
        "created money",
        "difference in differences",
        "difference in dif",
        "diff in diff",
        "did",
        "rct",
        "randomised controlled trial",
        "randomized controlled trial",
        "natural experiment",
        "aurea",
        "pyrgus",
        "economic model",
        "economic models",
        "england model",
        "externalities and wellbeing"
      ]
    },
    {
      target: "economics.html#week3-supply",
      keywords: [
        "week 3",
        "w3",
        "supply",
        "demand",
        "supply demand",
        "equilibrium",
        "elasticity",
        "price elasticity",
        "shock",
        "shocks",
        "exogenous",
        "endogenous",
        "simultaneity",
        "watermelon",
        "watermelons",
        "log",
        "logs",
        "natural log",
        "ln",
        "dummy variable",
        "confidence interval demand supply",
        "identify demand curve",
        "identify supply curve"
      ]
    },
    {
      target: "economics.html#week4-inflation",
      keywords: [
        "week 4",
        "w4",
        "inflation",
        "cpi",
        "gdp deflator",
        "phillips curve",
        "aggregate demand",
        "ad curve",
        "deflation",
        "disinflation",
        "price level",
        "negative demand shock",
        "fiscal policy",
        "monetary policy",
        "interest rate",
        "bank of england"
      ]
    },
    {
      target: "economics.html#week4-unemployment",
      keywords: [
        "unemployment",
        "life satisfaction",
        "well being cost",
        "wellbeing cost",
        "non monetary cost",
        "non monetary costs",
        "disutility",
        "evs",
        "european values study",
        "employment status",
        "subjective wellbeing",
        "subjective well being",
        "stigma",
        "social norm unemployment"
      ]
    },
    {
      target: "economics.html#week5-labour",
      keywords: [
        "week 5",
        "w5",
        "labour",
        "labor",
        "labour market",
        "labor market",
        "firm",
        "firms",
        "reservation wage",
        "employment rent",
        "principal agent",
        "principal-agent",
        "profit maximisation",
        "profit maximization",
        "wages",
        "real wage",
        "labour productivity",
        "labor productivity",
        "cost structure",
        "marginal cost",
        "average cost",
        "fixed cost",
        "variable cost",
        "economies of scale",
        "management practice",
        "management score"
      ]
    },
    {
      target: "economics.html#week6-inequality",
      keywords: [
        "week 6",
        "w6",
        "inequality",
        "income inequality",
        "wealth inequality",
        "gini",
        "gini coefficient",
        "lorenz",
        "lorenz curve",
        "redistribution",
        "predistribution",
        "categorical inequality",
        "intergenerational inequality",
        "wealth share",
        "top 1",
        "disposable income",
        "fairness inequality"
      ]
    },
    {
      target: "economics.html#week7-game",
      keywords: [
        "week 7",
        "w7",
        "game theory",
        "nash",
        "nash equilibrium",
        "dominant strategy",
        "mixed strategy",
        "best response",
        "payoff matrix",
        "prisoners dilemma",
        "prisoner's dilemma",
        "prisoners' dilemma",
        "pareto",
        "pareto efficient",
        "pareto inefficiency",
        "chicken game",
        "stag hunt",
        "hawk dove",
        "dove",
        "hawk"
      ]
    },
    {
      target: "economics.html#week8-monopoly",
      keywords: [
        "week 8",
        "w8",
        "monopoly",
        "perfect competition",
        "oligopoly",
        "bertrand",
        "cournot",
        "monopolistic competition",
        "market failure",
        "deadweight loss",
        "dwl",
        "consumer surplus",
        "producer surplus",
        "market structure",
        "price taker",
        "price maker",
        "free riding market failure",
        "asymmetric information",
        "public goods market failure"
      ]
    },
    {
      target: "economics.html#week9-commons",
      keywords: [
        "week 9",
        "w9",
        "commons",
        "common goods",
        "common good",
        "public goods",
        "public good",
        "club goods",
        "club good",
        "private goods",
        "private good",
        "tragedy of the commons",
        "ostrom",
        "free riding",
        "free-riding",
        "free rider",
        "wtp",
        "willingness to pay",
        "cost benefit analysis",
        "cba",
        "economic evaluation",
        "tax and markets",
        "currency",
        "graeber",
        "alanya",
        "fishery",
        "fisheries",
        "commons governance"
      ]
    },
    {
      target: "economics.html#week10-revision",
      keywords: [
        "week 10",
        "w10",
        "revision",
        "revise",
        "recap",
        "mock",
        "mock exam",
        "exam",
        "final exam",
        "revision strategy",
        "high frequency topics"
      ]
    }
  ];

  // 优先找“最相关”的 route：哪个匹配关键词数量最多
  let bestRoute = null;
  let bestScore = 0;

  for (const route of economicsRoutes) {
    let score = 0;
    for (const keyword of route.keywords) {
      if (query.includes(keyword)) {
        score += keyword.length > 8 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestRoute = route;
    }
  }

  if (bestRoute) {
    window.location.href = bestRoute.target;
    return;
  }

  // ===== 兜底：部分模糊词默认进 economics =====
  if (
    includesAny(query, [
      "gdp",
      "inflation",
      "unemployment",
      "wage",
      "wages",
      "inequality",
      "nash",
      "monopoly",
      "commons",
      "ostrom",
      "supply",
      "demand",
      "labour",
      "labor",
      "money",
      "bank"
    ])
  ) {
    window.location.href = "economics.html";
    return;
  }

  // ===== 默认去 Browse 页面 =====
  window.location.href = "courses.html";
}

// 回车直接搜索
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchCourse();
      }
    });
  }
});