export const config = { runtime: 'edge' };

function parseParams(rawUrl) {
  const q = rawUrl.indexOf('?');
  if (q === -1) return {};
  const qs = rawUrl.slice(q + 1).replace(/%3F/gi, '?').replace(/%3D/gi, '=').replace(/%26/gi, '&');
  const p = {};
  for (const pair of qs.split(/[?&]/)) { if (pair.startsWith('path=')) continue; const eq = pair.indexOf('='); if (eq !== -1) try { p[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1)); } catch { p[pair.slice(0, eq)] = pair.slice(eq + 1); } }
  return p;
}

const FORMAT_MAP = {
  cursor:   { ignore: '.cursorignore',  rules: '.cursorrules',             ignoreSlug: 'cursorignore', rulesSlug: 'cursor' },
  claude:   { ignore: '.claudeignore',  rules: 'CLAUDE.md',               ignoreSlug: 'claudeignore', rulesSlug: 'claude' },
  agents:   { ignore: '.aiignore',      rules: 'AGENTS.md',               ignoreSlug: 'aiignore',     rulesSlug: 'agents' },
  windsurf: { ignore: '.codeiumignore', rules: '.windsurfrules',          ignoreSlug: 'codeiumignore', rulesSlug: 'windsurf' },
  copilot:  { ignore: '.aiexclude',     rules: '.github/copilot-instructions.md', ignoreSlug: 'aiexclude',    rulesSlug: 'copilot' },
  gemini:   { ignore: '.geminiignore',  rules: 'GEMINI.md',               ignoreSlug: 'geminiignore', rulesSlug: 'gemini' },
};

export default async function handler(req) {
  const url = new URL(req.url);
  const params = parseParams(req.url);
  const techs = params.t || '';
  const guardrails = params.g || '';
  const catFilter = params.c || '';
  const format = (params.o || 'agents').toLowerCase();
  const shell = (params.s || 'sh').toLowerCase();

  const fmt = FORMAT_MAP[format] || FORMAT_MAP.agents;

  if (!techs && !guardrails) {
    return new Response(
      'Usage: curl -sL "ainit.dev/api/init?t=react,node?g=react,node?o=cursor" | sh\n\n' +
      'Parameters:\n' +
      '  t= .aiignore templates (comma-separated)\n' +
      '  g= guardrails technologies (comma-separated)\n' +
      '  c= guardrails categories (optional filter)\n' +
      '  o= tool: agents, cursor, claude, windsurf, copilot, gemini\n' +
      '  s= shell: sh (default), ps (PowerShell)\n\n' +
      'Examples:\n' +
      '  curl -sL "ainit.dev/api/init?t=react,node?g=react,node" | sh\n' +
      '  iex (iwr "ainit.dev/api/init?t=react,node?g=react,node?o=cursor?s=ps").Content\n\n' +
      'See https://ainit.dev for available templates and technologies.\n',
      { headers: { 'Content-Type': 'text/plain' } }
    );
  }

  const base = new URL('/', url.origin);

  let ignoreContent = '';
  if (techs) {
    const res = await fetch(new URL(`/api/${techs}?o=${fmt.ignoreSlug}`, base));
    if (!res.ok) {
      const body = await res.text();
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'text/plain' } });
    }
    ignoreContent = await res.text();
  }

  let rulesContent = '';
  if (guardrails) {
    let grPath = `/api/guardrails/${guardrails}?o=${fmt.rulesSlug}`;
    if (catFilter) grPath += `?c=${catFilter}`;
    const res = await fetch(new URL(grPath, base));
    if (!res.ok) {
      const body = await res.text();
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'text/plain' } });
    }
    rulesContent = await res.text();
  }

  const output = shell === 'ps'
    ? generatePowerShell(ignoreContent, rulesContent, fmt)
    : generateShell(ignoreContent, rulesContent, fmt);

  return new Response(output, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

function generateShell(ignoreContent, rulesContent, fmt) {
  let script = '#!/bin/sh\n';

  if (ignoreContent) {
    script += `cat > '${fmt.ignore}' << 'AINIT_IGNORE_EOF'\n`;
    script += ignoreContent;
    if (!ignoreContent.endsWith('\n')) script += '\n';
    script += 'AINIT_IGNORE_EOF\n';
    script += `echo "Created ${fmt.ignore}"\n`;
  }

  if (rulesContent) {
    const dir = fmt.rules.includes('/') ? fmt.rules.slice(0, fmt.rules.lastIndexOf('/')) : '';
    if (dir) script += `mkdir -p '${dir}'\n`;
    script += `cat > '${fmt.rules}' << 'AINIT_RULES_EOF'\n`;
    script += rulesContent;
    if (!rulesContent.endsWith('\n')) script += '\n';
    script += 'AINIT_RULES_EOF\n';
    script += `echo "Created ${fmt.rules}"\n`;
  }

  return script;
}

function generatePowerShell(ignoreContent, rulesContent, fmt) {
  let script = '$u = [Text.UTF8Encoding]::new($false)\n';

  if (ignoreContent) {
    const escaped = ignoreContent.replace(/'/g, "''");
    script += `[IO.File]::WriteAllText((Join-Path $PWD '${fmt.ignore}'), '${escaped}', $u)\n`;
    script += `Write-Host "Created ${fmt.ignore}"\n`;
  }

  if (rulesContent) {
    const dir = fmt.rules.includes('/') ? fmt.rules.slice(0, fmt.rules.lastIndexOf('/')) : '';
    if (dir) script += `New-Item -ItemType Directory -Force -Path (Join-Path $PWD '${dir}') | Out-Null\n`;
    const escaped = rulesContent.replace(/'/g, "''");
    script += `[IO.File]::WriteAllText((Join-Path $PWD '${fmt.rules}'), '${escaped}', $u)\n`;
    script += `Write-Host "Created ${fmt.rules}"\n`;
  }

  return script;
}
