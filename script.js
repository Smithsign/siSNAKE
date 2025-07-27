// script.js

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("playerName");
  const imageInput = document.getElementById("playerImage");
  const startButton = document.getElementById("startBtn");
  const warningText = document.getElementById("warningText"); // Optional: warning message element

  // Function to validate inputs
  function validateInputs() {
    const name = nameInput.value.trim();
    const hasImage = imageInput.files.length > 0;
    const validName = name.endsWith(".SIGN");

    if (validName && hasImage) {
      startButton.disabled = false;
      startButton.classList.add("active");
      warningText.style.display = "none"; // Hide warning
    } else {
      startButton.disabled = true;
      startButton.classList.remove("active");
      warningText.style.display = "block"; // Show warning
    }
  }

  // Input listeners
  nameInput.addEventListener("input", validateInputs);
  imageInput.addEventListener("change", validateInputs);

  // Start game
  startButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!name.endsWith(".SIGN") || !imageFile) {
      warningText.style.display = "block";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerImage", e.target.result);
      window.location.href = "game.html";
    };
    reader.readAsDataURL(imageFile);
  });
});
