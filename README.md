# Bisente Portfolio

A developer portfolio featuring an accessible build-time SVG timeline route map built with Astro 7.

## Content Management

- **How to add an entry:** Create a markdown file in the relevant collection (`src/content/projects/`, `src/content/credentials/`, or `src/content/notes/`) following the frontmatter schemas defined in [`src/content.config.ts`](src/content.config.ts). The route map updates automatically on build.
- **How to find seed placeholders:** `grep -rl "# seed" src/content`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checks
npm run check

# Run unit tests
npm test

# Build production static output
npm run build
```
