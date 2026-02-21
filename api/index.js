export const config = { runtime: 'edge' };

function parseParams(rawUrl) {
  const q = rawUrl.indexOf('?');
  if (q === -1) return {};
  const pairs = rawUrl.slice(q + 1).split('?');
  const p = {};
  for (const pair of pairs) { const eq = pair.indexOf('='); if (eq !== -1) try { p[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1)); } catch { p[pair.slice(0, eq)] = pair.slice(eq + 1); } }
  return p;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const params = parseParams(req.url);
  const slugs = url.pathname.replace('/api/', '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const formatParam = (params.o || '').toLowerCase();

  const formatMap = {
    aiignore: '.aiignore', cursorignore: '.cursorignore', aiexclude: '.aiexclude',
    codeiumignore: '.codeiumignore', geminiignore: '.geminiignore', claudeignore: '.claudeignore',
  };
  const outputFilename = formatMap[formatParam] || '.aiignore';

  if (!slugs.length) {
    return new Response('Usage: curl -L ainit.dev/api/react,node,typescript\n\nSee https://ainit.dev for available templates.\n', { headers: { 'Content-Type': 'text/plain' } });
  }

  const base = new URL('/', url.origin);
  const index = await fetch(new URL('/templates/index.json', base)).then(r => r.json());
  const valid = new Set(index.map(t => t.slug));
  const bad = slugs.filter(s => !valid.has(s));

  if (bad.length) {
    const list = index.map(t => t.slug).sort().join(', ');
    return new Response(`Unknown template(s): ${bad.join(', ')}\n\nAvailable: ${list}\n`, { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }

  const parts = await Promise.all(slugs.map(s => fetch(new URL(`/templates/${s}.txt`, base)).then(r => r.text())));
  const rawQs = req.url.split('?').slice(1).join('?') || 'o=aiignore';
  const header = `# === ${outputFilename} ===\n# Templates: ${slugs.join(', ')}\n# curl -L ainit.dev/api/${slugs.join(',')}?${rawQs}\n`;
  return new Response(header + '\n' + parts.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
