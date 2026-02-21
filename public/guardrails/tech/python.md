# Python

## Code Style
- Follow PEP 8 style conventions and use a formatter (black, ruff)
- Use type hints for function parameters and return values
- Prefer f-strings over format() or % string formatting
- Use list comprehensions for simple transformations, loops for complex ones
- Write docstrings for public functions, classes, and modules

## Security
- Use `secrets` module for generating tokens, not `random`
- Never use `eval()` or `exec()` with user-provided input
- Use `subprocess` with list arguments, never shell=True with user input
- Validate file paths to prevent directory traversal attacks
- Never use `pickle` or `shelve` to deserialize untrusted data
- Never use `http.server` in production — it is not designed for it

## Testing
- Use pytest as the test framework with fixtures for setup
- Use parametrize for testing multiple input/output combinations
- Mock external dependencies with unittest.mock or pytest-mock
- Maintain test coverage for critical business logic paths

## Error Handling
- Use specific exception types — avoid bare `except:` clauses
- Use context managers (with statements) for resource management
- Define custom exception classes for domain-specific errors
- Log exceptions with traceback using the logging module
- Use `raise X from Y` for explicit exception chaining

## Architecture
- Use virtual environments for project isolation (uv, poetry, venv)
- Organize code into packages with clear __init__.py exports
- Separate configuration from code using environment variables or config files

## Dependencies
- Use a dependency manager with lock files (uv.lock, poetry.lock, requirements.txt with hashes)
- Pin exact versions in production deployments
- Prefer standard library solutions before adding external packages
