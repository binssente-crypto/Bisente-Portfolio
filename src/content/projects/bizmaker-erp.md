---
title: "BizMaker HRIS ERP"
date: "2026"
featured: true
client: "BizMaker Consultancy Inc."
role: "Sole Developer & Architect (SaaS)"
skills: ["Vue.js", "TypeScript", "Python", "Django", "GitHub Actions", "Docker", "PostgreSQL", "Redis", "Pinia"]
related: []
outcome: "Architected and built an enterprise payroll and HRIS ERP cloud SaaS handling Philippine statutory deductions, automated attendance sync, multi-tenant isolation, and resilient payroll runs."
logo: "/images/projects/bizmaker.png"
links: { live: "https://bizmaker-payroll.vercel.app/" }
---

### Overview
What started as a focused payroll calculator in April 2026 quickly expanded into a full-scale HRIS and ERP SaaS, designed and built entirely by me. Built with Vue 3, TypeScript, and a robust Django REST backend, BizMaker automates 2316 tax schedules, SSS, PhilHealth, Pag-IBIG statutory deductions, biometric clock-in backfills, and multi-tier tenant management for Philippine businesses — backed by an enterprise multi-stage CI/CD pipeline and comprehensive test coverage.

### Key Features
- **Statutory Tax & Deductions**: Precise Philippine BIR 2316 tax schedules, SSS, PhilHealth, and Pag-IBIG deduction rules with ACID-compliant database transactions.
- **Biometric Integration**: Automated attendance sync with backfill algorithms for missed punches and shift variations via ZKTeco biometric SDK.
- **Automated CI/CD Pipeline & Quality Gates**: Multi-stage GitHub Actions CI pipeline running with ephemeral PostgreSQL and Redis service containers, automated statutory formula verification, and zero-downtime release deployments to Render and Vercel.
- **Multi-Tenant Architecture & Cloud Rollout**: Secure tenant isolation, Redis caching, pre-commit credential gates, and zero-downtime deployments to Render and Vercel.
- **Reporting Engine**: Instant export of employee payslips, government remittance summaries, and bank payroll sheets via SheetJS and jsPDF.
