// One-off seed: `node scripts/seed.ts` (Node 22.6+ strips types natively).
// Sources: ~/Downloads/mainresume.pdf (Sep 2026, base), ~/Downloads/Ujesh-Ai.pdf (AI variant), github.com/UJESH2K READMEs.
// Refuses to overwrite an existing data/resume-db.json unless --force is passed.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { blankVariant, newBullet, selectByTags, SECTION_ORDER } from "../lib/sections.ts";
import type { Bullet, Db, SectionKey, Variant } from "../lib/types.ts";

const out = new URL("../data/resume-db.json", import.meta.url);
if (existsSync(out)) {
  // The library is edited by hand in the app; regenerating it throws those edits away.
  if (!process.argv.includes("--i-know-this-erases-my-library")) {
    console.error(
      "data/resume-db.json already exists.\n" +
        "Re-seeding REPLACES your whole library (every edit, deletion and new entry).\n" +
        "If you really mean it: node scripts/seed.ts --i-know-this-erases-my-library"
    );
    process.exit(1);
  }
  const dir = new URL("../data/backups/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const to = new URL(`resume-db-before-reseed-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, dir);
  copyFileSync(out, to);
  console.warn("Backed up the old library to data/backups/");
}

let n = 0;
/** Bullet with optional tags: B("text") or B("text", ["ai"]) */
const b = (text: string, tags?: string[]): Bullet => ({ ...newBullet(text), id: `b_${++n}`, ...(tags ? { tags } : {}) });
const GH = "https://github.com/UJESH2K/";
const SWE = ["sde", "fullstack", "backend", "cloud", "freelance", "web3"];

const db: Db = {
  rev: 0,
  profile: {
    name: "Ujesh Kumar Yadav",
    phone: "+91 8867346693",
    email: "ujeshyadav20k5@gmail.com",
    linkedin: "https://www.linkedin.com/in/ujesh-kumar-yadav/",
    github: "https://github.com/UJESH2K",
    portfolio: "",
    location: "Bengaluru, India",
  },

  summary: [
    {
      id: "sum_swe",
      text:
        "Software engineer shipping production full-stack features (React, Next.js, Node.js) and applied AI/ML on AWS. Built and deployed features end to end at two startups, working directly with founders. Winner of 4 national hackathons.",
      tags: SWE,
    },
    {
      id: "sum_ai",
      text:
        "AI/ML engineer building production systems across computer vision, LLMs and RAG. Owned AI features end to end at two startups, from dataset and model work through AWS deployment. Winner of 4 national hackathons.",
      tags: ["ai", "ml", "llm"],
    },
  ],

  education: [
    {
      id: "edu_atria",
      institution: "Atria Institute of Technology (VTU), Bengaluru",
      link: "",
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      start: "2023",
      end: "Present",
      score: "CGPA: 7.7/10",
      location: "Bengaluru, India",
      bullets: [
        b(
          "Relevant coursework: Data Structures & Algorithms, OOP, Operating Systems, Computer Networks, DBMS, Artificial Intelligence, Machine Learning, Cloud Computing."
        ),
      ],
      tags: ["all"],
      note: "CGPA was 7.55 on mainresume.pdf and 8.0 on Ujesh-Ai.pdf; set to 7.7 per your latest message. Update each semester. Institution inferred from USN 1AT23CS172 + Code Club at Atria — confirm.",
    },
  ],

  experience: [
    {
      id: "exp_easemed",
      company: "EaseMed (Healthcare Startup)",
      companyLink: "https://easemed.in/",
      role: "Full Stack Developer Intern",
      kind: "Internship",
      start: "Jan 2026",
      end: "Jun 2026",
      location: "Bengaluru, India",
      bullets: [
        b(
          "Built and shipped a **disease-outbreak prediction model** as the sole engineer on the feature, correlating global trade data with WHO and government health APIs to generate inventory-risk guardrails."
        ),
        b(
          "Developed a **serverless data-ingestion pipeline** (Node.js, Supabase, Hugging Face-hosted parser) validated for reliable operation with 10-20 concurrent users during testing.",
          SWE
        ),
        b(
          "Built a **WebSocket**-based real-time messaging backend connecting hospital and vendor users, with a responsive React/Next.js frontend; implemented authentication and **role-based access control** end-to-end.",
          SWE
        ),
        b(
          "Built **RAG pipelines** for context-aware medical question answering, ingesting prescriptions, lab reports and clinical PDFs into searchable vector representations.",
          ["ai", "ml", "llm"]
        ),
        b(
          "Developed AI inference services integrating LLM APIs, embedding models and semantic search; deployed on **AWS EC2/S3**, Nginx, PM2 and Vercel.",
          ["ai", "llm", "cloud"]
        ),
      ],
      tags: ["all"],
      note: "Ujesh-Ai.pdf lists this as 'AI Engineer Intern, Dec 2025 – May 2026'. Pick one title/date range and keep it consistent across resumes.",
    },
    {
      id: "exp_edactly",
      company: "Edactly (EdTech Platform)",
      companyLink: "https://beta.edactly.com/",
      role: "Freelance Full Stack Developer",
      kind: "Freelance",
      start: "2026",
      end: "Present",
      location: "Remote",
      bullets: [
        b(
          "Built an **AI pipeline** (Python, Manim, Matplotlib) that generates explainer videos directly from natural-language prompts, backed by a **RAG pipeline** with a vector database over NCERT grades 1-12 curriculum content."
        ),
        b(
          "Cleaned and re-labeled a ~5,000-prompt dataset, removing low-quality entries and adding ~1,000 new data points to improve generation quality.",
          ["ai", "ml", "llm", "freelance"]
        ),
        b("Deployed the pipeline on **AWS (S3, Lambda)**, generating a 3-minute video in ~5 minutes at roughly ₹7 compute cost per video."),
        b("Implemented authentication, user management and scalable APIs for the platform's dashboards and content workflows.", SWE),
      ],
      tags: ["all"],
      note: "Ujesh-Ai.pdf titles this 'AI Software Engineer — Edactly'.",
    },
    {
      id: "exp_hitachi",
      company: "Hitachi",
      companyLink: "",
      role: "Machine Learning Intern",
      kind: "Internship",
      start: "2025 (3 months)",
      end: "",
      location: "",
      bullets: [
        b(
          "Led a student team building a ~600-image dataset for a **bird-species computer-vision** project, personally capturing images and owning model development, data labeling (Label Studio) and pipeline design end-to-end."
        ),
        b(
          "Performed dataset preprocessing, annotation validation and quality assurance to improve downstream model performance for biodiversity monitoring.",
          ["ai", "ml"]
        ),
      ],
      tags: ["all"],
      note: "mainresume.pdf links a 'Training notebook' — paste its URL into the first bullet as [Training notebook](url).",
    },
  ],

  projects: [
    {
      id: "proj_gradmesh",
      name: "GradMesh — Decentralized GPU Computing Platform",
      tech: "Python, CUDA, FastAPI, PyTorch, YOLO",
      date: "",
      codeLink: GH + "Gradmesh-v4",
      liveLink: "",
      bullets: [
        b(
          "Built a distributed GPU platform that aggregates idle GPUs from multiple machines into one compute network, with a **coordinator-worker architecture** for registration, workload distribution and result aggregation."
        ),
        b(
          "Benchmarked distributed inference across **4 GPU nodes** using a FastAPI coordination layer, achieving up to **1.8x speedup** over single-node execution (network-dependent)."
        ),
        b("Ran round-synchronised **YOLO** training across peers with **FedAvg** weight aggregation.", ["ai", "ml", "distributed"]),
        b(
          "Replaced even dataset splits with **capability-aware scheduling** that benchmarks each device and sizes its work, so rounds no longer wait on the slowest GPU; host setup reduced to one command.",
          ["systems", "distributed", "cloud", "sde"]
        ),
      ],
      tags: ["all"],
    },
    {
      id: "proj_worldforge",
      name: "WorldForge AI — Real-Time World Generation",
      tech: "React, Three.js, TypeScript, WebGL",
      date: "",
      codeLink: GH + "INception-2",
      liveLink: "https://i-nception-2.vercel.app",
      bullets: [
        b(
          "Built a browser-based game engine at **India's First World Model Hackathon (Inception — winner)** that procedurally generates game worlds from natural-language prompts, synthesizing environments, terrain and NPCs in real time."
        ),
        b(
          "Designed an AI-driven runtime for procedural world generation, adaptive boss encounters and persistent real-time gameplay without pre-built assets.",
          ["ai", "llm"]
        ),
      ],
      tags: ["all"],
      note: "The INception-2 README now describes a robot-policy evaluation platform; check the links point to the world-engine version.",
    },
    {
      id: "proj_buyorwait",
      name: "Buy or Wait? — HackerRank Orchestrate",
      tech: "Python, Claude API, Vision LLMs",
      date: "Sep 2026",
      codeLink: GH + "Hackerrank-september2026-orchestrate",
      liveLink: "",
      bullets: [
        b("Built a **deterministic financial decision engine** scored field-by-field against hidden ground truth (amounts, dates, payment plans)."),
        b(
          "Designed a narrow **LLM perception layer** that turns messages and bill images into typed amendments from a closed schema, so **prompt injection cannot change a decision**."
        ),
        b("Read blank-amount bill images with **two independent models** plus caching for reproducible, verifiable output."),
      ],
      tags: ["ai", "llm", "backend"],
      note: "Add result/rank.",
    },
    {
      id: "proj_memoryglasses",
      name: "Memory Glasses — AI Wearable Memory",
      tech: "Python, FastAPI, Ollama, LLaVA, SigLIP, Qdrant",
      date: "",
      codeLink: GH + "embd",
      liveLink: "",
      bullets: [
        b(
          "Wearable assistant that captures frames from a webcam or **ESP32-CAM** and answers questions like *Where did I leave my charger?* using **RAG** over a vector DB."
        ),
        b("Used **SigLIP** image embeddings and cosine-similarity scene-boundary detection so the vision model only summarises unique scenes."),
        b(
          "Runs fully locally: **LLaVA** structured scene JSON, nomic-embed-text embeddings in **Qdrant**, **Llama 3.2** daily summaries and a FastAPI Q&A service."
        ),
      ],
      tags: ["ai", "ml", "llm", "cv", "rag", "iot"],
    },
    {
      id: "proj_blinky",
      name: "Blinky — Intent-aware Focus Assistant",
      tech: "TypeScript, Next.js, Groq, Ollama",
      date: "",
      codeLink: GH + "ADHD-hack",
      liveLink: "https://hhhs-smoky.vercel.app",
      bullets: [
        b("Remembers the one task you sat down to do, detects drift from screen activity and sends the reminder to the device that pulled you away."),
        b(
          "**Privacy by schema**: frames are analysed then discarded and only text descriptions are stored; local frame diffing skips unchanged screens to cut model cost."
        ),
        b("**Groq** vision readings in about 1s with an **Ollama** local fallback for offline or rate-limited use; detects task completion so reminders stop on their own."),
      ],
      tags: ["ai", "llm", "fullstack"],
    },
    {
      id: "proj_naturaljson",
      name: "Natural-JSON — AI Trading Agent on Cardano",
      tech: "TypeScript, Next.js, LLMs, Cardano",
      date: "",
      codeLink: GH + "Natural-Json",
      liveLink: "",
      bullets: [
        b("AI agent that turns plain English (*buy 10 ADA every 5 seconds and email me*) into **executable workflows** run on **Cardano**."),
        b("Streams live trades and notifications in real time, with a chat-style history of every agent the user has created."),
      ],
      tags: ["ai", "llm", "web3"],
    },
    {
      id: "proj_gitpay",
      name: "GitPay — Crypto Payouts for Open Source",
      tech: "React, Tailwind CSS, Node.js, Express, Solana",
      date: "",
      codeLink: GH + "Gitpay",
      liveLink: "",
      bullets: [
        b("Decentralised reward platform that pays contributors in **USDC on Solana** directly from GitHub: code → merge → reward."),
        b("A **GitHub App** tracks contributions, **smart contracts** make payouts trustless, and a dashboard keeps reward history transparent."),
      ],
      tags: ["web3", "fullstack", "backend"],
      note: "Built for Dev Dinova (Solana track)? If so, mention the win here.",
    },
    {
      id: "proj_blockparty",
      name: "BlockParty — GitHub Bounty Marketplace",
      tech: "React, Node.js, Clerk, GitHub Webhooks",
      date: "",
      codeLink: GH + "GitBounty",
      liveLink: "https://blockparty-backend.vercel.app",
      bullets: [
        b("Bounty marketplace that automates bounty creation through contributor reward, with GitHub OAuth (Clerk) and **role-based access**."),
        b("Creates repository **webhooks** automatically, monitors pull requests in real time and completes bounties when a PR is merged."),
      ],
      tags: ["web3", "fullstack", "backend"],
      note: "Team project — note your role.",
    },
    {
      id: "proj_dryp",
      name: "DR-YP — Fashion E-commerce App",
      tech: "React Native, Node.js, Express, MongoDB",
      date: "",
      codeLink: GH + "DRYP-store",
      liveLink: "https://dryp-store-sable.vercel.app",
      bullets: [
        b("Mobile-first fashion e-commerce app with separate **customer** and **vendor** experiences."),
        b("Style-preference onboarding for personalisation, plus product search with brand, category and price filters, a wishlist and a cart."),
        b("Vendor dashboard for product CRUD, search and store-profile management."),
      ],
      tags: ["sde", "fullstack", "mobile", "freelance"],
    },
    {
      id: "proj_bnbagents",
      name: "Agents Playground — On-chain AI Trading",
      tech: "Node.js, Express, BNB Chain",
      date: "",
      codeLink: GH + "CRYPTO-AGENT-TRAINING",
      liveLink: "https://crypto-agent-training.vercel.app",
      bullets: [
        b("AI trading agents (arbitrage, mean-reversion, momentum) competing on **prediction markets** fully on-chain on **BNB Chain**."),
        b("Node.js orchestrator with a synthetic market simulator and a REST API powering a live dashboard."),
      ],
      tags: ["ai", "web3"],
    },
    {
      id: "proj_attest",
      name: "Consent-Search Attestation",
      tech: "Python, OpenCV, Merkle Trees, Ethereum",
      date: "",
      codeLink: GH + "SocialMatcher",
      liveLink: "",
      bullets: [
        b(
          "Pipeline proving cryptographically that consent existed before a face search, that the search set was fixed in advance, and that every result (including nulls) is unaltered."
        ),
        b("Builds a **Merkle tree** of per-search leaves anchored **on-chain** (Sepolia), with a standalone bundle verifier."),
      ],
      tags: ["security", "web3", "cv"],
    },
    {
      id: "proj_waterleak",
      name: "Smart Water Leak Detection",
      tech: "Python, scikit-learn, Streamlit, Folium, Groq",
      date: "",
      codeLink: GH + "pipe_leak",
      liveLink: "",
      bullets: [
        b("ML leak detection on IoT sensor data (pressure, flow, vibration, temperature), comparing Random Forest, Decision Tree, Logistic Regression and SVM."),
        b("**Streamlit** dashboard with what-if simulation, batch CSV prediction, GIS zone maps and a **Groq LLaMA** assistant for maintenance insights."),
      ],
      tags: ["ml", "data", "iot"],
    },
    {
      id: "proj_disaster",
      name: "Natural Disaster Prediction",
      tech: "Python, scikit-learn, Flask",
      date: "",
      codeLink: GH + "Natural-disaster-prediction-",
      liveLink: "",
      bullets: [
        b("ML models on environmental data for early warning of floods, wildfires and earthquakes, served through **Flask**."),
        b("Earthquake model trained on **14,698** seismic events from the Hindu Kush region, with feature selection and null-value imputation."),
      ],
      tags: ["ml", "data"],
    },
    {
      id: "proj_leadgen",
      name: "LeadGen — Tender Intelligence",
      tech: "Python, Web Scraping, Data Pipelines",
      date: "",
      codeLink: GH + "leadgen",
      liveLink: "",
      bullets: [
        b("Lead-generation pipeline for healthcare suppliers across Indian procurement portals, with pluggable source adapters (API, CSV, scraper) and a normalised schema."),
        b("Scores tenders against a business profile (keywords, states, tender value, closing window) and exports ranked leads for outreach."),
      ],
      tags: ["backend", "data", "freelance"],
    },
  ],

  skills: [
    { id: "sk_lang", category: "Languages", items: "JavaScript, TypeScript, Python, C++, C, SQL", tags: ["all"] },
    { id: "sk_core", category: "Core CS", items: "Data Structures & Algorithms, OOP, Operating Systems, Computer Networks, DBMS", tags: SWE },
    { id: "sk_front", category: "Frontend", items: "React.js, Next.js, Redux, HTML5, CSS3, Tailwind CSS", tags: SWE },
    {
      id: "sk_back",
      category: "Backend & Architecture",
      items: "Node.js, Express.js, REST APIs, WebSockets, Microservices, JWT Authentication",
      tags: SWE,
    },
    {
      id: "sk_aiml_short",
      category: "AI/ML",
      items: "Machine Learning fundamentals, RAG pipelines, Vector Databases, Computer Vision, Prompt Engineering",
      tags: SWE,
    },
    {
      id: "sk_ai",
      category: "AI & Deep Learning",
      items: "PyTorch, TensorFlow, OpenCV, YOLO, MobileNet, MediaPipe, Computer Vision, Transfer Learning",
      tags: ["ai", "ml"],
    },
    {
      id: "sk_genai",
      category: "Generative AI",
      items: "LLMs, RAG, LangChain, Prompt Engineering, Semantic Search, Embedding Models, AI Agents, Ollama",
      tags: ["ai", "llm"],
    },
    {
      id: "sk_ml",
      category: "Machine Learning",
      items: "scikit-learn, NumPy, Pandas, Feature Engineering, Model Evaluation, Object Detection",
      tags: ["ai", "ml"],
    },
    { id: "sk_db", category: "Databases", items: "MongoDB, PostgreSQL, MySQL, Prisma ORM, Firebase, Qdrant", tags: ["all"] },
    {
      id: "sk_cloud",
      category: "Cloud & DevOps",
      items: "AWS (EC2, S3, Lambda, CloudFront), Docker, Nginx, Vercel, GitHub Actions, Linux",
      tags: ["all"],
    },
    { id: "sk_web3", category: "Web3", items: "Solana, Cardano, BNB Chain, Smart Contracts", tags: ["web3"] },
    {
      id: "sk_tools",
      category: "Tools",
      items: "Git, GitHub, Postman, VS Code, Jupyter, AI coding tools (Copilot, Cursor, Claude Code)",
      tags: ["all"],
    },
  ],

  awards: [],

  achievements: [
    { id: "ach_inception", text: "**Winner** — Inception: India's First World Model Hackathon.", tags: ["all"] },
    { id: "ach_devdinova", text: "**Winner** — Dev Dinova International Blockchain Hackathon (Solana Track).", tags: ["all"] },
    { id: "ach_cypher", text: "**Winner** — Cypher 1 & Cypher 3 Hackathons, Atria Institute of Technology.", tags: ["all"] },
    {
      id: "ach_finalist",
      text: "**Finalist in 15+ national hackathons**; Regional Qualifier, Google Solution Challenge India; ICPC regional prelims qualifier (2x).",
      tags: ["all"],
      note: "Ujesh-Ai.pdf says 10+ finalist — confirm the count.",
    },
    {
      id: "ach_github",
      text: "Built and shipped **65+ public projects** on [GitHub](https://github.com/UJESH2K) across AI/ML, distributed systems and Web3.",
      tags: ["all"],
    },
  ],

  leadership: [
    {
      id: "lead_codeclub",
      title: "Technical Lead — Code Club, Atria Institute of Technology",
      link: "",
      date: "2024 – Present",
      subtitle: "",
      org: "",
      bullets: [
        b(
          "Lead full-stack development initiatives for a **200+ member** community; mentor students on architecture, backend engineering and deployment."
        ),
        b("Conduct code reviews, technical design sessions and project mentoring from ideation to production deployment.", ["ai", "sde"]),
      ],
      tags: ["all"],
      note: "Ujesh-Ai.pdf says 2023 – Present.",
    },
    {
      id: "lead_vigyan",
      title: "Organizer — Vigyan Rang Tech Fest",
      link: "",
      date: "",
      subtitle: "",
      org: "",
      bullets: [
        b(
          "Organized a college-wide tech fest (~₹5L budget) with a QR-based registration/shortlisting system for **1,000+ applicants** and 5 hackathons for 500+ participants each."
        ),
        b("Built real-time full-stack tools for multiple departments, including a live IPL-auction simulation platform.", SWE),
      ],
      tags: ["all"],
      note: "Add the year.",
    },
    {
      id: "lead_gdg",
      title: "Google Developer Group (GDG) On Campus",
      link: "",
      date: "2023 – 2024",
      subtitle: "",
      org: "",
      bullets: [b("Participated in AI/ML technical sessions and completed Google Cloud training.")],
      tags: ["all"],
      note: "Ujesh-Ai.pdf calls this 'AI Lead' (led workshops, mentored students). mainresume.pdf says participant. Pick the accurate one.",
    },
  ],

  certifications: [],
  variants: [],
};

// Industry-standard order. Builder has a one-click swap to put Skills above Experience on 2-page resumes.
const ORDER: SectionKey[] = ["summary", "education", "experience", "skills", "projects", "leadership", "achievements", "certifications", "awards"];
const TITLES: Partial<Record<SectionKey, string>> = {
  skills: "Technical Skills",
  experience: "Experience",
  achievements: "Achievements",
  leadership: "Leadership",
};

function mk(name: string, description: string, targetTags: string[], accent: string, maxProjects?: number): Variant {
  const base = blankVariant(db, name);
  base.sections = ORDER.map((k) => ({ ...base.sections.find((s) => s.key === k)!, title: TITLES[k] ?? base.sections.find((s) => s.key === k)!.title }));
  const v = selectByTags(db, { ...base, description, targetTags, accent });
  if (maxProjects) {
    const p = v.sections.find((s) => s.key === "projects")!;
    p.items = p.items.slice(0, maxProjects);
  }
  return v;
}

const main = mk("Main (SDE)", "Replica of mainresume.pdf", ["sde", "fullstack", "backend", "cloud"], "1F3A5F");
main.sections.find((s) => s.key === "projects")!.items = ["proj_gradmesh", "proj_worldforge"];

db.variants = [
  main,
  mk("AI / ML Engineer", "AI, ML, LLM roles", ["ai", "ml", "llm"], "1F3A5F", 4),
  mk("Full-stack / SDE", "Product engineering roles", ["sde", "fullstack", "backend"], "2B4C9B", 4),
  mk("Cloud / Systems", "Cloud, infra, distributed systems", ["cloud", "systems", "distributed"], "0F5E63", 3),
  mk("Web3", "Blockchain roles & bounties", ["web3"], "553C7B", 4),
  mk("Freelance", "Client work & gigs", ["freelance", "fullstack"], "22543D", 3),
  mk("Everything", "Every item in the library — trim from here", [], "2D2D2D"),
];

if (SECTION_ORDER.length !== ORDER.length) console.warn("Section order list is missing a section");
writeFileSync(out, JSON.stringify({ ...db, rev: undefined }, null, 2) + "\n");
console.log("Seeded data/resume-db.json");
