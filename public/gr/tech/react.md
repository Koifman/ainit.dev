# React

## Code Style
- Use functional components with hooks — avoid class components
- Extract reusable logic into custom hooks prefixed with `use`
- Split components when they handle multiple responsibilities
- Use destructuring for props at the function parameter level
- Colocate component styles, tests, and types in the same directory
- Pass ref as a prop directly — forwardRef is no longer needed (React 19+)
- Components must be pure — same inputs must produce same output

## Architecture
- Lift state up only as far as needed — avoid unnecessary global state
- Use React Context for cross-cutting concerns, not for all shared state
- Keep business logic out of components — use hooks or service modules
- Never store derived values in state — compute them during render
- Prefer controlled components for form inputs
- Use `useActionState` and form actions for form submissions with pending/error states (React 19+)
- Use lazy loading and Suspense for code splitting large routes

## Security
- Never use `dangerouslySetInnerHTML` with unsanitized content — sanitize with DOMPurify or equivalent
- Validate `href` and `src` props against `javascript:` and `data:` protocol injection
- Do not spread unfiltered user objects onto DOM elements (`{...userProps}`)
- Avoid `eval()`, `new Function()`, and `innerHTML` with any user-controlled data

## Testing
- Test component behavior through user interactions, not internal state
- Use React Testing Library — avoid testing implementation details
- Mock API calls and external services in component tests
- Test accessibility with automated checks (axe, jest-axe)

## Error Handling
- Wrap route-level components with Error Boundaries
- Handle loading, error, and empty states explicitly in every data-fetching component
- Show user-friendly error messages — never render raw error objects

## Dependencies
- Prefer React's built-in state management before adding Redux or Zustand
- Avoid installing multiple overlapping UI component libraries
