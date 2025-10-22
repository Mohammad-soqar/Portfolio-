export const data = {
  Images: {
    profilePic: "./images/MohammadSoqar.png",
    star: "./images/Star.png",
    //background
    WebsiteBackground: "./images/Background.png",
    //tools
    flutter: "./images/tech/Flutter.png",//
    dart: "./images/tech/Dart.png",//
    python: "./images/tech/Python.png",//
    colab: "./images/tech/Colab.png",//
    chatgpt: "./images/tech/ChatGPT.png",//
    mysql: "./images/tech/MySql.png",//
    firebase: "./images/tech/FireBase.png",//////
    mongodb: "./images/tech/Mongodb.png",//
    git: "./images/tech/Git.png",//
    github: "./images/tech/Github.png",//
    nodejs: "./images/tech/Nodejs.png",//
    nextjs: "./images/tech/nextjs.png",//
    csharp: "./images/tech/Cs.png",//
    aspnet: "./images/tech/Aspnet.png",//
    react: "./images/tech/React.png",//
    aws: "./images/tech/aws.png",//
    js: "./images/tech/JS.png",//
    figma: "./images/tech/Figma.png",//
    ts: "./images/tech/ts.png",//
    Google_cloud: "./images/tech/GoogleCloud.png",//
    illustrator: "./images/tech/illustrator.png",//
    photoshop: "./images/tech/PhotoShop.png",//
    flutter2: "./images/tech/Flutter2.png",//
    dart2: "./images/tech/Dart2.png",//
    python2: "./images/tech/Python2.png",//
    chatgpt2: "./images/tech/ChatGPT2.png",//
    firebase2: "./images/tech/FireBase2.png",//
    mongodb2: "./images/tech/Mongodb2.png",//
    nodejs2: "./images/tech/Nodejs2.png",//
    aspnet2: "./images/tech/Aspnet2.png",//
    react2: "./images/tech/React2.png",//
    figma2: "./images/tech/Figma2.png",//
    Google_cloud2: "./images/tech/GoogleCloud2.png",//
    SqlServer: "./images/tech/sqlserver.png",//
    pgsql: "./images/tech/pgsql.png",//

  },

  projects: [
   
   
    {

      id: 'locaLink',
      title: 'SnowLEX — AI Legal Research Assistant',
      types: ["Web", "UI/UX"],
      description: 'SnowLEX accelerates legal research with Retrieval-Augmented Generation powered by **Qdrant**, **Ollama Mistral**, and **FastAPI**. I shaped conversational flows, context ranking, and guardrails so attorneys get trusted answers fast.',
      shortDescription: 'Conversational legal research intelligence.',
      techStack: ['python', 'chatgpt', 'firebase','Google_cloud' ],
      platforms: "Web",
      category: "Web App, AI",
      client: "Justice 4.0",
      date: "08/2025 - Present",
      color: "rgba(42, 248, 155, 0.2)",
      summary: "I architected RAG pipelines, prompt flows, and evaluation tooling so legal teams can query legislation in natural language. Deployments on Google Cloud pair Firebase Auth with observability, rate limiting, and privacy controls.",
      projectBenefits: "Lawyers uncover precedents in seconds instead of hours. Privacy-safe vector search keeps sensitive data in-region. Modular flows support new jurisdictions without rewriting the core.",
      images: ['./images/projects/LocaLink.png', './images/projects/LocaLink-2.png', './images/projects/LocaLink-3.png'],
      projectLink: 'https://my-portfolio.com',
    },
    {
      id: "ztw",
      title: "Ticket Travel & Tourism Platform",
      types: ["Web", "UI/UX"],
      description: "Ticket Travel & Tourism is a self-service marketplace covering package creation, bookings, CRM, and ERP. I architected the platform end-to-end with **Next.js**, **Node.js**, and **Prisma**, pairing bold UX with reliable operations.",
      shortDescription: "Self-service tourism and ops hub.",
      techStack: ["nextjs", "nodejs", "aws", "ts", "pgsql"],
      platforms: "Web",
      category: "Web App, Platform",
      client: "Ticket Travel & Tourism",
      date: "04/2025 - 10/2025",
      color: "rgba(196, 148, 148, 0.4)",
      summary: "Designed modular booking, CRM, and ERP domains backed by Prisma schema governance. Crafted responsive journeys for travelers, agents, and finance teams while automating workflows for partner onboarding.",
      projectBenefits: "Multi-tenant AWS foundations unlock new franchise revenue. Automated reconciliation trims manual ops. Unified UX keeps travellers, agents, and support in sync.",
      images: ["./images/projects/ZoomTourism.png", "./images/projects/ZoomTourism-2.png", "./images/projects/ZoomTourism-3.png"],
      projectLink: "https://my-portfolio.com"
    },
    {
      id: "Reson8",
      title: "Tigflo Design System",
      type:"UI/UX",
      description: "Tigflo unifies healthcare dashboards, patient portals, and mobile apps with a shared design system. I own component architecture across **Next.js**, **Flutter**, and **Node.js**, enforcing accessibility, theming, and performance at scale.",
      shortDescription: "Design ops for Tigflo's healthcare platform.",
      techStack: ["nextjs", "flutter", "nodejs", "figma"],
      platforms: "Web, Mobile",
      category: "Product Design, Multi-platform",
      client: "Tigflo",
      date: "12/2024 - Present",
      color: "rgba(255, 94, 88, 0.4)",
      summary: "Built and maintained 500+ reusable components covering dashboards, clinician tools, and patient journeys. Delivered light/dark themes, state guidelines, and quality gates that keep every repository in sync.",
      projectBenefits: "Design debt stays low while delivery stays fast. Teams assemble screens in minutes using governed components. Stakeholders preview new flows with confidence across mobile, tablet, and desktop.",
      images: [
        "./images/projects/Reson8.png",
        "./images/projects/Reson8-2.png",
        "./images/projects/Reson8-3.png"
      ],
      projectLink: "https://my-portfolio.com"
    },
    {

      id: 'raMonitoring',
      title: 'RMTS — Teknofest 2025 Finalist',
      types: ["Mobile", "Web", "UI/UX"],
      description: 'RMTS streams live vitals from ESP32 sensors into clinician-ready dashboards. I led the cross-platform build with **Flutter**, **Next.js**, and **Firebase**, pairing MVVM architecture with reliable real-time sync.',
      shortDescription: 'Real-time health telemetry across mobile and web.',
      techStack: ['flutter', 'nextjs', 'firebase','chatgpt','Google_cloud' ],
      platforms: "Android, iOS, Web",
      category: "Healthcare, Cross-Platform",
      client: "Teknofest 2025 Team",
      date: "2025",
      color: "rgba(66, 0, 151, 0.2)",
      summary: "Implemented data streaming, alert thresholds, and clinician dashboards that stay responsive in low-connectivity environments. Automated reporting blends sensor data with **OpenAI** insights for faster triage.",
      projectBenefits: "Continuous monitoring flags anomalies instantly for field medics. Offline-ready apps keep crews informed even without stable networks. Modular services help hospitals adopt RMTS without rewriting their infrastructure.",
      images: ['./images/projects/rmts.png', '', ''],
      projectLink: 'https://github.com/Mohammad-soqar/rmts',
    },
    {
      id: "zm",
      title: "Zoom Medical",
      types: ["Web", "UI/UX"],
      description: "Zoom Medical is a comprehensive beauty and cosmetics booking system integrated with a CRM. It allows users to schedule beauty treatments, view detailed service descriptions, and manage their appointments through a user-friendly web interface.",
      shortDescription: "A beauty and cosmetics booking system integrated with CRM functionalities.",
      techStack: ["react", "nodejs", "mongodb"],
      platforms: "Web",
      category: "Web App, CRM",
      client: "Zoom Tourism",
      date: "01/2024 - 02/2024",
      color: "rgba(42, 148, 123, 0.4)",
      summary: "Zoom Medical offers an intuitive platform for managing beauty appointments and services. Users can browse various treatments, book appointments, and track their service history. The system's integration with a CRM enhances customer relationship management and streamlines booking processes.",
      projectBenefits: "Enhanced User Experience: Provides a seamless booking experience with detailed service information. CRM Integration: Improves customer relationship management and streamlines operations.",
      images: ["./images/projects/ZoomMedical.png", "./images/projects/ZoomMedical-2.png", "./images/projects/ZoomMedical-3.png"],
      projectLink: "https://my-portfolio.com"
    },
    {
      id: "Codyle",
      title: "Codyle",
      types: ["Web", "UI/UX"],
      description: "Codyle is a comprehensive platform developed for managing and organizing tech events within a university setting. It provides tools for event creation, participant registration, and feedback collection, facilitating streamlined management of tech-focused activities and fostering community engagement.",
      shortDescription: "A tech-focused university club platform for organizing and managing tech events.",
      techStack: ["react", "nodejs", "mongodb"],
      platforms: "Web",
      category: "Web App",
      client: "Business Idea and University Club",
      date: "07/2022 - 09/2022",
      color: "rgba(42, 148, 123, 0.4)",
      summary: "Codyle streamlines the organization of tech events by offering a centralized platform for managing schedules, registrations, and communications. The system allows club members to easily create and promote events, track attendance, and gather valuable feedback from participants.",
      projectBenefits: "Efficient Event Management: Simplifies the process of organizing and managing tech events.",
      images: ["./images/projects/Codyle.png", "./images/projects/Codyle-2.png", "./images/projects/Codyle-3.png"],
      projectLink: "https://my-portfolio.com"
    },
   /*  {
      id: "IAS",
      title: "Internship Automation System",
      description: "The Internship Automation System is a comprehensive tool developed for automating the entire internship process at the university. It manages paperwork, track internship progress, and streamline communication between students and administration, eliminating the need for physical visits to the university.",
      shortDescription: "A system for automating the internship process, managing paperwork, and tracking progress.",
      techStack: ["aspnet", "SqlServer"],
      platforms: "Web",
      category: "Web App",
      client: "University Project (A+)",
      date: "04/2024 - 02/2024",
      color: "rgba(42, 148, 123, 0.4)",
      summary: "The Internship Automation System simplifies the management of internship-related tasks by providing a digital platform for all necessary processes. This system reduces administrative overhead and improves efficiency by allowing students to handle all internship requirements online.",
      projectBenefits: "Streamlined Administration: Reduces the need for physical paperwork and visits. Enhanced Efficiency: Automates and tracks all aspects of the internship process, improving overall workflow.",
      images: ["./images/projects/IAS.png", "./images/projects/IAS-2.png", "./images/projects/IAS-3.png"],
      projectLink: "https://my-portfolio.com"
    },
    
    {
      id: "bookworm",
      title: "Bookworm",
      description: "Bookworm is a comprehensive e-commerce platform dedicated to the sale of e-books. It provides a user-friendly interface for browsing, purchasing, and managing a vast collection of digital books. The application is designed to facilitate a seamless shopping experience for book enthusiasts.",
      shortDescription: "An E-Book Store",
      techStack: ["aspnet", "SqlServer", "figma"],
      platforms: "Web",
      category: "E-Commerce, Web App",
      client: "Practice Project",
      date: "01/2023 - 05/2023",
      color: "rgba(67, 201, 214, 0.4)",
      summary: "This e-commerce platform for e-books offers a streamlined shopping experience, featuring a user-friendly interface for browsing and purchasing digital books. Designed for ease of use, Bookworm ensures a smooth process for book enthusiasts looking to explore and buy e-books.",
      projectBenefits: "Bookworm simplifies the process of buying e-books with its intuitive interface and efficient browsing capabilities. It provides a convenient platform for users to find and purchase digital books, enhancing the overall e-commerce experience for book lovers.",
      images: ["./images/projects/Bookworm.png", "./images/projects/Bookworm-2.png", "./images/projects/Bookworm-3.png"],
      projectLink: "https://my-portfolio.com"
    },
    {
      id: "onifood",
      title: "Onifood",
      description: "Onifood is an innovative application for restaurant reservations and food ordering. It allows users to book a table, place food orders in advance, and pay via QR code. The app ensures that meals are prepared by the time users arrive, enhancing the dining experience.",
      shortDescription: "A Restaurant Reservation & Ordering App",
      techStack: ["figma", "illustrator"],
      platforms: "Android, iOS",
      category: "Mobile App, UI/UX Design",
      client: "Practice Project",
      date: "04/2023",
      color: "rgba(255, 193, 33, 0.4)",
      summary: "This app facilitates restaurant reservations and pre-ordering of food, ensuring that meals are ready when users arrive. With QR code integration for easy payment and ordering, Onifood enhances the efficiency and convenience of dining out.",
      projectBenefits: "Onifood streamlines the dining experience by enabling users to reserve tables, place orders in advance, and handle payments seamlessly through QR codes. This approach improves restaurant service efficiency and enhances customer satisfaction.",
      images: ["./images/projects/Onifood.png", "./images/projects/Onifood-2.png", "./images/projects/Onifood-3.png"],
      projectLink: "https://my-portfolio.com"
    },
 */
    // Add more projects as needed
  ],

  socialData: [
    {
      icon: "./images/SocialMedia/Instagram.png",
      icon_big: "./images/SocialMedia/Instagram-big.png",
      link: "https://www.instagram.com/mohammad_soqar/"
    },
    {
      icon: "./images/SocialMedia/Github.png",
      icon_big: "./images/SocialMedia/Github-big.png",
      link: "https://github.com/Mohammad-soqar"
    },
    {
      icon: "./images/SocialMedia/LinkedIn.png",
      icon_big: "./images/SocialMedia/LinkedIn-big.png",
      link: "https://www.linkedin.com/in/mohammad-soqar-ahmad/"
    },
    {
      icon: "./images/SocialMedia/YouTube.png",
      icon_big: "./images/SocialMedia/YouTube-big.png",
      link: "https://www.youtube.com/@mohammadsoqar2809/featured"
    },
    {
      icon: "./images/SocialMedia/Behance.png",
      icon_big: "./images/SocialMedia/Behance-big.png",
      link: "https://www.behance.net/mohammadsoqar"
    }
  ],
  aboutMe: {
    metrics: {
      githubContributions: "1k+",
      experienceYears: "4+",
      projectsDone: "14+",
    },
    personalInfo: {
      name: "Mohammad Ahmad",
      phone: "+905388782103",
      email: "mnsoqar1@gmail.com",
      aboutnme: "Hi, I’m Mohammad Soqar, a software architect who turns complex ideas into products people love to use. I lead platform-wide reviews across **Next.js**, **Flutter**, and **Node.js**, making sure every release scales and stays maintainable. Recent wins include shipping SnowLEX, an AI legal assistant on Google Cloud, and rolling out Tigflo’s 500+ component design system for healthcare teams. I thrive on clean architecture, purposeful UI, and the momentum that comes from shipping fast without sacrificing quality.",
      location: "Istanbul, Turkey",
      cvLink: "https://drive.google.com/file/d/1NlVE4C3Q2QfopXpnpCRbRSEJTHbHVaqI/view?usp=sharing",
      catchyphrase: "Designing systems that stay fast, smart, and human."
    }
  }
};
