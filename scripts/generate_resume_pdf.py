import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def create_resume(output_path):
    # Printable area: 8.5 x 11 inches.
    # Margins: Left/Right = 0.45 in (32.4 pt), Top/Bottom = 0.40 in (28.8 pt).
    # Usable width = 8.5 * 72 - 64.8 = 547.2 pt.
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0.45 * inch,
        rightMargin=0.45 * inch,
        topMargin=0.40 * inch,
        bottomMargin=0.40 * inch,
        title="Mark Reizel Vincent C. Palma - Resume",
        author="Mark Reizel Vincent C. Palma",
        subject="Full-Stack Software Engineer Resume",
        keywords="Full-Stack Engineer, React, Laravel, PostgreSQL, Cybersecurity, Cisco, Python, TypeScript",
    )

    styles = getSampleStyleSheet()

    usable_width = 8.5 * 72 - (0.90 * inch)

    # Custom Typographic Hierarchy
    style_name = ParagraphStyle(
        "CandidateName",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15.5,
        leading=18,
        alignment=1,  # Center
        textColor=colors.black,
        spaceAfter=2,
    )

    style_title = ParagraphStyle(
        "CandidateTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        alignment=1,
        textColor=colors.black,
        spaceAfter=3,
    )

    style_header_line = ParagraphStyle(
        "CandidateHeaderLine",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        alignment=1,
        textColor=colors.black,
        spaceAfter=2,
    )

    style_section_title = ParagraphStyle(
        "SectionTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=colors.black,
        spaceBefore=5,
        spaceAfter=2,
    )

    style_body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=colors.black,
        alignment=4,  # Justify
        spaceAfter=3,
    )

    style_bullet = ParagraphStyle(
        "BulletItem",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.2,
        textColor=colors.black,
        leftIndent=12,
        firstLineIndent=-10,
        spaceAfter=1.8,
    )

    style_role_left = ParagraphStyle(
        "RoleLeft",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.0,
        leading=11.5,
        textColor=colors.black,
    )

    style_date_right = ParagraphStyle(
        "DateRight",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11.5,
        alignment=2,  # Right
        textColor=colors.black,
    )

    style_sub_left = ParagraphStyle(
        "SubLeft",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=11.0,
        textColor=colors.black,
    )

    style_sub_right = ParagraphStyle(
        "SubRight",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.0,
        alignment=2,  # Right
        textColor=colors.black,
    )

    elements = []

    # 1. HEADER
    elements.append(Paragraph("MARK REIZEL VINCENT C. PALMA", style_name))
    elements.append(Paragraph("FULL-STACK SOFTWARE ENGINEER", style_title))

    contact_html = (
        "Las Piñas City, Metro Manila, Philippines &nbsp;&nbsp;&bull;&nbsp;&nbsp; "
        '<a href="mailto:binssente@gmail.com" color="#000000"><u>binssente@gmail.com</u></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp; '
        '<a href="tel:+639158057972" color="#000000"><u>+63 915 805 7972</u></a>'
    )
    elements.append(Paragraph(contact_html, style_header_line))

    portfolio_html = 'Portfolio: <a href="https://mrvcp-portfolio.vercel.app" color="#000000"><u>mrvcp-portfolio.vercel.app</u></a>'
    elements.append(Paragraph(portfolio_html, style_header_line))
    elements.append(Spacer(1, 2))
    elements.append(
        HRFlowable(
            width="100%", thickness=1.5, color=colors.black, spaceBefore=1, spaceAfter=4
        )
    )

    # Helper function for section headings
    def add_section_header(title):
        elements.append(Paragraph(title, style_section_title))
        elements.append(
            HRFlowable(
                width="100%",
                thickness=0.75,
                color=colors.black,
                spaceBefore=1,
                spaceAfter=4,
            )
        )

    # Helper function for item header table (Left role, Right dates; Left company, Right location)
    def create_item_header(left_top, right_top, left_bot, right_bot):
        table_data = [
            [
                Paragraph(left_top, style_role_left),
                Paragraph(right_top, style_date_right),
            ],
            [
                Paragraph(left_bot, style_sub_left),
                Paragraph(right_bot, style_sub_right),
            ],
        ]
        t = Table(table_data, colWidths=[usable_width * 0.72, usable_width * 0.28])
        t.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ]
            )
        )
        return t

    # 2. PROFESSIONAL SUMMARY
    add_section_header("PROFESSIONAL SUMMARY")
    summary_text = (
        "Full-Stack Software Engineer and <b>Magna Cum Laude</b> Information Systems graduate with 2+ years of "
        "production experience architecting end-to-end web applications, internal enterprise ERPs, and automated "
        "transaction platforms. Combines hands-on development in React, Next.js, Laravel, PHP, and PostgreSQL with a "
        "specialized Cisco cybersecurity background in network defense and threat management. Proven track record "
        "collaborating in small engineering teams and shipping resilient civic-tech software."
    )
    elements.append(Paragraph(summary_text, style_body))
    elements.append(Spacer(1, 2))

    # 3. TECHNICAL SKILLS
    add_section_header("TECHNICAL SKILLS")
    skills = [
        ("Languages:", "JavaScript (ES6+), TypeScript, PHP, Python, SQL, HTML5, CSS3"),
        (
            "Frontend:",
            "React 19, Next.js, Vue 3, Vite, Tailwind CSS, Framer Motion, Bootstrap, Responsive UI/UX",
        ),
        (
            "Backend & APIs:",
            "Laravel 11, Django, FastAPI, Node.js, RESTful APIs, WebSockets (Socket.io), Sanctum, PHPMailer",
        ),
        (
            "Databases & BaaS:",
            "PostgreSQL, MySQL, Supabase, Redis, AWS S3, Prisma ORM, Query Optimization",
        ),
        (
            "Cloud & Hosting:",
            "Vercel, Render, Hostinger, Docker & Docker Compose, Linux, Nginx, CI/CD Actions, Git/GitHub",
        ),
        (
            "Cybersecurity & Systems:",
            "SOC Operations, Incident Response, Network Defense, Threat Intelligence (CVSS), Endpoint Hardening, Cisco IOS",
        ),
        (
            "AI & Tools:",
            "Claude, Google Gemini, CodeRabbit, Groq AI, Microsoft AutoGen",
        ),
    ]
    for cat, items in skills:
        p_text = f"&bull;&nbsp;&nbsp;<b>{cat}</b> {items}"
        elements.append(Paragraph(p_text, style_bullet))
    elements.append(Spacer(1, 2))

    # 4. PROFESSIONAL EXPERIENCE
    add_section_header("PROFESSIONAL EXPERIENCE")

    # Experience 1: AAA and Co.
    t1 = create_item_header(
        "Software Development Associate",
        "June 2026 – Present",
        "AAA and Co., CPAs",
        "Metro Manila, Philippines",
    )
    bullets_exp1 = [
        "Architect and maintain the Gamma Oracle Project Management & Cost Control platform, streamlining internal audit workflows, financial reporting, and project cost tracking for accounting teams.",
        "Implement atomic database transactions and strict access controls to prevent data discrepancy across multi-tiered corporate ledger allocations.",
        "Collaborate with certified accountants and senior partners to translate complex statutory compliance requirements into automated operational dashboards.",
    ]
    exp1_flowables = [t1, Spacer(1, 2)]
    for b in bullets_exp1:
        exp1_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    exp1_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(exp1_flowables))

    # Experience 2: Gamma Oracle
    t2 = create_item_header(
        "Software Engineering Intern",
        "February 2026 – June 2026",
        "Gamma Oracle Dimension Inc.",
        "Metro Manila, Philippines",
    )
    bullets_exp2 = [
        "Co-developed the official educational web portal for <b>Tax Leaders Circle PH (TLCPH.online)</b> alongside a fellow developer intern, servicing accredited accounting seminars nationwide.",
        "Engineered an automated certificate generator using FPDI/FPDF and a digital tax publication reader using PDF.js and Turn.js with realistic flip-book navigation.",
        "Initiated the core development of <b>BizMaker HRIS ERP</b>, transitioning payroll workflows into a scalable cloud SaaS application with automated tax calculations and timesheet synchronization.",
    ]
    exp2_flowables = [t2, Spacer(1, 2)]
    for b in bullets_exp2:
        exp2_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    exp2_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(exp2_flowables))

    # Experience 3: Freelance
    t3 = create_item_header(
        "Freelance Full-Stack Developer",
        "January 2024 – Present",
        "Self-Employed / Independent Contractor",
        "Las Piñas City, Philippines",
    )
    bullets_exp3 = [
        "<b>Michael Anthony's Fashion Inc. (MAFI):</b> Automated manual paper invoices and Delivery Receipts (DR) into structured digital records, cutting invoicing errors and administrative overhead.",
        "<b>Galaxent Perfume:</b> Designed and deployed an attendance logging and payroll calculation portal for retail personnel, reducing manual bi-weekly time reconciliation.",
        "<b>Bubble Hideout POS:</b> Engineered a standalone restaurant point-of-sale and live inventory management system in PHP/MySQL, eliminating dinner-rush order latency and automating daily cash-out reports.",
        "<b>STI OMMA Platform:</b> Built a production-ready community showcase portal for STI College multimedia artists featuring AWS S3 media uploads, Xendit payment gateways, and real-time chat.",
    ]
    exp3_flowables = [t3, Spacer(1, 2)]
    for b in bullets_exp3:
        exp3_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    exp3_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(exp3_flowables))

    from reportlab.platypus import PageBreak

    elements.append(PageBreak())

    # 5. KEY PROJECTS & HACKATHONS
    add_section_header("KEY PROJECTS & HACKATHONS")

    # Project 1: eGovPH Hackathon
    tp1 = create_item_header(
        "eGovPH National Hackathon 2026 — Team Lead / Developer",
        "July 2026",
        "Department of Information and Communications Technology (DICT)",
        "SMX Aura, BGC",
    )
    bullets_proj1 = [
        'Led 5-member team <b>"Println New Gen"</b> in a 48-hour civic-tech sprint developing verification prototypes atop official government infrastructure (eGov Single Sign-On, eVerify, and eGovPay APIs).',
        "Designed client-facing authentication flows and interfaced live with sandbox government identity verification endpoints.",
    ]
    proj1_flowables = [tp1, Spacer(1, 2)]
    for b in bullets_proj1:
        proj1_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    proj1_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(proj1_flowables))

    # Project 2: MAFI 3D Customizer
    tp2 = create_item_header(
        "MAFI 3D Custom Clothing Platform — Capstone Project Lead Developer",
        "2025",
        "Michael Anthony's Fashion Inc. / DFCAMCLP",
        "Las Piñas City",
    )
    bullets_proj2 = [
        "Led a year-long capstone converting a traditional garment manufacturer's manual sketching bottleneck into a browser-based 3D visual tailoring customizer.",
        "Allowed real-time collar, fabric, and trim configurations that generate production-ready specifications directly for pattern cutters.",
    ]
    proj2_flowables = [tp2, Spacer(1, 2)]
    for b in bullets_proj2:
        proj2_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    proj2_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(proj2_flowables))

    # Project 3: CND Upraze
    tp3 = create_item_header(
        "CND Upraze — Lead Full-Stack Architect and Developer",
        "2026",
        "Technopreneurship",
        "Academic Project",
    )
    bullets_proj3 = [
        "Architected an enterprise SaaS application uniting a React 19 frontend and a decoupled Laravel 11 protocol core, packaged in Docker for isolated local and staging environments.",
        "Integrated Groq AI for automated inference and telemetry visualization dashboards for administrative order governance.",
    ]
    proj3_flowables = [tp3, Spacer(1, 2)]
    for b in bullets_proj3:
        proj3_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    proj3_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(proj3_flowables))

    # 6. EDUCATION & LEADERSHIP
    add_section_header("EDUCATION & LEADERSHIP")

    # College
    te1 = create_item_header(
        "Bachelor of Science in Information Systems (BSIS)",
        "2022 – 2026",
        "Dr. Filemon C. Aguilar Memorial College of Las Piñas (DFCAMCLP)",
        "Magna Cum Laude",
    )
    bullets_edu1 = [
        "<b>Graphic Artist Society:</b> Elected Auditor (2025 – 2026); served as Level Representative (2023 – 2025), coordinating campus creative workshops and managing organizational inventory."
    ]
    edu1_flowables = [te1, Spacer(1, 2)]
    for b in bullets_edu1:
        edu1_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    edu1_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(edu1_flowables))

    # High School
    te2 = create_item_header(
        "High School Diploma — TVL-ICT Track",
        "2016 – 2022",
        "De La Salle Santiago Zobel School – BRafeNHS",
        "Muntinlupa City",
    )
    bullets_edu2 = [
        "Senior High School Technical-Vocational-Livelihood (TVL-ICT Track, 2020–2022) &nbsp;&bull;&nbsp; Junior High School (2016–2020)."
    ]
    edu2_flowables = [te2, Spacer(1, 2)]
    for b in bullets_edu2:
        edu2_flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", style_bullet))
    edu2_flowables.append(Spacer(1, 3))
    elements.append(KeepTogether(edu2_flowables))

    # 7. CERTIFICATIONS & ACCREDITATIONS
    add_section_header("CERTIFICATIONS & ACCREDITATIONS")
    certs = [
        "<b>Junior Cybersecurity Analyst Career Path</b> &nbsp;&bull;&nbsp; Cisco Networking Academy (2026)",
        "<b>Cyber Threat Management</b> &nbsp;&bull;&nbsp; Cisco Networking Academy (2026)",
        "<b>Network Defense</b> &nbsp;&bull;&nbsp; Cisco Networking Academy (2026)",
        "<b>Endpoint Security & Introduction to Cybersecurity</b> &nbsp;&bull;&nbsp; Cisco Networking Academy (2026)",
        "<b>Networking Devices & Configuration &nbsp;&bull;&nbsp; Network Support</b> &nbsp;&bull;&nbsp; Cisco Networking Academy (2026)",
        "<b>AI Fundamentals: Foundations for Understanding AI</b> &nbsp;&bull;&nbsp; IBM SkillsBuild & Cisco (2026)",
        "<b>Data Science Essentials with Python &nbsp;&bull;&nbsp; Data Analytics Essentials</b> &nbsp;&bull;&nbsp; Cisco (2026)",
        "<b>Python Essentials (1 & 2) &nbsp;&bull;&nbsp; JavaScript Essentials (1 & 2)</b> &nbsp;&bull;&nbsp; Cisco & OpenEDG (2026)",
        "<b>Intellectual Property Rights for Freelancers</b> &nbsp;&bull;&nbsp; DICT Region 2 (2026) &nbsp;&bull;&nbsp; <b>Cyber-Shield</b> &nbsp;&bull;&nbsp; DICT Region 8 (2026)",
    ]
    for c in certs:
        elements.append(Paragraph(f"&bull;&nbsp;&nbsp;{c}", style_bullet))

    doc.build(elements)
    print(f"Successfully generated non-HTML ReportLab PDF: {output_path}")


if __name__ == "__main__":
    out = os.path.join(
        os.path.dirname(__file__),
        "..",
        "public",
        "Mark_Reizel_Vincent_Palma_Resume.pdf",
    )
    out = os.path.abspath(out)
    create_resume(out)
