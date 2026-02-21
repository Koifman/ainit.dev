# Django

## Code Style
- Follow Django coding style and conventions from official documentation
- Use class-based views for complex views, function-based for simple ones
- Keep models, views, serializers, and URLs in separate files per app

## Security
- Use Django's ORM for queries — if raw SQL is needed, always use parameterized `params=[]`
- Enable CSRF protection — do not disable it for convenience
- Use Django's built-in authentication system and permission framework
- Set ALLOWED_HOSTS, SECURE_SSL_REDIRECT, and security middleware in production
- Enable HSTS headers: SECURE_HSTS_SECONDS, SECURE_HSTS_INCLUDE_SUBDOMAINS, SECURE_HSTS_PRELOAD
- Set CSRF_COOKIE_SECURE and SESSION_COOKIE_SECURE to True in production
- Never store secrets in settings.py — use environment variables
- Run `manage.py check --deploy` before every production deployment

## Testing
- Use Django's TestCase with setUpTestData for efficient, isolated test data
- Use factory_boy or model_bakery instead of fixtures for test data
- Test views through the test client, not by calling view functions directly

## Architecture
- Keep Django apps small and focused on a single domain concept
- Use signals sparingly — prefer explicit calls over implicit magic
- Put business logic in service modules, not in views or models
- Use Django REST Framework serializers for all API input/output validation
- Use Meta.constraints (UniqueConstraint, CheckConstraint) over unique_together

## Error Handling
- Use Django's logging configuration for structured error logging
- Return proper HTTP error responses — use DRF exception handlers for APIs
