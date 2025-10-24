import React from "react";
import "../css/Resume.css";
import { data } from "./sidepanelData";
import { Table } from "./table";
import { ToolIcon } from "./toolIcon";
import { Link } from "react-router-dom";

export function Resume() {
  // 🎓 EDUCATION (matches your CV)
  const tableRowEdu = [
    {
      title: "B.Sc. Software Engineering",
      subTitle: (
        <>
          At{" "}
          <a
            href="https://uskudar.edu.tr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Üsküdar University
          </a>
        </>
      ),
      description:
        "Bachelor’s degree focused on software development, architecture, and systems design. GPA: 3.22/4.00. Relevant coursework includes Data Structures, AI, Agile Methods, and Neural Networks.",
      yearRange: "2020 – 2024",
    },
    {
      title: "Flutter & Dart Development",
      subTitle: (
        <>
          Course by{" "}
          <a
            href="https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            Academind
          </a>
        </>
      ),
      description:
        "Learned to build scalable cross-platform mobile apps using Flutter and Dart.",
      yearRange: "-",
    },
    {
      title: "Machine Learning (AI)",
      subTitle: (
        <>
          Course by{" "}
          <a
            href="https://www.udemy.com/course/machinelearning/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SuperDataScience
          </a>
        </>
      ),
      description:
        "Studied supervised and unsupervised learning algorithms and applied ML models.",
      yearRange: "-",
    },
    {
      title: "ASP.NET MVC Framework",
      subTitle: (
        <>
          Course by{" "}
          <a
            href="https://www.udemy.com/course/complete-aspnet-core-21-course/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bhrugen Patel
          </a>
        </>
      ),
      description:
        "Gained practical experience building robust web applications using ASP.NET MVC and SQL Server.",
      yearRange: "-",
    },
  ];

  // 💼 EXPERIENCE (matches CV)
  const tableRowExp = [
    {
      company: "Justice 4.0",
      role: "Software Development & AI Developer",
      location: "Remote — Helsinki, Finland",
      date: "Aug 2025 – Present",
      description: [
        "Developing SnowLEX, an AI-powered legal research assistant integrating RAG pipelines with Next.js and Node.js.",
        "Implementing Qdrant vector search and Ollama Mistral inference for Finnish and EU legal data.",
        "Deploying FastAPI services on Google Cloud with Firebase authentication and scalable architecture.",
      ],
    },
    {
      company: "Tigflo",
      role: "Software Architect & UI/UX Designer",
      location: "Remote — Sharjah, UAE",
      date: "Dec 2024 – Present",
      description: [
        "Overseeing code quality, architecture, and scalability across Next.js, Flutter, and Node.js repositories.",
        "Maintaining 500+ reusable components with light/dark theming and accessibility support.",
        "Delivered 60+ dashboards, 50+ mobile screens, and 30+ responsive web interfaces.",
      ],
    },
    {
      company: "Ticket Travel & Tourism",
      role: "Full-Stack Developer",
      location: "Remote — Muscat, Oman",
      date: "Apr 2025 – Oct 2025",
      description: [
        "Architected and developed a self-service tourism platform covering package creation, booking, CRM, and ERP.",
        "Led end-to-end UI/UX and full-stack implementation using Next.js, Node.js, and Prisma.",
        "Built AWS-based multi-tenant architecture enabling white-labeled franchise deployments.",
      ],
    },
    {
      company: "Zoom Property",
      role: "Software Development Intern",
      location: "Istanbul, Turkey",
      date: "Aug 2023 – Nov 2023",
      description: [
        "Built a CRM system for a tourism branch managing bookings, transport, and customer lifecycle.",
        "Integrated real-time updates, task tracking, and automated driver reminders to enhance operations.",
      ],
    },
  ];

  // 🧰 TOOLS
  const tools = [
    { title: "Next.js", picture: data.Images.nextjs },
    { title: "React", picture: data.Images.react },
    { title: "Node.js", picture: data.Images.nodejs },
    { title: "Flutter", picture: data.Images.flutter },
    { title: "Google Cloud", picture: data.Images.Google_cloud },
    { title: "AWS", picture: data.Images.aws },
    { title: "Dart", picture: data.Images.dart },
    { title: "ASP.NET", picture: data.Images.aspnet },
    { title: "Firebase", picture: data.Images.firebase },
    { title: "MongoDB", picture: data.Images.mongodb },
    { title: "Python", picture: data.Images.python },
    { title: "ChatGPT", picture: data.Images.chatgpt },
    { title: "Figma", picture: data.Images.figma },
  ];

  return (
    <section id="resume" className="resume">
      <div className="section-tag">
        <img src={data.Images.star} alt="Star" />
        <p>Resume!</p>
      </div>

      <div className="resume-content">
        <h2 className="catchy-phrase gradient-text">Experience & Education</h2>

        <div className="tables">
          {/* EXPERIENCE */}
          <div>
            <h3 className="table-title">Work Experience:</h3>
            <div className="table">
              {tableRowExp.map((row, index) => (
                <Table
                  key={index}
                  title={`${row.company} — ${row.role}`}
                  subTitle={row.location}
                  description={
                    Array.isArray(row.description)
                      ? row.description.join(" • ")
                      : row.description
                  }
                  yearRange={row.date}
                />
              ))}
              <hr />
            </div>
          </div>

          {/* EDUCATION */}
          <div>
            <h3 className="table-title">My Education:</h3>
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

        {/* TOOLS */}
        <div>
          <h3 className="table-title">Favorite Tools:</h3>
          <div className="toolList">
            {tools.map((tool, index) => (
              <ToolIcon key={index} title={tool.title} techStack={tool.picture} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
