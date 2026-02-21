# Next.js

## Code Style
- Use the App Router (app/) for new projects — Pages Router for existing ones
- Colocate page components, layouts, and loading/error states in route directories
- Use server components by default — add 'use client' only when needed
- Await `params` and `searchParams` — they are Promises in Next.js 15+

## Architecture
- Use Server Actions ('use server') for mutations and form submissions
- Implement loading.tsx and error.tsx for each route segment
- Use middleware for authentication redirects and request validation
- Keep API routes thin — delegate to service modules for business logic
- Use dynamic imports for heavy client-side components
- Call `revalidatePath` or `revalidateTag` after mutations in Server Actions
- Use the Metadata API (generateMetadata or static metadata export) for SEO

## Security
- Use the `server-only` package for code that must never reach the client
- Validate inputs and verify authorization in every Server Action
- Do not rely on layout auth checks alone — layouts do not re-render on client navigation

## Testing
- Test server components by testing their data-fetching logic directly
- Use Playwright or Cypress for end-to-end route testing
- Mock Next.js router in component tests

## Dependencies
- Use next/image for optimized image loading
- Use next/font for optimized font loading — avoid external font CDNs
