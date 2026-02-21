# Dependencies

Rules for managing project dependencies.

- Minimize external dependencies — prefer standard library solutions when adequate
- Pin dependency versions to avoid unexpected breaking changes
- Review new dependencies for maintenance status, security, and license
- Never install packages from untrusted or unverified sources
- Keep dependencies up to date with regular, tested updates
- Remove unused dependencies promptly to reduce attack surface
- Use lock files and commit them to version control
- Prefer well-maintained packages with active communities
- Audit dependencies for known vulnerabilities before releases
- Avoid dependencies that pull in excessive transitive packages
- Document why non-obvious dependencies were added
- Use a single package manager per project — do not mix npm, yarn, and pnpm
