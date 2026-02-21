# ainit.dev

The "git init" for AI agents. Generate `.aiignore` files and AI guardrails for your coding tools.

**Live at [ainit.dev](https://ainit.dev)**

## Tools

### .aiignore Generator

Generate context-exclusion files for AI coding tools. Pick your stack, get a combined ignore file. Like gitignore.io, but for AI context windows.

**Supported formats:** `.aiignore`, `.cursorignore`, `.claudeignore`, `.codeiumignore`, `.geminiignore`, `.aiexclude`

### Guardrails Generator

Generate rules/instructions files for AI coding tools. Select technologies, toggle rule categories, get a combined rules file.

**Supported formats:** `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `copilot-instructions.md`, `GEMINI.md`

**8 rule categories:** Code Style, Security, Testing, Error Handling, Architecture, Dependencies, AI Behavior, Git Workflow

**10 technologies:** React, Python, TypeScript, Node.js, Next.js, Django, Go, Rust, Vue, Angular

## curl API

All URLs use `?` as the parameter separator (not `&`):

```sh
# .aiignore
curl -L ainit.dev/api/react,node,typescript

# Guardrails
curl -L ainit.dev/api/guardrails/react,python?o=cursor

# One-liner init (creates both files)
curl -sL "ainit.dev/api/init?t=react,node?g=react,python?o=cursor" | sh

# PowerShell
iex (iwr "ainit.dev/api/init?t=react,node?g=react,python?o=cursor?s=ps").Content
```

### Init API parameters

| Param | Description |
|-|-|
| `t=` | .aiignore templates (comma-separated) |
| `g=` | Guardrails technologies (comma-separated) |
| `c=` | Guardrails categories filter (optional) |
| `o=` | Output tool: `agents`, `cursor`, `claude`, `windsurf`, `copilot`, `gemini` |
| `s=` | Shell: `sh` (default), `ps` (PowerShell) |

## Architecture

- **Frontend:** Single `index.html` with client-side routing. Vanilla JS + Tailwind CSS. No framework.
- **API:** 3 Vercel edge functions (`api/index.js`, `api/guardrails/index.js`, `api/init/index.js`)
- **Data:** Static text/markdown templates in `public/templates/` and `public/guardrails/`
- **Build:** Vite (code-splits `aiignore.js` and `guardrails.js` as lazy-loaded modules)

## Development

```sh
bun install
bun run dev
```

## Contributing

Templates and guardrails are plain text files — contributions welcome via PR:

- `.aiignore` templates: `public/templates/{slug}.txt` + add entry to `public/templates/index.json`
- Guardrails tech files: `public/guardrails/tech/{slug}.md` + add entry to `public/guardrails/index.json`

## License

MIT
