function generatePassword() {
  const length = parseInt(document.querySelector("#length").value);
  document.querySelector("#length-value").textContent = length;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?/";

  let chars = "";
  if (document.querySelector("#uppercase").checked) chars += upper;
  if (document.querySelector("#lowercase").checked) chars += lower;
  if (document.querySelector("#numbers").checked) chars += nums;
  if (document.querySelector("#symbols").checked) chars += syms;

  const output = document.querySelector("#password-output");

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

// Events
document.querySelector("#generate-btn").addEventListener("click", generatePassword);
document.querySelector("#length").addEventListener("input", e => {
  document.querySelector("#length-value").textContent = e.target.value;
});

// Copy button
document.querySelector("#copy-btn").addEventListener("click", () => {
  const output = document.querySelector("#password-output");
  output.select();
  document.execCommand("copy");
  alert("Password copied!");
});
