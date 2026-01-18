export const data = {
  Images: {
    profilePic: "./images/MohammadSoqar.png",
    star: "./images/Star.png",
    WebsiteBackground: "./images/Background.png",

    // 🛠️ NEW TECH ICONS (Add these images to your folder)
    qdrant: "./images/tech/Qdrant.png",  // NEW
    ollama: "./images/tech/Ollama.png",  // NEW
    fastapi: "./images/tech/FastAPI.png", // NEW
    jsmastery: "./images/tech/jsmastery.png", // NEW (Optional, or use Next.js icon)

    // Existing Tech
    nextjs: "./images/tech/nextjs.png",
    nodejs: "./images/tech/Nodejs.png",
    flutter: "./images/tech/Flutter.png",
    aws: "./images/tech/aws.png",
    ts: "./images/tech/ts.png",
    pgsql: "./images/tech/pgsql.png",
    figma: "./images/tech/Figma.png",
    Google_cloud: "./images/tech/GoogleCloud.png",
    firebase: "./images/tech/FireBase.png",
    python: "./images/tech/Python.png",
    chatgpt: "./images/tech/ChatGPT.png",
    react: "./images/tech/React.png",
    aspnet: "./images/tech/Aspnet.png",
    dart: "./images/tech/Dart.png",
    mongodb: "./images/tech/Mongodb.png",
    git: "./images/tech/Git.png",
    github: "./images/tech/Github.png",
    illustrator: "./images/tech/illustrator.png",
    photoshop: "./images/tech/PhotoShop.png",
    docker: "./images/tech/Docker.png", // Recommended addition
  },

  projects: [
    {
      id: "snowlex",
      title: "SnowLex — AI Legal Research Platform",
      types: ["AI", "RAG", "Full Stack"], // Enhanced tags
      // 🚀 ENHANCED DESCRIPTION
      description:
        "SnowLex is an advanced **LegalTech AI** platform designed to revolutionize legal research. It utilizes a **RAG (Retrieval-Augmented Generation)** architecture to provide instant, citation-backed answers from Finnish and EU law.<br/><br/>The system features a **Qdrant-based hybrid search** engine indexing over **2 Million+ legal vectors** (EUR-Lex & Finlex) using the **BGE-M3** embedding model. Inference is handled by **Ollama (Poro 2)**, ensuring data privacy and domain-specific accuracy.",
      shortDescription: "Next-Gen AI Legal Assistant with RAG & Vector Search.",
      // 🛠️ EXPANDED TECH STACK (Matches new icons)
      techStack: ["nextjs", "python", "fastapi", "qdrant", "ollama", "Google_cloud", "docker"],
      platforms: "Web, Cloud",
      category: "AI & LegalTech",
      client: "Justice4.0 — Helsinki, Finland (Remote)",
      date: "Aug 2025 – Present",
      color: "rgba(42, 248, 155, 0.2)",
      summary:
        "Engineered the complete RAG pipeline: from ingesting raw legal PDFs to serving scalable AI responses via FastAPI. Implemented strict source-verification logic to ensure zero-hallucination legal advice.",
      projectBenefits:
        "Reduces legal research time by 90% while providing direct links to official government sources for every claim generated.",
      // 🖼️ ENHANCED IMAGE LIST (Add these screenshots!)
      images: [
        "./images/projects/Snowlex.png",             // Main Dashboard
        "./images/projects/Snowlex_architecture.png", // 💡 TIP: Add a diagram of your RAG pipeline here
        "./images/projects/Snowlex_search.png"        // Search Results View
      ],
      projectLink: "https://snowlex.fi", // Update if you have a real link
    },
    {
      id: "tigflo",
      title: "Tigflo — Healthcare Design System",
      types: ["UI/UX", "Architecture"],
      description:
        "A comprehensive **Design System** and component library unifying healthcare products across Web and Mobile. Acting as **Software Architect**, I established the governance for code quality and UI consistency.<br/><br/>Developed **500+ reusable components** supporting light/dark modes, ensuring accessibility (WCAG) and brand consistency across **Next.js** dashboards and **Flutter** patient apps.",
      shortDescription: "Unified Design System for Healthcare Ecosystems.",
      techStack: ["nextjs", "flutter", "react", "figma", "ts"],
      platforms: "Web, iOS, Android",
      category: "System Architecture",
      client: "Tigflo — Sharjah, UAE (Remote)",
      date: "Dec 2024 – Present",
      color: "rgba(255, 94, 88, 0.4)",
      summary:
        "Led the migration of legacy frontends to a unified modern stack, reducing technical debt and accelerating feature release cycles by 40%.",
      projectBenefits:
        "Ensures seamless user experience for doctors and patients across 60+ different dashboard screens and mobile interfaces.",
      images: ["./images/projects/Reson8.png", "./images/projects/Tigflo_mobile.png"],
      projectLink: "https://mohammad-soqar.github.io/Portfolio-/",
    },
    {
      id: "tickettravel",
      title: "Ticket Travel — Tourism ERP & CRM",
      types: ["SaaS", "B2B"],
      description:
        "A heavy-lifting **SaaS platform** for the tourism industry. It handles the entire lifecycle of travel management: from **dynamic package creation** and inventory management to **CRM** and financial reporting.<br/><br/>Built on a **multi-tenant AWS architecture**, allowing the software to be white-labeled and deployed for various franchise partners.",
      shortDescription: "Enterprise Tourism ERP & Booking Engine.",
      techStack: ["nextjs", "nodejs", "prisma", "aws", "pgsql"],
      platforms: "Web (SaaS)",
      category: "Enterprise Software (ERP)",
      client: "Ticket Travel & Tourism — Muscat, Oman",
      date: "Apr 2025 – Oct 2025",
      color: "rgba(196, 148, 148, 0.4)",
      summary:
        "Architected a complex database schema using Prisma to handle multi-currency bookings, agent commissions, and dynamic itinerary generation.",
      projectBenefits:
        "Automated 80% of manual booking tasks and enabled real-time inventory syncing across all franchise branches.",
      images: ["./images/projects/ZoomTourism.png", "./images/projects/Zoom_dashboard.png"],
      projectLink: "https://mohammad-soqar.github.io/Portfolio-/",
    },
    {
      id: "rmts",
      title: "RMTS — Arthritis Monitoring System",
      types: ["IoT", "HealthTech"],
      description:
        "**🏆 8th Place Winner - Teknofest 2025.**<br/>A complete IoT ecosystem for monitoring Rheumatoid Arthritis patients. The system connects **wearable ESP32 sensors** to a **Flutter mobile app** and a **Next.js clinician dashboard**.<br/><br/>It streams real-time joint movement data to detect stiffness and inflammation patterns, alerting doctors immediately.",
      shortDescription: "Award-Winning IoT Health Monitoring System.",
      techStack: ["flutter", "nextjs", "firebase", "dart", "Google_cloud"],
      platforms: "Mobile, Web, Hardware",
      category: "HealthTech & IoT",
      client: "Teknofest Competition — Istanbul, Turkey",
      date: "Aug 2024 – Oct 2025",
      color: "rgba(66, 0, 151, 0.2)",
      summary:
        "Developed the cross-platform mobile application and the real-time database triggers that process raw sensor data into actionable medical insights.",
      projectBenefits:
        "Provides non-invasive, continuous monitoring for patients, replacing subjective pain diaries with hard data.",
      images: ["./images/projects/rmts.png", "./images/projects/rmts_app.png"],
      projectLink: "https://github.com/Mohammad-soqar/rmts",
    },
  ],

  // ... (Social Data remains the same)
  socialData: [
     // ... your existing social links
  ],

  aboutMe: {
    metrics: {
      githubContributions: "2k+",
      experienceYears: "2+",
      projectsDone: "14+",
    },
    personalInfo: {
      name: "Mohammad Ahmad",
      phone: "+905388782103",
      email: "mnsoqar1@gmail.com",
      aboutnme:
        "I am a software engineer with 2 years of experience specializing in full-stack development and AI integration. I transform complex requirements into pixel-perfect, scalable applications. From winning Teknofest awards to architecting enterprise SaaS platforms, I focus on delivering high-impact code.",
      location: "Istanbul, Turkey",
      cvLink:
        "https://drive.google.com/file/d/1B26dn1iOQZxrNHsEaXNI_oM7pbvPlKcY/view?usp=sharing",
      catchyphrase: "Engineering clarity into complex systems.",
    },
  },
};