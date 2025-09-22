// ==== Password Generator (Build Page) ====

function generatePassword() {
  const lengthSlider = document.querySelector("#length");
  const lengthValue = document.querySelector("#length-value");
  const upper = document.querySelector("#uppercase");
  const lower = document.querySelector("#lowercase");
  const numbers = document.querySelector("#numbers");
  const symbols = document.querySelector("#symbols");
  const output = document.querySelector("#password-output");

  const length = parseInt(lengthSlider?.value || 12);

  let chars = "";
  if (upper?.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower?.checked) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers?.checked) chars += "0123456789";
  if (symbols?.checked) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?/";

  if (!chars) {
    output.value = "⚠ Select at least one option";
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  output.value = password;
}

// Update slider value
const lengthSlider = document.querySelector("#length");
if (lengthSlider) {
  lengthSlider.addEventListener("input", (e) => {
    document.querySelector("#length-value").textContent = e.target.value;
  });
}

// Bind generate button
const generateBtn = document.querySelector("#generate-btn");
if (generateBtn) {
  generateBtn.addEventListener("click", generatePassword);
}
