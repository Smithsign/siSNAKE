fetch("get_leaderboard.php")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("leaderboardList");
    container.innerHTML = "";
    data.forEach((user, i) => {
      const entry = document.createElement("div");
      entry.className = "entry";
      entry.innerHTML = `
        <img src="${user.image}" alt="avatar" />
        <span>${i + 1}. ${user.name}</span>
        <span>${user.score}</span>
      `;
      container.appendChild(entry);
    });
  });
