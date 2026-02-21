# Architecture

Rules for code organization and system design.

- Follow the established project structure — do not reorganize without discussion
- Keep business logic separate from framework and infrastructure code
- Use dependency injection over hard-coded dependencies where practical
- Design modules with clear interfaces and minimal coupling
- Prefer composition over inheritance for code reuse
- Keep configuration in environment variables or config files, not in code
- Follow existing naming conventions for files, directories, and modules
- Avoid circular dependencies between modules
- Place shared utilities in a common location, not duplicated across modules
- Design for the current requirements — avoid speculative abstractions
- Document architectural decisions in ADRs or project docs when making changes
- Keep API contracts stable — use versioning for breaking changes
