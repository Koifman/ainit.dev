# TypeScript

## Code Style
- Enable strict mode in tsconfig.json — do not use `any` as an escape hatch
- Define explicit return types for exported and public API functions
- Prefer `interface` for object shapes; use `type` for unions, tuples, and mapped types
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use `as const` objects for fixed value sets — prefer over enums
- Use `satisfies` to validate values against types without widening
- Never use boxed types (`String`, `Number`, `Boolean`, `Object`) — use lowercase primitives

## Security
- Validate external data at runtime boundaries with schema validation (zod, io-ts)
- Never trust type assertions (`as`) for data from external sources
- Use branded types for sensitive values (UserId, Email) to prevent misuse

## Testing
- Test type-level behavior with type assertion tests where critical
- Use generics in test utilities to maintain type safety in test helpers

## Error Handling
- Use discriminated unions for operation results instead of throwing
- Define error types as part of function signatures
- Use `never` type to ensure exhaustive switch/if-else handling

## Architecture
- Keep types close to where they are used — avoid a single global types file
- Enable `verbatimModuleSyntax` and use `import type`/`export type` consistently
- Use path aliases in tsconfig for clean imports across modules
