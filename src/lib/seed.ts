import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const legacyData = {
    experiences: [
        {
            company: "Justice4.0",
            role: "Software Engineer (Inference) — Helsinki, Finland (Remote)",
            location: "Istanbul, Turkey",
            date: "Aug 2025 – Present",
            description: [
                "Engineering the complete RAG pipeline: from ingesting raw legal PDFs to serving scalable AI responses via FastAPI.",
                "Implemented strict source-verification logic to ensure zero-hallucination legal advice."
            ]
        },
        {
            company: "Tigflo",
            role: "Software Architect — Sharjah, UAE (Remote)",
            location: "Istanbul, Turkey",
            date: "Dec 2024 – Present",
            description: [
                "Led the migration of legacy frontends to a unified modern stack, reducing technical debt and accelerating feature release cycles by 40%.",
                "Developed 500+ reusable components supporting light/dark modes."
            ]
        }
    ],
    projects: [
        {
            title: "SnowLex — AI Legal Research Platform",
            shortDescription: "Next-Gen AI Legal Assistant with RAG & Vector Search.",
            longDescription: "SnowLex is an advanced LegalTech AI platform designed to revolutionize legal research. It utilizes a RAG (Retrieval-Augmented Generation) architecture to provide instant, citation-backed answers from Finnish and EU law.",
            features: [
                "Hybrid Search Engine indexing 2M+ vectors",
                "Source-verifying Citations",
                "Ollama-driven Local Inference",
                "Next.js Dashboard for Law Firms"
            ],
            challenge: "Processing millions of legal documents while ensuring 100% accuracy and citation-backed extraction without hallucinations.",
            impact: "90% reduction in research time | 100% Citation Accuracy | Local LLM Privacy",
            journey: [
                { title: "The Vision", description: "Identifying the bottleneck in legal research for law firms in Helsinki." },
                { title: "Retrieval Architecture", description: "Designing a hybrid Qdrant vector search for high-precision law retrieval." },
                { title: "Local Inference", description: "Integrating Ollama for data privacy, ensuring no client data leaves the law firm." }
            ],
            techStack: ["nextjs", "python", "fastapi", "qdrant", "ollama"],
            projectLink: "https://snowlex.fi",
            images: [
                "/images/projects/Snowlex.png",
                "/images/projects/Snowlex_architecture.png",
                "/images/projects/Snowlex_search.png"
            ]
        },
        {
            title: "Tigflo — Healthcare Design System",
            shortDescription: "Unified Design System for Healthcare Ecosystems.",
            longDescription: "A comprehensive Design System and component library unifying healthcare products across Web and Mobile. Acting as Software Architect, I established the governance for code quality and UI consistency.",
            features: [
                "500+ Reusable Components",
                "WCAG Accessibility Standards",
                "Light & Dark Mode Support",
                "Cross-platform Sync (Next.js & Flutter)"
            ],
            challenge: "Maintaining UI consistency across multiple specialized healthcare platforms while ensuring accessibility for medical professionals.",
            impact: "40% Faster Release Cycles | 0 Design Debt | WCAG Compliant",
            journey: [
                { title: "Audit & Cleanup", description: "Consolidating 15+ different button styles into a single source of truth." },
                { title: "The Library", description: "Building a robust, themeable component library in React and Flutter." },
                { title: "The Result", description: "Empowering 5 separate dev teams to ship accessible UI with zero friction." }
            ],
            techStack: ["nextjs", "flutter", "react", "figma", "ts"],
            projectLink: "https://mohammad-soqar.github.io/Portfolio-/",
            images: [
                "/images/projects/Reson8.png",
                "/images/projects/Tigflo_mobile.png"
            ]
        }
    ],
    profile: [
        {
            name: "Mohammad Ahmad",
            role: "Software Engineer",
            email: "mnsoqar1@gmail.com",
            phone: "+90 5xx xxx xxxx",
            location: "Istanbul, Turkey",
            aboutMe: "I am a software engineer specializing in full-stack development and AI integration. I transform complex requirements into pixel-perfect, scalable applications.",
            catchyPhrase: "Engineering clarity into complex systems.",
            cvLink: "https://drive.google.com/file/d/1B26dn1iOQZxrNHsEaXNI_oM7pbvPlKcY/view",
            profilePic: "",
            githubContributions: "2k+",
            experienceYears: "2+",
            projectsDone: "14+"
        }
    ]
};

export async function seedLegacyData() {
    const expRef = collection(db, "experiences");
    const projRef = collection(db, "projects");
    const profRef = collection(db, "profile");

    // Check if projects are already seeded
    const q = query(projRef, limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("Seeding legacy data...");
        for (const exp of legacyData.experiences) {
            await addDoc(expRef, { ...exp, createdAt: new Date().toISOString() });
        }
        for (const proj of legacyData.projects) {
            await addDoc(projRef, { ...proj, createdAt: new Date().toISOString() });
        }

        // Check if profile exists
        const pSnap = await getDocs(profRef);
        if (pSnap.empty) {
            for (const prof of legacyData.profile) {
                await addDoc(profRef, { ...prof, createdAt: new Date().toISOString() });
            }
        }
        return true;
    }
    return false;
}
