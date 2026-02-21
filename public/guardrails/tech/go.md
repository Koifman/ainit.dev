# Go

## Code Style
- Run gofmt (or goimports) and go vet on all code before committing
- Follow Effective Go conventions and Go Code Review Comments
- Use short variable names in small scopes, descriptive names in larger ones
- Return errors as values — do not panic for expected failure cases
- Use named return values only when they improve documentation
- Error strings should not be capitalized and should not end with punctuation

## Security
- Use prepared statements for all database queries
- Validate and sanitize all input at API boundaries
- Use crypto/rand for generating secrets, not math/rand
- Set `ReadTimeout`, `WriteTimeout`, `IdleTimeout` on http.Server and `Timeout` on http.Client
- Never use `http.DefaultClient` in production — it has no timeout

## Testing
- Use table-driven tests for functions with multiple input/output cases
- Use testify or standard testing package — keep test dependencies minimal
- Test exported functions through the public API, not internal implementation
- Use httptest package for testing HTTP handlers

## Error Handling
- Wrap errors with context using fmt.Errorf and %w verb
- Check every error return — do not use _ to discard errors silently
- Define sentinel errors for expected failure conditions
- Use errors.Is and errors.As for error comparison, not string matching

## Architecture
- Organize by feature/domain, not by technical layer
- Keep interfaces small — prefer one or two methods per interface
- Accept interfaces, return structs
- Use internal/ directory for packages that should not be imported externally
- Pass context.Context as the first parameter — do not store it in structs
- Use log/slog for structured logging
- Prefer synchronous functions — let callers add concurrency
- Document when and why goroutines exit to prevent leaks
