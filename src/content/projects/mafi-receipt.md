---
title: "MAFI Invoicing & DR Automation"
date: "2024"
featured: false
client: "Michael Anthony's Fashion Inc."
role: "Freelance Software Developer"
skills: ["Node.js", "Express", "SQLite", "JavaScript", "HTML5", "CSS3"]
related: []
outcome: "Automated manual delivery receipts and invoicing for a local garment business—originally built in 2024 and upgraded in 2026 with Node.js, Express, and local SQLite persistence."
logo: "/images/projects/mafi-fashion.png"
links: {}
---

### Overview
Back in 2024, Michael Anthony's Fashion Inc. was losing hours every week handwriting physical delivery receipts and client invoices. The tool actually started out quite small—just a straightforward HTML, CSS, and vanilla JavaScript setup paired with SQLite so the front-desk staff could save their billing progress locally without touching anything complicated.

As their order volume grew, they reached out again in 2026 asking to revamp the tool for a smoother day-to-day workflow. I upgraded the architecture with a lightweight Node.js and Express backend, giving them a much faster, desktop-like interface with instant calculation breakdowns, reliable local backups, and zero subscription overhead.

### Key Features
- **Progressive Evolution**: Started as a lightweight HTML/CSS/JS tool with local SQLite storage in 2024, then overhauled in 2026 with a dedicated Node.js/Express service for a snappier front-desk experience.
- **Instant DR & Receipt Generation**: Pre-formatted templates aligned with BIR invoice and delivery receipt layouts, eliminating handwritten math mistakes.
- **Zero-Setup SQLite Backups**: Offline-first local database storage so receipt records and customer histories stay accessible even when the shop's internet cuts out.
- **Hardware-Ready Print Layouts**: Custom CSS print media stylesheets fine-tuned for thermal rolls and dot-matrix continuous-feed office printers.
