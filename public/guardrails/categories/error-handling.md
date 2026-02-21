# Error Handling

Rules for robust error handling.

- Handle errors explicitly — never silently swallow exceptions
- Use typed or specific error classes instead of generic Error
- Provide meaningful error messages that help with debugging
- Log errors with sufficient context (operation, input, stack trace)
- Use try-catch at service boundaries, not around every statement
- Return appropriate HTTP status codes for API errors
- Implement graceful degradation for non-critical feature failures
- Validate inputs early and fail fast with clear messages
- Never expose internal error details or stack traces to end users
- Use error boundaries in UI frameworks to prevent full-page crashes
- Retry transient failures with exponential backoff and limits
- Document expected error scenarios in function signatures or comments
