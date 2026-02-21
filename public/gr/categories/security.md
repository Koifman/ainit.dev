# Security

Rules for writing secure code.

- Never hardcode secrets, API keys, or credentials in source code
- Always validate and sanitize user input before processing
- Use parameterized queries — never concatenate user input into SQL
- Implement proper authentication and authorization checks
- Escape output to prevent XSS in web applications
- Use HTTPS for all external API calls and webhooks
- Apply the principle of least privilege for file and API permissions
- Never log sensitive data (passwords, tokens, PII)
- Use cryptographically secure random generators for tokens and IDs
- Keep dependencies updated to patch known vulnerabilities
- Validate file uploads (type, size, content) before processing
- Implement rate limiting on public-facing endpoints
- Use Content Security Policy headers in web applications
