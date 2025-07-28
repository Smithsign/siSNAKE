document.addEventListener("DOMContentLoaded", function() {
  const playerNameInput = document.getElementById("playerName");
  const playerImageInput = document.getElementById("playerImage");
  const uploadArea = document.getElementById("uploadArea");
  const imagePreview = document.getElementById("imagePreview");
  const startGameBtn = document.getElementById("startGameBtn");
  const uploadText = document.getElementById("uploadText");

  // Validate name input
  playerNameInput.addEventListener("input", function() {
    const isValid = this.value.endsWith(".SIGN");
    this.classList.toggle("invalid", !isValid && this.value.length > 0);
    updateStartButton();
  });

  // Handle image upload
  playerImageInput.addEventListener("change", function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(event) {
        imagePreview.style.backgroundImage = `url(${event.target.result})`;
        uploadText.style.display = "none";
        localStorage.setItem("playerImage", event.target.result);
        updateStartButton();
      }
      
      reader.readAsDataURL(file);
    }
  });

  // Drag and drop functionality
  uploadArea.addEventListener("dragover", function(e) {
    e.preventDefault();
    this.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", function() {
    this.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", function(e) {
    e.preventDefault();
    this.classList.remove("dragover");
    playerImageInput.files = e.dataTransfer.files;
    const event = new Event("change");
    playerImageInput.dispatchEvent(event);
  });

  // Start game button
  startGameBtn.addEventListener("click", function() {
    localStorage.setItem("playerName", playerNameInput.value);
    window.location.href = "game.html";
  });

  function updateStartButton() {
    const nameValid = playerNameInput.value.endsWith(".SIGN");
    const hasImage = playerImageInput.files.length > 0;
    startGameBtn.disabled = !(nameValid && hasImage);
  }
});
