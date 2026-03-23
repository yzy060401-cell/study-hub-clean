function searchCourse() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim().toLowerCase();

  // ===== 课程名直达 =====
  if (query === "economics" || query === "econ") {
    window.location.href = "economics.html";
    return;
  }

  if (query === "statistics" || query === "stats" || query === "stat") {
    window.location.href = "statistics.html";
    return;
  }

  if (
    query === "finance" ||
    query === "accounting" ||
    query === "finance and accounting"
  ) {
    window.location.href = "accounting.html";
    return;
  }

  // ===== economics 关键词导航词典 =====
  const keywordRoutes = [
    {
      keywords: [
        "opportunity cost",
        "gdp",
        "wellbeing",
        "well-being",
        "climate change",
        "temperature anomaly",
        "correlation",
        "causation",
        "co2"
      ],
      target: "economics.html#week1-gdp"
    },
    {
      keywords: [
        "cash",
        "cache",
        "money",
        "bank",
        "loan",
        "private money",
        "common money",
        "economic model",
        "aurea",
        "pyrgus",
        "difference-in-differences",
        "rct"
      ],
      target: "economics.html#week2-cash"
    },
    {
      keywords: [
        "supply",
        "demand",
        "equilibrium",
        "elasticity",
        "shock",
        "exogenous",
        "endogenous",
        "simultaneity",
        "watermelon"
      ],
      target: "economics.html#week3-supply"
    },
    {
      keywords: [
        "inflation",
        "cpi",
        "gdp deflator"
      ],
      target: "economics.html#week4-inflation"
    },
    {
      keywords: [
        "unemployment",
        "life satisfaction",
        "well-being cost",
        "disutility"
      ],
      target: "economics.html#week4-unemployment"
    },
    {
      keywords: [
        "labour",
        "labor",
        "reservation wage",
        "employment rent",
        "firm",
        "profit maximisation",
        "principal-agent",
        "wages"
      ],
      target: "economics.html#week5-labour"
    },
    {
      keywords: [
        "inequality",
        "gini",
        "lorenz",
        "wealth",
        "income inequality",
        "redistribution",
        "predistribution"
      ],
      target: "economics.html#week6-inequality"
    },
    {
      keywords: [
        "nash",
        "game theory",
        "prisoners",
        "prisoner's dilemma",
        "dominant strategy",
        "pareto"
      ],
      target: "economics.html#week7-game"
    },
    {
      keywords: [
        "monopoly",
        "deadweight loss",
        "market failure",
        "oligopoly",
        "bertrand",
        "cournot",
        "perfect competition",
        "monopolistic competition"
      ],
      target: "economics.html#week8-monopoly"
    },
    {
      keywords: [
        "commons",
        "ostrom",
        "free riding",
        "free-riding",
        "public goods",
        "common goods",
        "club goods",
        "wtp",
        "cost-benefit analysis",
        "cba",
        "tax and markets"
      ],
      target: "economics.html#week9-commons"
    },
    {
      keywords: [
        "revision",
        "mock",
        "exam",
        "recap"
      ],
      target: "economics.html#week10-revision"
    }
  ];

  for (const route of keywordRoutes) {
    for (const keyword of route.keywords) {
      if (query.includes(keyword)) {
        window.location.href = route.target;
        return;
      }
    }
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