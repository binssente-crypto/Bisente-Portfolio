---
title: "What two years of freelance systems taught me"
date: "2026"
skills: ["Architecture", "Freelancing", "MySQL", "PHP", "React"]
related: ["projects/bubble-pos", "projects/mafi-custom-3d", "projects/bizmaker-erp"]
draft: false
---

I started taking on freelance client projects back in early 2024. My very first client was Bubble Hideout, a dining spot down in CAA, Las Piñas. They needed a point-of-sale system that could take orders quickly without freezing up during dinner rushes and keep their daily inventory honest. Right after that came a tailoring shop wanting their manual invoices and Delivery Receipts automated so they could stop handwriting paperwork, followed by an attendance portal for a local perfume shop.

When you're building software for real small businesses, theory goes out the window fast. 

Here are the biggest things two years of shipping systems taught me:

### 1. Nobody cares about your tech stack if the receipt doesn't print
In school or side projects, it's easy to obsess over which framework is trending this month. But when a cashier has five customers waiting in line or an accountant is balancing receipts at 8 PM, they only care about two things: is it fast, and does it work every single time? 

At Bubble Hideout, a split-second delay when printing a kitchen receipt felt like an eternity to the staff. That experience taught me to prioritize reliability and straightforward UX over clever, overengineered code.

### 2. Client problems evolve—your schema has to allow for it
When we started building for Michael Anthony's Fashion Inc. (MAFI), it began as a simple invoice and DR tool. But watching them sketch collar cuts and sleeve patterns by hand revealed a much deeper bottleneck. That realization turned into my whole-year 2025 capstone: an interactive 3D tailoring platform where customers could visualize garment customizations directly in the browser so the cutters didn't have to guess from sketches anymore.

If you lock yourself into brittle database schemas or assumptions, adapting to how clients actually operate becomes painful. Flat, predictable data models win every time.

### 3. Payroll and money leave zero margin for error
Moving into 2026 with BizMaker HRIS ERP and my current work at AAA and Co., CPAs, the stakes stepped up. A miscalculated overtime minute or an untracked debit entry isn't just a UI bug—it's someone's paycheck or tax compliance. 

Building BizMaker taught me to treat transactions with absolute respect: atomic database operations, clear audit trails, and defensive validation at every layer.

### 4. Software is a conversation
The best features I've ever shipped never came from a specification document. They came from sitting next to the cashiers in Las Piñas, watching how tailors handled cloth measurements, or pairing with my dev friend during our Gamma Oracle internship to build the Tax Leaders Circle portal. 

Code is just the tool. Understanding the person using it is the job.
