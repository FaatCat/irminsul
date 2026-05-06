// components/card.js – creates a glass‑morphism card element
export function createCard(title, content) {
  const card = document.createElement('div');
  card.className = 'glass card';
  card.style.padding = '1rem';
  card.style.borderRadius = 'var(--radius)';
  const h = document.createElement('h3');
  h.textContent = title;
  h.style.marginBottom = '0.5rem';
  h.style.color = 'var(--primary)';
  const body = document.createElement('div');
  body.innerHTML = content;
  card.appendChild(h);
  card.appendChild(body);
  return card;
}
