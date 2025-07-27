// script.js

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("username");
  const imageInput = document.getElementById("imageUpload");
  const startButton = document.getElementById("startGameBtn");

  function validateInputs() {
    const name = nameInput.value.trim();
    const image = imageInput.files.length > 0;
    const validName = name.endsWith(".SIGN");

    if (validName && image) {
      startButton.disabled = false;
      startButton.classList.add("active");
    } else {
      startButton.disabled = true;
      startButton.classList.remove("active");
    }
  }

  nameInput.addEventListener("input", validateInputs);
  imageInput.addEventListener("change", validateInputs);

  startButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const imageFile = imageInput.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("playerImage", e.target.result);
      localStorage.setItem("playerName", name);
      window.location.href = "game.html";
    };
    reader.readAsDataURL(imageFile);
  });
});
