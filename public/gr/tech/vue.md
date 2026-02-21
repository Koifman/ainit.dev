# Vue

## Code Style
- Use Composition API with script setup for new components
- Use single-file components (.vue) with template, script, style order
- Prefix component names with a multi-word identifier to avoid HTML conflicts
- Use v-bind shorthand (:) and v-on shorthand (@) consistently
- Keep computed properties pure — no side effects
- Use reactive destructure in defineProps for cleaner default values (Vue 3.5+)

## Architecture
- Use composables (use* functions) for reusable stateful logic
- Keep components small — extract sub-components when template exceeds 100 lines
- Use provide/inject for deeply nested component communication
- Use Pinia for global state management — avoid Vuex in new projects
- Use lazy-loaded route components for code splitting
- Use useTemplateRef() for template refs (Vue 3.5+)

## Security
- Never use `v-html` with unsanitized user content — sanitize with DOMPurify or equivalent
- Validate dynamic `:href` and `:src` bindings against `javascript:` protocol injection
- Do not use user input in dynamic component names (`<component :is="userInput">`)
- Avoid `eval()` and `new Function()` with any user-controlled data

## Testing
- Use Vue Test Utils with vitest for component testing
- Test component behavior through emitted events and rendered output
- Mock stores and composables in component tests
- Test composables independently from components

## Error Handling
- Use Vue's errorHandler for global error handling and onErrorCaptured in wrapper components
- Use Suspense for async setup — pair with onErrorCaptured for error recovery
