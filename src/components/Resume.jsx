import React from "react";
import "../css/Resume.css";
import { data } from "./sidepanelData";
import { Table } from "./table";
import { ToolIcon } from "./toolIcon";
import { Link } from "react-router-dom";

export function Resume() {
  const tableRowEdu = [
    {
      title: "Software Engineering",
      subTitle: (
        <>
          At{" "}
          <a
            href="https://uskudar.edu.tr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Uskudar University
          </a>
        </>
      ),
      description:
        "Bachelor's degree program focused on software development and systems design.",
      yearRange: "2020-2024",
    },
    {
      title: "Flutter & Dart",
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
        "Learned to build cross-platform mobile apps using Flutter and Dart.",
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
      description: "Studied machine learning algorithms and AI models.",
      yearRange: "-",
    },
    {
      title: "Asp.NET MVC",
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
      description: "Learned to develop web applications using ASP.NET MVC.",
      yearRange: "-",
    },
  ];

  // 🔧 FIX: make this a flat array (remove the extra [])
  const tableRowExp = [
    {
      company: "Ticket Travel and Tourism",
      role: "Full-Stack Developer (Remote)",
      location: "Muscat, Oman",
      date: "Apr 2025 – Present",
      description: [
        "Architecting and developing a full-scale, self-service tourism platform covering package creation, client booking, CRM, and ERP systems.",
        "Leading end-to-end UI/UX design and full-stack implementation using Next.js, Node.js, Prisma.",
        "Building a scalable multi-tenant system on AWS for white-labeled deployments.",
      ],
    },
    {
      company: "JUSTICE4.0",
      role: "Software Development & AI Intern (LegalTech) (Remote)",
      location: "Helsinki, Finland",
      date: "Aug 2025 – Oct 2025",
      description: [
        "Developing an AI-powered legal chatbot leveraging open-source models (Ollama, Mistral) with Retrieval-Augmented Generation (RAG).",
        "Implementing data ingestion, embedding, and vector search pipelines for accurate and scalable legal queries.",
      ],
    },
    {
      company: "Zoom Property",
      role: "Software Development Engineering Intern",
      location: "Istanbul, Turkey",
      date: "Aug 2023 – Nov 2023",
      description: [
        "Built a CRM system for the tourism branch, managing bookings, transportation, and customer lifecycle.",
        "Integrated real-time updates, task checklists, and automated driver reminders to improve efficiency.",
        "Enhanced customer satisfaction and team coordination through system improvements.",
      ],
    },
    {
      company: "Reson8 Media",
      role: "UI/UX Designer (Freelance)",
      location: "Istanbul, Turkey",
      date: "Mar 2024 – May 2024",
      description: [
        "Designed and delivered a complete responsive website aligned with the company’s brand identity.",
        "Created 16+ screens covering full desktop and mobile flows, ensuring accessibility and usability.",
        "Contributed to a live production website for a media company with a global presence (Canada, Turkey, Qatar, UAE).",
      ],
    },
    {
      company: "DragLab",
      role: "UI/UX Designer (Freelance, Remote)",
      location: "Eschborn, Germany",
      date: "Mar 2025 – May 2025",
      description: [
        "Designed and launched a responsive, Apple-inspired website showcasing DragLab’s product line.",
        "Produced 34+ screens across web and mobile, ensuring a modern and intuitive user experience.",
      ],
    },
    {
      company: "TigFlo (Medflo Project)",
      role: "UI/UX Designer (Freelance, Remote)",
      location: "Sharjah, UAE",
      date: "Dec 2024 – Present",
      description: [
        "Designing a large-scale, multi-phase healthcare system (web, mobile, dashboards) supporting light and dark modes.",
        "Built and maintained 500+ reusable components across multiple themes for scalability.",
        "Delivered 60–70+ dashboard screens, 50+ mobile screens, and 30+ web screens.",
      ],
    },
    {
      company: "Zoom Dental",
      role: "Software Engineer (Freelance)",
      location: "Remote",
      date: "Jan 2024",
      description: [
        "Developed a fully responsive website tailored to client needs, enhancing online presence.",
      ],
    },
  ];

  const tools = [
    { title: "Next.js", picture: data.Images.nextjs },
    { title: "React", picture: data.Images.react2 },
    { title: "Node.js", picture: data.Images.nodejs },
    { title: "Flutter", picture: data.Images.flutter2 },
    { title: "Google Cloud", picture: data.Images.Google_cloud2 },
    { title: "aws", picture: data.Images.aws },
    { title: "Dart", picture: data.Images.dart2 },
    { title: "ASP.NET", picture: data.Images.aspnet2 },
    { title: "Firebase", picture: data.Images.firebase2 },
    { title: "MongoDB", picture: data.Images.mongodb },
    { title: "Python", picture: data.Images.python2 },
    { title: "ChatGPT", picture: data.Images.chatgpt },
    { title: "Figma", picture: data.Images.figma2 },
  ];

  return (
    <section id="resume" className="resume">
      <div className="section-tag ">
        <img src={data.Images.star} alt="Star" />
        <p>Resume!</p>
      </div>

      <div className="resume-content">
        <h2 className="catchy-phrase gradient-text">Experience & Education</h2>

        <div className="tables">
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

        <div>
          <h3 className="table-title">Favorite Tools:</h3>
          <div className="toolList">
            {tools.map((tool, index) => (
              <ToolIcon
                key={index}
                title={tool.title}
                techStack={tool.picture}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
