// ainit.dev — .aiignore generator
// Zero frameworks. Zero build step. Just vanilla JS.

export function init() {
  // State
  let templates = [];
  let selected = [];
  let activeFormat = '.aiignore';
  const cache = {};

  const formatSlugMap = {
    '.aiignore': 'aiignore', '.cursorignore': 'cursorignore', '.aiexclude': 'aiexclude',
    '.codeiumignore': 'codeiumignore', '.geminiignore': 'geminiignore', '.claudeignore': 'claudeignore',
  };

  const setupInstructions = {
    '.aiignore': 'No tool reads <code class="text-muted">.aiignore</code> natively yet. Use a tool-specific format below, or rename the file for your tool.',
    '.cursorignore': 'Drop <code class="text-muted">.cursorignore</code> in your project root. Cursor reads it automatically to exclude files from indexing and context.',
    '.aiexclude': 'Drop <code class="text-muted">.aiexclude</code> in your project root. GitHub Copilot reads it to exclude files from code suggestions.',
    '.codeiumignore': 'Drop <code class="text-muted">.codeiumignore</code> in your project root. Codeium and Windsurf read it automatically to exclude files from indexing.',
    '.geminiignore': 'Drop <code class="text-muted">.geminiignore</code> in your project root. Gemini Code Assist reads it to exclude files from context.',
    '.claudeignore': 'Drop <code class="text-muted">.claudeignore</code> in your project root. Claude Code reads it to exclude files from context and indexing.',
  };

  // DOM
  const search = document.getElementById('search');
  const results = document.getElementById('results');
  const chips = document.getElementById('chips');
  const emptyHint = document.getElementById('empty-hint');
  const preview = document.getElementById('preview');
  const filename = document.getElementById('filename');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const curlHint = document.getElementById('curl-hint');
  const curlCmd = document.getElementById('curl-cmd');
  const formatToggle = document.getElementById('format-toggle');
  const setupHint = document.getElementById('setup-hint');

  // Load template registry
  async function load() {
    try {
      const res = await fetch('/templates/index.json');
      templates = await res.json();
    } catch {
      preview.textContent = '// Error loading templates. Try refreshing.';
      return;
    }

    // --- Template count ---
    const templateCount = document.getElementById('template-count');
    templateCount.textContent = `${templates.length} templates`;

    // --- Restore from URL (split ONLY on ? — & is not a valid separator) ---
    const params = {};
    if (window.location.search.length > 1) {
      window.location.search.slice(1).split('?').forEach(part => {
        const eq = part.indexOf('=');
        if (eq !== -1) try { params[part.slice(0, eq)] = decodeURIComponent(part.slice(eq + 1)); } catch { params[part.slice(0, eq)] = part.slice(eq + 1); }
      });
    }
    const urlTemplates = (params.t || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const validSlugs = new Set(templates.map(t => t.slug));
    urlTemplates.forEach(slug => {
      if (validSlugs.has(slug) && !selected.includes(slug)) selected.push(slug);
    });
    if (selected.length) { renderChips(); updatePreview(); }
  }

  // --- Search ---
  function showResults(q) {
    const matches = templates.filter(t =>
      !selected.includes(t.slug) && (
        !q ||
        t.slug.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.aliases || []).some(a => a.toLowerCase().includes(q)) ||
        t.category.includes(q)
      )
    ).slice(0, 12);

    if (!matches.length) {
      results.innerHTML = '<div class="px-4 py-3 text-dim text-sm">No matching templates</div>';
    } else {
      results.innerHTML = matches.map(t => `
        <button data-slug="${t.slug}" class="result-item w-full text-left px-4 py-2 hover:bg-white/5 transition-colors flex justify-between items-center">
          <span class="text-white text-sm">${esc(t.name)}</span>
          <span class="text-dim text-xs">${esc(t.category)}</span>
        </button>
      `).join('');
    }
    results.classList.remove('hidden');
  }

  search.addEventListener('focus', () => {
    showResults(search.value.trim().toLowerCase());
  });

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    showResults(q);
  });

  search.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.result-item');
    const active = results.querySelector('.result-item.bg-white\\/10');
    let idx = [...items].indexOf(active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = idx < items.length - 1 ? idx + 1 : 0;
      items.forEach(i => i.classList.remove('bg-white/10'));
      items[idx]?.classList.add('bg-white/10');
      items[idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = idx > 0 ? idx - 1 : items.length - 1;
      items.forEach(i => i.classList.remove('bg-white/10'));
      items[idx]?.classList.add('bg-white/10');
      items[idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      const target = active || items[0];
      if (target) target.click();
    } else if (e.key === 'Escape') {
      results.classList.add('hidden');
      search.blur();
    }
  });

  // Click outside closes results
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search') && !e.target.closest('#results')) {
      results.classList.add('hidden');
    }
  });

  // Select a template from results
  results.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-slug]');
    if (!btn) return;
    addTemplate(btn.dataset.slug);
    search.value = '';
    results.classList.add('hidden');
    search.focus();
  });

  function syncURL() {
    const path = selected.length ? '/?t=' + selected.join(',') : '/';
    history.replaceState(null, '', path);
  }

  function addTemplate(slug) {
    if (selected.includes(slug)) return;
    selected.push(slug);
    renderChips();
    updatePreview();
    syncURL();
  }

  function removeTemplate(slug) {
    selected = selected.filter(s => s !== slug);
    renderChips();
    updatePreview();
    syncURL();
  }

  // --- Chips ---
  function renderChips() {
    emptyHint.classList.toggle('hidden', selected.length > 0);

    // Remove old chips
    chips.querySelectorAll('.chip').forEach(c => c.remove());

    selected.forEach(slug => {
      const t = templates.find(x => x.slug === slug);
      if (!t) return;
      const el = document.createElement('span');
      el.className = 'chip fade-in inline-flex items-center gap-1.5 bg-accent/15 text-accent border border-accent/30 rounded-full px-3 py-1 text-sm cursor-default';
      el.innerHTML = `${esc(t.name)} <button data-remove="${slug}" class="hover:text-white ml-0.5 text-accent/60">&times;</button>`;
      chips.appendChild(el);
    });
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) removeTemplate(btn.dataset.remove);
  });

  // --- Preview ---
  async function updatePreview() {
    if (!selected.length) {
      preview.innerHTML = '<span class="text-dim">// Select technologies above to generate your ignore file</span>';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      curlHint.classList.add('hidden');
      filename.textContent = activeFormat;
      return;
    }

    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    filename.textContent = activeFormat;

    // Fetch templates (with cache)
    const parts = await Promise.all(selected.map(async slug => {
      if (cache[slug]) return cache[slug];
      try {
        const res = await fetch(`/templates/${slug}.txt`);
        const text = await res.text();
        cache[slug] = text;
        return text;
      } catch {
        return `# Error loading ${slug} template\n`;
      }
    }));

    const formatSuffix = `?o=${formatSlugMap[activeFormat]}`;
    const header = `# === ${activeFormat} ===\n# Templates: ${selected.join(', ')}\n# curl -L ainit.dev/api/${selected.join(',')}${formatSuffix}\n`;
    const content = header + '\n' + parts.join('\n');
    preview.textContent = content;

    // Update curl hint
    curlHint.classList.remove('hidden');
    curlCmd.textContent = `$ curl -L ainit.dev/api/${selected.join(',')}${formatSuffix}`;
  }

  // --- Format toggle ---
  formatToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.format-btn');
    if (!btn) return;

    activeFormat = btn.dataset.format;

    // Update button styles
    formatToggle.querySelectorAll('.format-btn').forEach(b => {
      b.className = b === btn
        ? 'format-btn px-3 py-1 rounded text-xs font-medium transition-colors bg-accent text-white'
        : 'format-btn px-3 py-1 rounded text-xs font-medium transition-colors bg-surface text-muted border border-border hover:text-white';
    });

    filename.textContent = activeFormat;
    setupHint.innerHTML = setupInstructions[activeFormat] || '';
    updatePreview();
  });

  // --- Copy ---
  copyBtn.addEventListener('click', async () => {
    const text = preview.textContent;
    try {
      await navigator.clipboard.writeText(text);
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('text-green-400');
      setTimeout(() => { copyBtn.textContent = orig; copyBtn.classList.remove('text-green-400'); }, 1500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    }
  });

  // --- Download ---
  downloadBtn.addEventListener('click', () => {
    const text = preview.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFormat;
    a.click();
    URL.revokeObjectURL(url);
  });

  // --- Utility ---
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Start
  load();
}
