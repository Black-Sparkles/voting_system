async function submitVote(option) {
  await fetch("/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option }),
  });
  fetchResults();
}

async function fetchResults() {
  const response = await fetch("/results");
  const data = await response.json();
  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";
  Object.keys(data).forEach((key) => {
    const li = document.createElement("li");
    li.textContent = `${key}: ${data[key]} votes`;
    resultsList.appendChild(li);
  });
}

// Fetch initial results every 2 seconds
setInterval(fetchResults, 2000);
fetchResults();


// async function submitVote(option) {
//   await fetch("http://localhost:3000/vote", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ option }),
//   });
//   fetchResults();
// }

// async function fetchResults() {
//   const response = await fetch("http://localhost:3000/results");
//   const data = await response.json();
//   const resultsList = document.getElementById("resultsList");
//   resultsList.innerHTML = "";
//   Object.keys(data).forEach((key) => {
//     const li = document.createElement("li");
//     li.textContent = `${key}: ${data[key]} votes`;
//     resultsList.appendChild(li);
//   });
// }

// setInterval(fetchResults, 2000);
// fetchResults();
