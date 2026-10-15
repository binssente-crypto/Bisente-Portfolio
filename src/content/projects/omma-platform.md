---
title: "STI OMMA Platform"
date: "2026"
featured: true
client: "Organization of Multimedia Artists (STI)"
role: "Freelance Full-Stack Engineer"
skills: ["Next.js", "React", "TypeScript", "GitHub Actions", "PostgreSQL", "Redis", "Prisma", "Supabase Storage", "TailwindCSS", "Socket.io"]
related: []
outcome: "Engineered a production-ready community portal for STI multimedia artists with Supabase Storage bucket uploads, Xendit payments, automated security audits, and continuous API contract testing."
logo: "/images/projects/omma-sti.png"
links:
  live: "https://omma-art.vercel.app/"
---

### Overview
Built from the ground up for the Organization of Multimedia Artists at STI College. The platform gives student and alumni artists a dedicated space to showcase portfolios, process event and print transactions via Xendit, store high-res media securely in Supabase Storage buckets, and interact in real time using Socket.io and Upstash Redis — secured by automated static security audits and continuous API contract testing.

### Key Features
- **Artist Portfolios & Galleries**: High-resolution creative media showcase with Supabase Storage bucket direct uploads, Exif extraction, and Algolia instant search.
- **Payment Processing**: Integrated Xendit checkout gateway for merchandise and organization event tickets.
- **Real-Time Collaboration**: Live community chat and announcements powered by Socket.io and Upstash Redis.
- **Automated CI/CD & API Testing**:
  - **Automated API Contract Testing**: Continuous collection testing running in GitHub Actions against local test endpoints to enforce contract integrity before production builds.
  - **Supabase CLI Migrations**: Automated schema synchronization via `supabase db push` in deployment workflows.
  - **Lighthouse CI Audits**: Continuous performance, accessibility, and SEO budget enforcement.
- **Security & Reliability Infrastructure**:
  - **Automated Static Security Analysis**: Continuous AST code scanning running weekly and on pull requests to catch vulnerabilities early.
  - **Credential Secret Protection**: Automated pre-commit and CI gates checking commits to prevent credential exposure.
  - **Production Health Canary**: Scheduled 30-minute health canary cron verifying PostgreSQL and Upstash Redis availability on live endpoints.
