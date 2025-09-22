// ==== Password Strength Checker (Check Page) ====

function checkStrength(password) {
  let score = 0;

  if (!password) return { score: 0, label: "Empty" };

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Weak";
  if (score >= 4 && password.length >= 12) {
    label = "Strong";
  } else if (score >= 3) {
    label = "Medium";
  }

  return { score, label };
}

// Bind checker input
const checkerInput = document.querySelector("#password-input");
if (checkerInput) {
  checkerInput.addEventListener("input", (e) => {
    const { score, label } = checkStrength(e.target.value);
    const bar = document.querySelector("#strength-bar");
    const text = document.querySelector("#strength-text");

    const widths = ["w-1/6", "w-2/6", "w-3/6", "w-4/6", "w-5/6", "w-full"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

    // Reset
    bar.className = "h-3 rounded transition-all duration-300";

    // Apply new style
    bar.classList.add(
      widths[Math.min(score, widths.length - 1)],
      colors[Math.min(score, colors.length - 1)]
    );

    text.textContent = `Strength: ${label}`;
  });
}
