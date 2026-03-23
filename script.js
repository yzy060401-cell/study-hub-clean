function searchCourse() {
  const input = document.getElementById("search");
  const query = input.value.trim().toLowerCase();

  if (query.includes("economics")) {
    window.location.href = "economics.html";
    return;
  }

  if (query.includes("statistics") || query.includes("stats")) {
    window.location.href = "statistics.html";
    return;
  }

  if (query.includes("finance") || query.includes("accounting")) {
    window.location.href = "accounting.html";
    return;
  }

  window.location.href = "courses.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search");

  if (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchCourse();
      }
    });
  }
});