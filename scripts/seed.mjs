import { mkdirSync, writeFileSync } from 'node:fs';

const pDir = 'src/content/projects';
const cDir = 'src/content/credentials';
const nDir = 'src/content/notes';

[pDir, cDir, nDir].forEach((d) => mkdirSync(d, { recursive: true }));

const write = (path, fm) => writeFileSync(path, `---\n# seed\n${fm.trim()}\n---\nPlaceholder. Replace with your own content.\n`);

// 12 Projects
const projects = [
  { id: 'attendance-tracker', title: 'Attendance tracker', date: '2022-11-15', feat: false, skills: ['JavaScript', 'SQL'], rel: [] },
  { id: 'library-catalog', title: 'Library catalog', date: '2023-04-15', feat: false, skills: ['SQL', 'HTML/CSS'], rel: ['credentials/cisco-03'] },
  { id: 'student-portal', title: 'Student portal prototype', date: '2023-09-15', feat: false, skills: ['JavaScript', 'HTML/CSS'], rel: [] },
  { id: 'network-inventory', title: 'Network inventory', date: '2024-02-15', feat: false, skills: ['Python', 'Networking'], rel: ['credentials/cisco-networking-essentials'] },
  { id: 'shop-inventory', title: 'Shop inventory system', date: '2024-09-15', feat: false, skills: ['SQL', 'JavaScript'], rel: [] },
  { id: 'enrollment-system', title: 'Enrollment system', date: '2024-12-15', feat: true, skills: ['SQL', 'HTML/CSS', 'JavaScript'], rel: ['credentials/seminar-2'] },
  { id: 'clinic-booking', title: 'Clinic booking', date: '2025-03-15', feat: false, skills: ['JavaScript', 'SQL'], rel: [] },
  { id: 'payroll-helper', title: 'Payroll helper', date: '2025-05-15', feat: false, skills: ['Python', 'SQL'], rel: [] },
  { id: 'queue-display', title: 'Queue display', date: '2025-08-15', feat: false, skills: ['JavaScript', 'HTML/CSS'], rel: [] },
  { id: 'capstone-system', title: 'Capstone system', date: '2025-10-15', feat: true, skills: ['SQL', 'Security', 'JavaScript'], rel: ['credentials/cisco-cybersecurity-essentials'] },
  { id: 'school-records', title: 'School records', date: '2026-01-15', feat: false, skills: ['SQL', 'HTML/CSS'], rel: [] },
  { id: 'delivery-tracker', title: 'Delivery tracker', date: '2026-04-15', feat: true, skills: ['JavaScript', 'SQL', 'Python'], rel: [] },
];

for (const p of projects) {
  write(`${pDir}/${p.id}.md`, `title: "${p.title}"\ndate: "${p.date}"\nskills: ${JSON.stringify(p.skills)}\nrelated: ${JSON.stringify(p.rel)}\noutcome: "Placeholder: what it did, for whom."\nfeatured: ${p.feat}`);
}

// 12 Cisco cluster certificates
const ciscoDates = ['2022-10', '2022-12', '2023-02', '2023-03', '2023-05', '2023-06', '2023-08', '2023-11', '2024-01', '2024-03', '2024-04', '2024-06'];
const ciscoSkills = ['Security', 'Networking', 'Python'];

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const d = `${ciscoDates[i - 1]}-15`;
  const s = ciscoSkills[(i - 1) % 3];
  write(`${cDir}/cisco-${pad}.md`, `title: "Cisco certificate ${i}"\ndate: "${d}"\nskills: ["${s}"]\nrelated: []\nkind: "certificate"\nissuer: "Cisco Networking Academy"\ncluster: { id: "cisco", label: "Cisco" }\nhighlight: false`);
}

// 2 Cisco Highlights
write(`${cDir}/cisco-networking-essentials.md`, `title: "Networking essentials"\ndate: "2023-01-15"\nskills: ["Networking"]\nrelated: []\nkind: "certificate"\nissuer: "Cisco Networking Academy"\ncluster: { id: "cisco", label: "Cisco" }\nhighlight: true`);
write(`${cDir}/cisco-cybersecurity-essentials.md`, `title: "Cybersecurity essentials"\ndate: "2023-10-15"\nskills: ["Security"]\nrelated: []\nkind: "certificate"\nissuer: "Cisco Networking Academy"\ncluster: { id: "cisco", label: "Cisco" }\nhighlight: true`);

// 3 Seminars
write(`${cDir}/seminar-1.md`, `title: "Seminar 1"\ndate: "2024-08-15"\nskills: ["Security"]\nrelated: []\nkind: "seminar"\nissuer: "Seminar host (placeholder)"\nhighlight: false`);
write(`${cDir}/seminar-2.md`, `title: "Seminar 2"\ndate: "2025-02-15"\nskills: ["JavaScript"]\nrelated: []\nkind: "seminar"\nissuer: "Seminar host (placeholder)"\nhighlight: false`);
write(`${cDir}/seminar-3.md`, `title: "Seminar 3"\ndate: "2025-11-15"\nskills: ["SQL"]\nrelated: []\nkind: "seminar"\nissuer: "Seminar host (placeholder)"\nhighlight: false`);

// 4 Notes
write(`${nDir}/seminar-1-takeaways.md`, `title: "What I took from seminar 1"\ndate: "2024-09-15"\nskills: ["Security"]\nrelated: ["credentials/seminar-1"]\ndraft: false`);
write(`${nDir}/seminar-2-takeaways.md`, `title: "What I took from seminar 2"\ndate: "2025-03-15"\nskills: ["JavaScript"]\nrelated: ["credentials/seminar-2"]\ndraft: false`);
write(`${nDir}/seminar-3-takeaways.md`, `title: "What I took from seminar 3"\ndate: "2025-12-15"\nskills: ["SQL"]\nrelated: ["credentials/seminar-3"]\ndraft: false`);
write(`${nDir}/two-years-of-freelance-systems.md`, `title: "What two years of freelance systems taught me"\ndate: "2026-08-15"\nskills: ["SQL", "JavaScript"]\nrelated: ["projects/enrollment-system", "projects/delivery-tracker"]\ndraft: false`);

console.log('Seeded 33 markdown files across projects, credentials, and notes.');
