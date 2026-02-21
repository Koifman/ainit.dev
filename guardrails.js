// ainit.dev — Guardrails generator
// Zero frameworks. Zero build step. Just vanilla JS.

export function init() {
  // State
  let registry = { categories: [], technologies: [] };
  let selectedTechs = [];
  let activeCategories = new Set();
  let activeFormat = 'AGENTS.md';
  const cache = {};

  const formatSlugMap = {
    'AGENTS.md': 'agents', 'CLAUDE.md': 'claude', '.cursorrules': 'cursor',
    '.windsurfrules': 'windsurf', 'copilot-instructions.md': 'copilot', 'GEMINI.md': 'gemini',
  };

  const formatMeta = {
    'AGENTS.md':               { filename: 'AGENTS.md',               tool: 'Cross-tool (Linux Foundation)', hint: 'Drop <a href="https://agents.md" target="_blank" rel="noopener" class="text-muted underline hover:text-white">AGENTS.md</a> in your project root. This is the emerging cross-tool standard from the Linux Foundation — supported by multiple AI coding tools.' },
    'CLAUDE.md':               { filename: 'CLAUDE.md',               tool: 'Claude Code', hint: 'Drop <code class="text-muted">CLAUDE.md</code> in your project root. Claude Code reads it automatically for project-specific instructions.' },
    '.cursorrules':            { filename: '.cursorrules',            tool: 'Cursor', hint: 'Drop <code class="text-muted">.cursorrules</code> in your project root. Cursor reads it automatically for AI behavior rules.' },
    '.windsurfrules':          { filename: '.windsurfrules',          tool: 'Windsurf', hint: 'Drop <code class="text-muted">.windsurfrules</code> in your project root. Windsurf reads it automatically for AI behavior rules.' },
    'copilot-instructions.md': { filename: '.github/copilot-instructions.md', tool: 'GitHub Copilot', hint: 'Drop <code class="text-muted">copilot-instructions.md</code> in <code class="text-muted">.github/</code>. GitHub Copilot reads it for custom instructions.' },
    'GEMINI.md':               { filename: 'GEMINI.md',               tool: 'Gemini Code Assist', hint: 'Drop <code class="text-muted">GEMINI.md</code> in your project root. Gemini Code Assist reads it for project-specific rules (takes precedence over AGENTS.md).' },
  };

  // DOM
  const search = document.getElementById('gr-search');
  const results = document.getElementById('gr-results');
  const chips = document.getElementById('gr-chips');
  const emptyHint = document.getElementById('gr-empty-hint');
  const preview = document.getElementById('gr-preview');
  const filename = document.getElementById('gr-filename');
  const copyBtn = document.getElementById('gr-copy-btn');
  const downloadBtn = document.getElementById('gr-download-btn');
  const curlHint = document.getElementById('gr-curl-hint');
  const curlCmd = document.getElementById('gr-curl-cmd');
  const formatToggle = document.getElementById('gr-format-toggle');
  const setupHint = document.getElementById('gr-setup-hint');
  const categoryToggle = document.getElementById('gr-category-toggle');

  async function load() {
    try {
      const res = await fetch('/guardrails/index.json');
      registry = await res.json();
    } catch {
      preview.textContent = '// Error loading guardrails registry. Try refreshing.';
      return;
    }

    // All categories active by default
    registry.categories.forEach(c => activeCategories.add(c.slug));
    renderCategoryButtons();

    // Template count
    const countEl = document.getElementById('gr-template-count');
    if (countEl) countEl.textContent = `${registry.technologies.length} technologies`;

    // Restore from URL (split ONLY on ? — & is not a valid separator)
    const params = {};
    if (window.location.search.length > 1) {
      window.location.search.slice(1).split('?').forEach(part => {
        const eq = part.indexOf('=');
        if (eq !== -1) try { params[part.slice(0, eq)] = decodeURIComponent(part.slice(eq + 1)); } catch { params[part.slice(0, eq)] = part.slice(eq + 1); }
      });
    }
    const urlTechs = (params.t || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const urlCats = params.c || null;
    const validSlugs = new Set(registry.technologies.map(t => t.slug));

    urlTechs.forEach(slug => {
      if (validSlugs.has(slug) && !selectedTechs.includes(slug)) selectedTechs.push(slug);
    });

    if (urlCats) {
      activeCategories.clear();
      urlCats.split(',').forEach(c => {
        if (registry.categories.some(cat => cat.slug === c)) activeCategories.add(c);
      });
      renderCategoryButtons();
    }

    if (selectedTechs.length) { renderChips(); updatePreview(); }
  }

  // --- Category buttons ---
  function renderCategoryButtons() {
    categoryToggle.innerHTML = '';
    registry.categories.forEach(cat => {
      const btn = document.createElement('button');
      const isActive = activeCategories.has(cat.slug);
      btn.dataset.category = cat.slug;
      btn.className = isActive
        ? 'cat-btn px-3 py-1 rounded-full text-xs font-medium transition-colors bg-accent text-white'
        : 'cat-btn px-3 py-1 rounded-full text-xs font-medium transition-colors bg-surface text-muted border border-border hover:text-white';
      btn.textContent = cat.name;
      categoryToggle.appendChild(btn);
    });
  }

  categoryToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    const slug = btn.dataset.category;
    if (activeCategories.has(slug)) {
      activeCategories.delete(slug);
    } else {
      activeCategories.add(slug);
    }
    renderCategoryButtons();
    updatePreview();
    syncURL();
  });

  // --- Search ---
  function showResults(q) {
    const matches = registry.technologies.filter(t =>
      !selectedTechs.includes(t.slug) && (
        !q ||
        t.slug.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.aliases || []).some(a => a.toLowerCase().includes(q))
      )
    ).slice(0, 12);

    if (!matches.length) {
      results.innerHTML = '<div class="px-4 py-3 text-dim text-sm">No matching technologies</div>';
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

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#gr-search') && !e.target.closest('#gr-results')) {
      results.classList.add('hidden');
    }
  });

  results.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-slug]');
    if (!btn) return;
    addTech(btn.dataset.slug);
    search.value = '';
    results.classList.add('hidden');
    search.focus();
  });

  function syncURL() {
    const params = [];
    if (selectedTechs.length) params.push(`t=${selectedTechs.join(',')}`);
    if (activeCategories.size < registry.categories.length) {
      params.push(`c=${[...activeCategories].join(',')}`);
    }
    const path = params.length ? '/guardrails?' + params.join('?') : '/guardrails';
    history.replaceState(null, '', path);
  }

  function addTech(slug) {
    if (selectedTechs.includes(slug)) return;
    selectedTechs.push(slug);
    renderChips();
    updatePreview();
    syncURL();
  }

  function removeTech(slug) {
    selectedTechs = selectedTechs.filter(s => s !== slug);
    renderChips();
    updatePreview();
    syncURL();
  }

  // --- Chips ---
  function renderChips() {
    emptyHint.classList.toggle('hidden', selectedTechs.length > 0);
    chips.querySelectorAll('.chip').forEach(c => c.remove());

    selectedTechs.forEach(slug => {
      const t = registry.technologies.find(x => x.slug === slug);
      if (!t) return;
      const el = document.createElement('span');
      el.className = 'chip fade-in inline-flex items-center gap-1.5 bg-accent/15 text-accent border border-accent/30 rounded-full px-3 py-1 text-sm cursor-default';
      el.innerHTML = `${esc(t.name)} <button data-remove="${slug}" class="hover:text-white ml-0.5 text-accent/60">&times;</button>`;
      chips.appendChild(el);
    });
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) removeTech(btn.dataset.remove);
  });

  // --- Preview ---
  async function fetchText(url) {
    if (cache[url]) return cache[url];
    try {
      const res = await fetch(url);
      if (!res.ok) return '';
      const text = await res.text();
      cache[url] = text;
      return text;
    } catch {
      return '';
    }
  }

  function extractSections(markdown) {
    // Parse ## Category headers → { "Category Name": "content..." }
    const sections = {};
    const lines = markdown.split('\n');
    let current = null;
    let buf = [];

    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/);
      if (match) {
        if (current) sections[current] = buf.join('\n').trim();
        current = match[1].trim();
        buf = [];
      } else if (current) {
        buf.push(line);
      }
    }
    if (current) sections[current] = buf.join('\n').trim();
    return sections;
  }

  async function updatePreview() {
    const activeCatSlugs = [...activeCategories];

    if (!activeCatSlugs.length) {
      preview.innerHTML = '<span class="text-dim">// Enable at least one category to generate rules</span>';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      curlHint.classList.add('hidden');
      filename.textContent = formatMeta[activeFormat].filename;
      return;
    }

    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    filename.textContent = formatMeta[activeFormat].filename;

    // Fetch generic category files
    const catContents = await Promise.all(activeCatSlugs.map(async slug => {
      const cat = registry.categories.find(c => c.slug === slug);
      const text = await fetchText(`/guardrails/categories/${slug}.md`);
      return { slug, name: cat?.name || slug, text };
    }));

    // Fetch tech files and extract per-category sections
    const techSections = await Promise.all(selectedTechs.map(async slug => {
      const text = await fetchText(`/guardrails/tech/${slug}.md`);
      const t = registry.technologies.find(x => x.slug === slug);
      return { slug, name: t?.name || slug, sections: extractSections(text) };
    }));

    // Build combined output
    const meta = formatMeta[activeFormat];
    let output = `# === ${meta.filename} ===\n`;
    output += `# Generated by ainit.dev/guardrails\n`;
    if (selectedTechs.length) {
      output += `# Technologies: ${selectedTechs.join(', ')}\n`;
      output += `# curl -L ainit.dev/api/guardrails/${selectedTechs.join(',')}`;
      const qs = buildQueryString(activeCatSlugs);
      if (qs) output += qs;
      output += '\n';
    }
    output += '\n';

    for (const cat of catContents) {
      // Add generic rules (skip the # Title and description — just the rules)
      const genericLines = cat.text.split('\n');
      const rulesStart = genericLines.findIndex(l => l.startsWith('- '));
      const title = genericLines.find(l => l.startsWith('# '));
      output += `${title || `# ${cat.name}`}\n\n`;
      if (rulesStart >= 0) {
        // Include description lines between title and first rule
        const descLines = genericLines.slice(1, rulesStart).filter(l => l.trim()).join('\n');
        if (descLines) output += descLines + '\n\n';
        output += genericLines.slice(rulesStart).join('\n') + '\n';
      } else {
        output += cat.text + '\n';
      }

      // Append tech-specific rules for this category
      for (const tech of techSections) {
        const section = tech.sections[cat.name];
        if (section) {
          output += `\n## ${tech.name}\n${section}\n`;
        }
      }
      output += '\n';
    }

    preview.textContent = output.trim();

    // Curl hint
    if (selectedTechs.length) {
      curlHint.classList.remove('hidden');
      let cmd = `$ curl -L ainit.dev/api/guardrails/${selectedTechs.join(',')}`;
      const curlQs = buildQueryString(activeCatSlugs);
      if (curlQs) cmd += curlQs;
      curlCmd.textContent = cmd;
    } else {
      curlHint.classList.add('hidden');
    }
  }

  // --- Format toggle ---
  formatToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.format-btn');
    if (!btn) return;

    activeFormat = btn.dataset.format;
    formatToggle.querySelectorAll('.format-btn').forEach(b => {
      b.className = b === btn
        ? 'format-btn px-3 py-1 rounded text-xs font-medium transition-colors bg-accent text-white'
        : 'format-btn px-3 py-1 rounded text-xs font-medium transition-colors bg-surface text-muted border border-border hover:text-white';
    });

    filename.textContent = formatMeta[activeFormat].filename;
    setupHint.innerHTML = formatMeta[activeFormat].hint;
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
    a.download = formatMeta[activeFormat].filename;
    a.click();
    URL.revokeObjectURL(url);
  });

  function buildQueryString(activeCatSlugs) {
    const params = [];
    if (activeCatSlugs.length < registry.categories.length) {
      params.push(`c=${activeCatSlugs.join(',')}`);
    }
    params.push(`o=${formatSlugMap[activeFormat]}`);
    return '?' + params.join('?');
  }

  // --- Utility ---
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Start
  load();
}
