# Rust

## Code Style
- Run cargo fmt and cargo clippy before committing
- Use descriptive names for types, functions, and variables
- Prefer iterators and combinators over manual index-based loops
- Use the type system to make invalid states unrepresentable
- Document public APIs with doc comments (///)
- Derive common standard traits: Debug, Clone, Default, PartialEq where applicable

## Error Handling
- Use Result and Option types — avoid unwrap() in production code
- Use expect() only in initialization where failure is unrecoverable, with a descriptive message
- Define custom error types using thiserror for libraries, anyhow for applications
- Error types must implement std::error::Error + Send + Sync
- Propagate errors with the ? operator instead of manual matching
- Provide context when converting between error types

## Security
- Validate all input at trust boundaries — FFI, network, file I/O, deserialization
- Use `secrecy::Secret` for sensitive values to prevent accidental logging
- Minimize `unsafe` blocks and document safety invariants with `// SAFETY:` comments
- Run `cargo audit` in CI to catch known dependency vulnerabilities

## Testing
- Write unit tests in a #[cfg(test)] module within the same file
- Use integration tests in the tests/ directory for public API behavior
- Use proptest or quickcheck for property-based testing of complex logic

## Architecture
- Keep crates focused — split large crates into a workspace with multiple crates
- Use traits to define behavior contracts and enable testing with mocks
- Prefer owned types in public APIs, borrowed types in internal functions
- Use the builder pattern for types with many optional configuration parameters
- Minimize and isolate unsafe code — wrap in safe abstractions with `// SAFETY:` comments

## Dependencies
- Minimize dependency count — audit each new crate for maintenance and security
- Use cargo-deny to enforce license and vulnerability policies
- Pin crate versions in Cargo.lock for applications — commit the lock file
- Set `rust-version` in Cargo.toml to declare MSRV
