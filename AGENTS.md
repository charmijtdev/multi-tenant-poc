<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project Rules

- Use Next.js App Router
- Use TypeScript
- Use server components by default
- Prefer middleware for tenant resolution
- Do not add unnecessary dependencies
- Preserve existing architecture
- Run build before completion

## Multi-Tenant Architecture

- Tenant identified via subdomain
- Support route fallback /org/[tenantKey]
- Tenant key must be unique and URL-safe

<!-- END:nextjs-agent-rules -->
