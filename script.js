// script.js
document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("playerName");
  const imageInput = document.getElementById("playerImage");
  const startBtn = document.getElementById("startBtn");

  function validate() {
    const name = nameInput.value.trim();
    const valid = name.toUpperCase().endsWith(".SIGN") && imageInput.files.length > 0;
    startBtn.disabled = !valid;
  }

  nameInput.addEventListener("input", validate);
  imageInput.addEventListener("change", validate);

  startBtn.addEventListener("click", () => {
    const reader = new FileReader();
    reader.onload = e => {
      localStorage.setItem("playerName", nameInput.value.trim());
      localStorage.setItem("playerImage", e.target.result);
      window.location.href = "game.html";
    };
    reader.readAsDataURL(imageInput.files[0]);
  });
});
