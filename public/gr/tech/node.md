# Node.js

## Code Style
- Use ES modules (import/export) over CommonJS (require) in new code
- Use async/await consistently — avoid mixing callbacks and promises
- Prefer built-in modules (fs/promises, crypto, path, node:test, glob) over npm equivalents

## Security
- Use helmet middleware for HTTP security headers in Express/Fastify
- Validate all request body, query, and path parameters with a schema validator
- Set appropriate CORS policies — never use `*` in production
- Use environment variables for all configuration — never hardcode
- Run with least privilege — do not run Node processes as root

## Testing
- Prefer node:test for new projects — it is stable and requires zero dependencies
- Test API endpoints with supertest or equivalent HTTP testing library
- Mock file system and network calls in unit tests

## Error Handling
- Use centralized error handling middleware in Express/Fastify applications
- Handle unhandledRejection and uncaughtException at the process level
- Return consistent error response shapes from all API endpoints
- Use HTTP status codes correctly (400 for client errors, 500 for server errors)

## Architecture
- Separate route handlers, business logic, and data access into distinct layers
- Use environment-based configuration with sensible defaults
- Implement graceful shutdown handling for production servers
- Use `node --watch` for development instead of nodemon

## Dependencies
- Audit packages with npm audit or equivalent before deploying
- Use package-lock.json or equivalent lock file — commit it to version control
- Avoid packages that have been deprecated or unmaintained for over a year
