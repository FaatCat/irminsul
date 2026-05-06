// script.js – Handles profile lookup, Enka API client, simple CV/RV calculations, and mock leaderboard rendering

// Utility: simple number formatter
function fmt(num) {
  return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// Simple CV (Crit Value) calculation – placeholder: critRate * critDmg
function computeCV(critRate, critDmg) {
  // critRate and critDmg are percentages (e.g., 0.05 for 5%)
  return critRate * critDmg * 100; // scale for display
}

// Simple RV (Roll Value) – placeholder: sum of sub‑stat values * weight
function computeRV(stats) {
  // stats is an object from Enka containing subStat values (e.g., "atk_": 0.12)
  let total = 0;
  for (const key in stats) {
    if (Object.prototype.hasOwnProperty.call(stats, key)) {
      const val = parseFloat(stats[key]);
      if (!isNaN(val)) total += val;
    }
  }
  return total * 100; // arbitrary scaling
}

// Show a temporary loading overlay
function setLoading(active) {
  const btn = document.getElementById('loadBtn');
  btn.disabled = active;
  btn.textContent = active ? 'Loading…' : 'Load Profile';
}

// Render mock leaderboard (10 rows) – replace with real data later
function renderMockLeaderboard(category) {
  const tbody = document.getElementById('lbBody');
  tbody.innerHTML = '';
  const categories = ['Anemo DPS', 'Cryo Support', 'Geo Tank'];
  const cat = category || categories[Math.floor(Math.random() * categories.length)];
  document.getElementById('lbCategory').textContent = cat;
  for (let i = 1; i <= 10; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i}</td>
      <td>User${i}</td>
      <td>${fmt(Math.random() * 200 + 100).replace(/\.00$/, '')}</td>
      <td>${fmt(Math.random() * 50 + 20).replace(/\.00$/, '')}</td>
    `;
    tbody.appendChild(tr);
  }
  document.getElementById('leaderboard').classList.remove('hidden');
}

// Main function – fetch profile and display
async function loadProfile() {
  const uid = document.getElementById('uidInput').value.trim();
  if (!/^[0-9]+$/.test(uid)) {
    alert('Please enter a valid numeric UID');
    return;
  }
  setLoading(true);
  try {
    const response = await fetch(`https://enka.network/api/uid/${uid}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Enka returns an object with "avatarInfoList" – pick the first character
    const avatar = data.avatarInfoList?.[0];
    if (!avatar) throw new Error('No character data found');
    const charName = avatar.name || 'Unknown';
    const icon = avatar.image || '';
    const stats = avatar.reliquary?.[0]?.subStat || {};
    const critRate = avatar.fightProp?.['criticalRate'] ?? 0;
    const critDmg = avatar.fightProp?.['criticalDamage'] ?? 0;
    const cv = computeCV(critRate, critDmg);
    const rv = computeRV(stats);

    // Populate UI
    document.getElementById('charName').textContent = charName;
    const avatarImg = document.getElementById('charAvatar');
    avatarImg.src = icon || '';
    avatarImg.alt = `${charName} avatar`;
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
      <div>CV: ${fmt(cv)}</div>
      <div>RV: ${fmt(rv)}</div>
      <div>Crit Rate: ${fmt(critRate * 100)}%</div>
      <div>Crit Damage: ${fmt(critDmg * 100)}%</div>
    `;
    document.getElementById('profile').classList.remove('hidden');
    // Render a mock leaderboard for the chosen category
    renderMockLeaderboard();
  } catch (e) {
    console.error(e);
    alert('Failed to load profile: ' + e.message);
  } finally {
    setLoading(false);
  }
}

document.getElementById('loadBtn').addEventListener('click', loadProfile);

// Optional: allow ENTER key to trigger load
document.getElementById('uidInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') loadProfile();
});
