function searchCourse() {
  const input = document.getElementById("search");
  if (!input) return;

  const query = input.value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a subject or keyword.");
    return;
  }

  // ===== 课程直接跳转 =====
  if (query.includes("economics") || query.includes("econ") || query.includes("经济")) {
    window.location.href = "economics.html";
    return;
  }

  if (
    query.includes("statistics") ||
    query.includes("stats") ||
    query.includes("regression") ||
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
    query.includes("会计") ||
    query.includes("金融")
  ) {
    window.location.href = "accounting.html";
    return;
  }

  // ===== Economics 关键词跳转 =====
  const economicsMap = {
    "gdp": "economics.html#week1-gdp",
    "climate": "economics.html#week1-gdp",
    "temperature": "economics.html#week1-gdp",
    "co2": "economics.html#week1-gdp",
    "correlation": "economics.html#week1-gdp",
    "causation": "economics.html#week1-gdp",
    "气候": "economics.html#week1-gdp",
    "温度": "economics.html#week1-gdp",
    "相关性": "economics.html#week1-gdp",
    "因果": "economics.html#week1-gdp",

    "cash": "economics.html#week2-cash",
    "money": "economics.html#week2-cash",
    "bank": "economics.html#week2-cash",
    "well-being": "economics.html#week2-cash",
    "wellbeing": "economics.html#week2-cash",
    "productivity": "economics.html#week2-cash",
    "externalities": "economics.html#week2-cash",
    "货币": "economics.html#week2-cash",
    "银行": "economics.html#week2-cash",
    "幸福感": "economics.html#week2-cash",
    "外部性": "economics.html#week2-cash",

    "supply": "economics.html#week3-supply",
    "demand": "economics.html#week3-supply",
    "equilibrium": "economics.html#week3-supply",
    "elasticity": "economics.html#week3-supply",
    "log": "economics.html#week3-supply",
    "供给": "economics.html#week3-supply",
    "需求": "economics.html#week3-supply",
    "均衡": "economics.html#week3-supply",
    "弹性": "economics.html#week3-supply",

    "inflation": "economics.html#week4-inflation",
    "unemployment": "economics.html#week4-unemployment",
    "cpi": "economics.html#week4-inflation",
    "phillips": "economics.html#week4-unemployment",
    "gdp deflator": "economics.html#week4-inflation",
    "life satisfaction": "economics.html#week4-unemployment",
    "通胀": "economics.html#week4-inflation",
    "失业": "economics.html#week4-unemployment",
    "菲利普斯": "economics.html#week4-unemployment",
    "价格指数": "economics.html#week4-inflation",

    "labour": "economics.html#week5-labour",
    "labor": "economics.html#week5-labour",
    "wage": "economics.html#week5-labour",
    "employment rent": "economics.html#week5-labour",
    "reservation wage": "economics.html#week5-labour",
    "principal-agent": "economics.html#week5-labour",
    "productivity": "economics.html#week5-labour",
    "劳动": "economics.html#week5-labour",
    "工资": "economics.html#week5-labour",
    "就业租": "economics.html#week5-labour",
    "保留工资": "economics.html#week5-labour",

    "inequality": "economics.html#week6-inequality",
    "gini": "economics.html#week6-inequality",
    "lorenz": "economics.html#week6-inequality",
    "redistribution": "economics.html#week6-inequality",
    "wealth inequality": "economics.html#week6-inequality",
    "income inequality": "economics.html#week6-inequality",
    "不平等": "economics.html#week6-inequality",
    "基尼": "economics.html#week6-inequality",
    "洛伦兹": "economics.html#week6-inequality",
    "再分配": "economics.html#week6-inequality",

    "game": "economics.html#week7-game",
    "nash": "economics.html#week7-game",
    "prisoners": "economics.html#week7-game",
    "prisoner's dilemma": "economics.html#week7-game",
    "dominant strategy": "economics.html#week7-game",
    "pareto": "economics.html#week7-game",
    "博弈": "economics.html#week7-game",
    "纳什": "economics.html#week7-game",
    "囚徒困境": "economics.html#week7-game",
    "帕累托": "economics.html#week7-game",

    "monopoly": "economics.html#week8-monopoly",
    "market failure": "economics.html#week8-monopoly",
    "oligopoly": "economics.html#week8-monopoly",
    "perfect competition": "economics.html#week8-monopoly",
    "deadweight loss": "economics.html#week8-monopoly",
    "asymmetric information": "economics.html#week8-monopoly",
    "垄断": "economics.html#week8-monopoly",
    "市场失灵": "economics.html#week8-monopoly",
    "寡头": "economics.html#week8-monopoly",
    "无谓损失": "economics.html#week8-monopoly",

    "commons": "economics.html#week9-commons",
    "ostrom": "economics.html#week9-commons",
    "governance": "economics.html#week9-commons",
    "free riding": "economics.html#week9-commons",
    "wtp": "economics.html#week9-commons",
    "cost-benefit": "economics.html#week9-commons",
    "externalities": "economics.html#week9-commons",
    "公地": "economics.html#week9-commons",
    "治理": "economics.html#week9-commons",
    "搭便车": "economics.html#week9-commons",
    "成本收益": "economics.html#week9-commons",

    "revision": "economics.html#week10-revision",
    "mock exam": "economics.html#week10-revision",
    "review": "economics.html#week10-revision",
    "复习": "economics.html#week10-revision",
    "模拟题": "economics.html#week10-revision"
  };

  for (const key in economicsMap) {
    if (query.includes(key)) {
      window.location.href = economicsMap[key];
      return;
    }
  }

  alert("No matching subject or keyword found yet.");
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
});