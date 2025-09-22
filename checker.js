// checker.js
(function () {
  const passwordInput = document.getElementById('password');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const entropyText = document.getElementById('entropyText');
  const crackEstimate = document.getElementById('crackEstimate');
  const toggleBtn = document.getElementById('toggleVisibility');
  const copyBtn = document.getElementById('copyBtn');
  const criteriaItems = document.querySelectorAll('#criteriaList [data-rule]');
  const commonWarn = document.getElementById('commonWarn');

  const COMMON_PASSWORDS = ['password','123456','12345678','qwerty','abc123','letmein','111111','123123','admin','welcome','iloveyou'];

  function hasUpper(s) { return /[A-Z]/.test(s); }
  function hasLower(s) { return /[a-z]/.test(s); }
  function hasNumber(s) { return /[0-9]/.test(s); }
  function hasSpecial(s) { return /[^A-Za-z0-9]/.test(s); }

  function containsCommon(pass) {
    const low = pass.toLowerCase();
    for (const c of COMMON_PASSWORDS) if (low.includes(c)) return true;
    return false;
  }

  function detectSequential(s) {
    if (!s) return false;
    const seqLen = 3;
    for (let i = 0; i <= s.length - seqLen; i++) {
      const a = s.charCodeAt(i);
      const b = s.charCodeAt(i+1);
      const c = s.charCodeAt(i+2);
      if (b - a === 1 && c - b === 1) return true;
      if (a - b === 1 && b - c === 1) return true;
    }
    return false;
  }

  function detectRepetition(s) {
    if (!s) return false;
    for (let i = 0; i <= s.length - 4; i++) {
      if (s[i] === s[i+1] && s[i] === s[i+2] && s[i] === s[i+3]) return true;
    }
    return false;
  }

  function estimateEntropy(pass) {
    if (!pass) return 0;
    let pool = 0;
    if (hasLower(pass)) pool += 26;
    if (hasUpper(pass)) pool += 26;
    if (hasNumber(pass)) pool += 10;
    if (hasSpecial(pass)) pool += 32;
    if (pool === 0) pool = Math.min(94, new Set(pass).size || 1);
    const entropyBits = pass.length * Math.log2(pool || 1);
    return Math.round(entropyBits * 100) / 100;
  }

  function humanTime(seconds) {
    if (!isFinite(seconds) || seconds > 1e15) return 'centuries';
    const units = [ ['years', 60*60*24*365], ['days', 60*60*24], ['hours', 60*60], ['minutes',60], ['seconds',1] ];
    for (const [name, secs] of units) {
      if (seconds >= secs) {
        const v = Math.floor(seconds / secs);
        return `${v} ${name}`;
      }
    }
    return 'less than a second';
  }

  function estimateCrackTime(entropyBits) {
    const guesses = Math.pow(2, Math.min(entropyBits, 1024));
    const onlineSpeed = 100; // guesses/sec
    const offlineSpeed = 1e10; // guesses/sec
    const onlineSeconds = guesses / onlineSpeed;
    const offlineSeconds = guesses / offlineSpeed;
    return { online: humanTime(onlineSeconds), offline: humanTime(offlineSeconds) };
  }

  function scoreFromEntropy(entropy) {
    const max = 80;
    return Math.min(100, Math.round((entropy / max) * 100));
  }

  function updateCriteria(pass) {
    const rules = {
      length: pass.length >= 12,
      uppercase: hasUpper(pass),
      lowercase: hasLower(pass),
      number: hasNumber(pass),
      special: hasSpecial(pass)
    };
    for (const el of criteriaItems) {
      const rule = el.getAttribute('data-rule');
      if (rules[rule]) {
        el.classList.add('rule-ok');
        el.classList.remove('rule-bad');
      } else {
        el.classList.remove('rule-ok');
        el.classList.add('rule-bad');
      }
    }

    if (containsCommon(pass) || detectSequential(pass) || detectRepetition(pass)) {
      commonWarn.classList.remove('hidden');
    } else {
      commonWarn.classList.add('hidden');
    }
  }

  function updateStrength(pass) {
    const entropy = estimateEntropy(pass);
    const score = scoreFromEntropy(entropy);
    strengthBar.style.width = score + '%';

    // color mapping (direct CSS)
    if (score < 30) {
      strengthBar.style.background = '#ef4444'; // red
      strengthText.textContent = 'Very weak';
    } else if (score < 50) {
      strengthBar.style.background = '#f97316'; // orange
      strengthText.textContent = 'Weak';
    } else if (score < 75) {
      strengthBar.style.background = '#f59e0b'; // yellow
      strengthText.textContent = 'Good';
    } else {
      strengthBar.style.background = '#10b981'; // green
      strengthText.textContent = 'Strong';
    }

    entropyText.textContent = entropy ? entropy + ' bits' : '— bits';
    const times = estimateCrackTime(entropy);
    crackEstimate.textContent = `Estimated time to crack (online / offline): ${times.online} / ${times.offline}`;
  }

  // events
  passwordInput.addEventListener('input', (e) => {
    const pass = e.target.value || '';
    updateCriteria(pass);
    updateStrength(pass);
  });

  // toggle
  let visible = false;
  toggleBtn.addEventListener('click', () => {
    visible = !visible;
    passwordInput.type = visible ? 'text' : 'password';
    toggleBtn.textContent = visible ? 'Hide' : 'Show';
  });

  // copy
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(passwordInput.value || '');
      copyBtn.textContent = 'Copied';
      setTimeout(()=> copyBtn.textContent = 'Copy', 1200);
    } catch (err) {
      passwordInput.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied';
      setTimeout(()=> copyBtn.textContent = 'Copy', 1200);
    }
  });

  // read ?pw= query param (so builder can pass password)
  function getQueryPassword() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('pw') ? decodeURIComponent(params.get('pw')) : '';
    } catch (e) {
      return '';
    }
  }

  // initial check if pw present
  const initialPw = getQueryPassword();
  if (initialPw) {
    passwordInput.value = initialPw;
    passwordInput.dispatchEvent(new Event('input'));
  } else {
    updateCriteria('');
    updateStrength('');
  }
})();
