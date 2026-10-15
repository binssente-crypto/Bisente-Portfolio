---
title: "CND Upraze"
date: "2026"
featured: true
client: "CND Upraze Solutions (Technopreneurship)"
role: "Lead Full-Stack Developer & Architect"
skills: ["React", "Laravel", "PHP", "GitHub Actions", "Docker", "Three.js", "PostgreSQL", "Redis", "Groq AI", "TailwindCSS"]
related: []
outcome: "Engineered an enterprise SaaS platform featuring an administrative telemetry command center, Three.js 3D manipulation studio, automated coverage gates, and automated Docker CI/CD deployment."
logo: "/images/projects/cnd-upraze.png"
links:
  repo: "https://github.com/binssente-crypto/CND-Upraze"
---

### Overview
Built for our 4th-year college Technopreneurship subject at DFCAMCLP alongside my internship (held every Friday), CND Upraze is a full-stack digital services and e-commerce platform. As the sole developer behind the entire application, I architected both the decoupled React 19 frontend and the Laravel 11 backend service core, wrapping the solution in Docker for containerized deployment and continuous testing.

### Key Features
- **Administrative Command Center**: High-density operational cockpit featuring real-time financial trajectory visualization, client telemetry, and service package management.
- **3D Studio Integration**: Interactive visual model manipulation built with Three.js and React Three Fiber (`@react-three/fiber`, `@react-three/drei`) embedded in a responsive Bento-style layout.
- **Automated Verification & Quality Gate**:
  - **Automated Feature & Unit Testing**: Comprehensive automated test suites executed against PostgreSQL 16 and Redis 7 service containers in CI with an enforced **80% minimum code coverage gate**.
  - **Static Code Analysis**: Strict static typing analysis verifying safety across backend models, authorization policies, and service classes.
- **CI/CD & Automated Production Deployment**:
  - Multi-stage GitHub Actions CI pipeline running linting, type-checking, and database migrations.
  - Automated Docker Buildx multi-platform image generation pushed to Docker Hub with GitHub Actions caching (`type=gha`).
  - Automated SSH deployment to production VPS with Docker Compose zero-downtime rolling reload, automated migration execution, and route/config caching.
- **Groq-Accelerated AI Assistant**: Task automation and intelligent customer support chatbot delivering fast LLM inference times.
- **Payment & Order Pipeline**: End-to-end checkout with automated invoice generation, Xendit/PayMongo payment callbacks, and instant customer notifications.
