// ainit.dev — Router
// Detects pathname, shows correct page, inits correct module.

const path = window.location.pathname;

// Page visibility
const howtoPage = document.getElementById('page-howto');
const aiignorePage = document.getElementById('page-aiignore');
const guardrailsPage = document.getElementById('page-guardrails');

// Hide all first
howtoPage.classList.add('hidden');
aiignorePage.classList.add('hidden');
guardrailsPage.classList.add('hidden');

if (path === '/how-to-use') {
  howtoPage.classList.remove('hidden');
} else if (path === '/guardrails') {
  guardrailsPage.classList.remove('hidden');
  import('./guardrails.js').then(m => m.init());
} else {
  aiignorePage.classList.remove('hidden');
  import('./aiignore.js').then(m => m.init());
}

// Nav active state — desktop
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  const isActive = href === path || (href === '/' && path === '/');
  link.classList.toggle('active', isActive);
  link.classList.toggle('text-white', isActive);
  link.classList.toggle('bg-white/5', isActive);
  link.classList.toggle('text-muted', !isActive);
});

// Nav active state — mobile
document.querySelectorAll('.mobile-nav').forEach(link => {
  const href = link.getAttribute('href');
  const isActive = href === path || (href === '/' && path === '/');
  if (isActive) {
    link.classList.remove('bg-surface', 'text-muted', 'border-border');
    link.classList.add('bg-accent', 'text-white', 'border-accent');
  }
});
