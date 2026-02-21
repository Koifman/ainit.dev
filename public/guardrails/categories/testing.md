# Testing

Rules for writing and maintaining tests.

- Write tests for new features and bug fixes before marking work complete
- Follow the Arrange-Act-Assert pattern for test structure
- Test behavior and outcomes, not implementation details
- Keep tests independent — no test should depend on another test's state
- Use descriptive test names that explain the expected behavior
- Mock external dependencies (APIs, databases, file system) in unit tests
- Include edge cases: empty inputs, boundary values, null/undefined
- Maintain test coverage for critical paths and business logic
- Do not test framework or library internals
- Clean up test fixtures and temporary data after tests run
- Prefer integration tests for API endpoints and data flows
- Keep test files colocated with the code they test or in a parallel structure
