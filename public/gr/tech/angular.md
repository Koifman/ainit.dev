# Angular

## Code Style
- Follow the Angular Style Guide for file naming and organization
- Use standalone components — they are the default since Angular 19
- Keep components focused — under 200 lines of TypeScript
- Use reactive forms for complex form logic, template forms for simple ones
- Use the async pipe in templates to manage Observable subscriptions

## Architecture
- Use Angular services for shared state and business logic
- Use signal(), computed(), and effect() for reactive state management
- Prefer signal-based input(), output(), and model() over decorators
- Implement lazy loading with loadComponent/loadChildren for route-level code splitting
- Use route guards for authentication and authorization checks
- Keep templates declarative — move complex logic to the component class
- Use Angular's built-in HttpClient with interceptors for API calls

## Testing
- Use TestBed for component and service testing
- Mock HTTP calls with provideHttpClient() and provideHttpClientTesting()
- Test component inputs, outputs, and template bindings
- Use Spectator or Angular Testing Library for simpler test setup

## Error Handling
- Use a global ErrorHandler service for centralized error handling
- Implement HTTP error interceptors for consistent API error processing
- Use catchError operator in Observable chains with meaningful fallbacks

## Security
- Use Angular's built-in sanitization — do not bypass with bypassSecurityTrust
- Enable strict CSP and configure trusted types
- Use HttpClient with XSRF protection enabled
