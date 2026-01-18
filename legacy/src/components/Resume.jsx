import "../css/Resume.css";
import { data } from "./sidepanelData";
import { Table } from "./table";
import { ToolIcon } from "./toolIcon";

export function Resume() {
  // 🎓 EDUCATION & CERTIFICATIONS
  const tableRowEdu = [
    {
      title: "B.Sc. Software Engineering",
      subTitle: (
        <>
          At <a href="https://uskudar.edu.tr/" target="_blank" rel="noopener noreferrer">Üsküdar University</a>
        </>
      ),
      description: "GPA: 3.22/4.00. Focus: Data Structures, AI, Software Architecture. Capstone: HealthTech IoT System.",
      yearRange: "2020 – 2024",
    },
    {
      title: "Ultimate Next.js 14 Course",
      subTitle: (
        <>
          <a href="https://www.jsmastery.pro/" target="_blank" rel="noopener noreferrer" style={{color: '#ff4d4d'}}>
            JSMastery Pro
          </a>
        </>
      ),
      description: "Advanced Masterclass: Server Actions, App Router, TypeScript, Auth.js, and complex SaaS architecture.",
      yearRange: "2025",
    },
    {
      title: "Flutter & Dart Development",
      subTitle: "Academind (Udemy)",
      description: "Comprehensive bootcamp on building native iOS and Android apps with a single codebase.",
      yearRange: "Certification",
    },
  ];

  // 💼 EXPERIENCE (Mapped from CV)
  const tableRowExp = [
    {
      company: "Justice4.0",
      role: "Software Development & AI Developer",
      location: "Helsinki, Finland (Remote)",
      date: "Aug 2025 – Present",
      description: [
        "Developing SnowLex, an AI-powered legal research platform using Next.js, FastAPI, and Python.",
        "Implemented Qdrant vector search with BGE-M3 models for high-precision legal document retrieval.",
        "Integrated Ollama (Poro 2) for local LLM inference, ensuring data privacy for legal contexts.",
        "Deployed scalable microservices on Google Cloud Platform."
      ],
    },
    {
      company: "Tigflo",
      role: "Software Architect & UI/UX Designer",
      location: "Sharjah, UAE (Remote)",
      date: "Dec 2024 – Present",
      description: [
        "Architecting scalable frontend systems for Web (Next.js) and Mobile (Flutter).",
        "Created a design system with 500+ reusable components, reducing development time by 40%.",
        "Conducting code reviews and enforcing clean architecture principles across the team."
      ],
    },
    {
      company: "Ticket Travel & Tourism",
      role: "Full-Stack Developer",
      location: "Muscat, Oman (Remote)",
      date: "Apr 2025 – Oct 2025",
      description: [
        "Built a multi-tenant SaaS ERP for tourism, handling bookings, CRM, and accounting.",
        "Designed a white-label architecture using AWS and Next.js for franchise scalability.",
        "Optimized database queries using Prisma and PostgreSQL for high-volume transaction handling."
      ],
    },
  ];

  // 🧰 TOOLS - Enhanced List
  const tools = [
    { title: "Next.js", picture: data.Images.nextjs },
    { title: "React", picture: data.Images.react },
    { title: "Node.js", picture: data.Images.nodejs },
    { title: "Qdrant", picture: data.Images.qdrant }, // NEW
    { title: "Ollama", picture: data.Images.ollama }, // NEW
    { title: "FastAPI", picture: data.Images.fastapi }, // NEW
    { title: "Flutter", picture: data.Images.flutter },
    { title: "Google Cloud", picture: data.Images.Google_cloud },
    { title: "AWS", picture: data.Images.aws },
    { title: "TypeScript", picture: data.Images.ts },
    { title: "Prisma", picture: data.Images.prisma || data.Images.pgsql },
    { title: "Figma", picture: data.Images.figma },
  ];

  return (
    <section id="resume" className="resume">
      <div className="section-tag">
        <img src={data.Images.star} alt="Star" />
        <p>Resume</p>
      </div>

      <div className="resume-content">
        <h2 className="catchy-phrase gradient-text">Experience & Qualifications</h2>

        <div className="tables">
          {/* EXPERIENCE */}
          <div>
            <h3 className="table-title">Work History</h3>
            <div className="table">
              {tableRowExp.map((row, index) => (
                <Table
                  key={index}
                  title={`${row.company} — ${row.role}`}
                  subTitle={row.location}
                  description={
                    <ul style={{paddingLeft: '15px', marginTop: '5px'}}>
                      {row.description.map((item, i) => <li key={i} style={{marginBottom: '5px'}}>{item}</li>)}
                    </ul>
                  }
                  yearRange={row.date}
                />
              ))}
              <hr />
            </div>
          </div>

          {/* EDUCATION */}
          <div>
            <h3 className="table-title">Education & Certifications</h3>
            <div className="table">
              {tableRowEdu.map((row, index) => (
                <Table
                  key={index}
                  title={row.title}
                  subTitle={row.subTitle}
                  description={row.description}
                  yearRange={row.yearRange}
                />
              ))}
              <hr />
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div>
          <h3 className="table-title">Technical Arsenal</h3>
          <div className="toolList">
            {tools.map((tool, index) => (
              tool.picture ? <ToolIcon key={index} title={tool.title} techStack={tool.picture} /> : null
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}