// builder.js
(function () {
  const lengthInput = document.getElementById('length');
  const lengthVal = document.getElementById('lengthVal');
  const incLower = document.getElementById('incLower');
  const incUpper = document.getElementById('incUpper');
  const incNums = document.getElementById('incNums');
  const incSymbols = document.getElementById('incSymbols');
  const generateBtn = document.getElementById('generateBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const copyGenBtn = document.getElementById('copyGenBtn');
  const generatedBox = document.getElementById('generatedBox');
  const useInChecker = document.getElementById('useInChecker');

  const SETS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    nums: '0123456789',
    symbols: "!@#$%^&*()-_=+[]{};:,.<>?/`~|'"
  };

  function updateLengthDisplay() {
    lengthVal.textContent = lengthInput.value;
  }
  lengthInput.addEventListener('input', updateLengthDisplay);
  updateLengthDisplay();

  function shuffleString(s) {
    const a = s.split('');
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join('');
  }

  function generatePassword(length, opts) {
    let pool = '';
    if (opts.lower) pool += SETS.lower;
    if (opts.upper) pool += SETS.upper;
    if (opts.nums) pool += SETS.nums;
    if (opts.symbols) pool += SETS.symbols;
    if (!pool) return '';

    // use crypto for randomness
    const cryptoVals = new Uint32Array(length);
    window.crypto.getRandomValues(cryptoVals);
    let pw = '';
    for (let i = 0; i < length; i++) {
      pw += pool.charAt(cryptoVals[i] % pool.length);
    }

    // ensure at least one of each selected type
    const guaranteed = [];
    if (opts.lower) guaranteed.push(SETS.lower[Math.floor(Math.random()*SETS.lower.length)]);
    if (opts.upper) guaranteed.push(SETS.upper[Math.floor(Math.random()*SETS.upper.length)]);
    if (opts.nums) guaranteed.push(SETS.nums[Math.floor(Math.random()*SETS.nums.length)]);
    if (opts.symbols) guaranteed.push(SETS.symbols[Math.floor(Math.random()*SETS.symbols.length)]);
    // insert guaranteed chars
    for (let i = 0; i < guaranteed.length && i < pw.length; i++) {
      const pos = Math.floor(Math.random() * pw.length);
      pw = pw.substring(0, pos) + guaranteed[i] + pw.substring(pos + 1);
    }

    // final shuffle
    pw = shuffleString(pw);
    return pw;
  }

  function setGenerated(pw) {
    generatedBox.value = pw;
  }

  generateBtn.addEventListener('click', () => {
    const opts = { lower: incLower.checked, upper: incUpper.checked, nums: incNums.checked, symbols: incSymbols.checked };
    const len = Number(lengthInput.value);
    const pw = generatePassword(len, opts);
    setGenerated(pw);
  });

  regenerateBtn.addEventListener('click', () => generateBtn.click());

  copyGenBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generatedBox.value || '');
      copyGenBtn.textContent = 'Copied';
      setTimeout(()=> copyGenBtn.textContent = 'Copy', 1200);
    } catch (err) {
      // fallback
      generatedBox.select();
      document.execCommand('copy');
      copyGenBtn.textContent = 'Copied';
      setTimeout(()=> copyGenBtn.textContent = 'Copy', 1200);
    }
  });

  // open checker and pass password via query param
  useInChecker.addEventListener('click', () => {
    const pw = encodeURIComponent(generatedBox.value || '');
    if (!pw) {
      alert('Generate a password first.');
      return;
    }
    // open check.html with ?pw=...
    window.location.href = `check.html?pw=${pw}`;
  });

  // generate an initial default password
  generateBtn.click();
})();
