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
      company: "Ticket Travel & Tourism",
      role: "Full-Stack Developer",
      location: "Remote",
      date: "Apr 2025 – Oct 2025",
      description: [
        "Architected a self-service tourism platform spanning packages, bookings, CRM, and ERP.",
        "Led UI/UX and full-stack delivery with **Next.js**, **Node.js**, and **Prisma**.",
        "Built AWS multi-tenant foundations ready for white-label rollouts.",
      ],
    },
    {
      company: "Justice 4.0",
      role: "Software & AI Developer",
      location: "Remote",
      date: "Aug 2025 – Present",
      description: [
        "Shipped SnowLEX, a Retrieval-Augmented assistant using **Qdrant**, **Ollama Mistral**, and **FastAPI**.",
        "Deployed Google Cloud backends with Firebase Auth, audit logging, and monitoring.",
      ],
    },
    {
      company: "Tigflo",
      role: "Software Architect & UI/UX Designer",
      location: "Remote",
      date: "Dec 2024 – Present",
      description: [
        "Review code quality across **Next.js**, **Flutter**, and **Node.js** repositories.",
        "Maintained 500+ reusable components with light/dark themes and usage guidelines.",
        "Delivered 60+ dashboards, 50+ mobile screens, and 30+ web screens.",
      ],
    },
    {
      company: "Zoom Property",
      role: "Software Development Intern",
      location: "Istanbul, Turkey",
      date: "Aug 2023 – Nov 2023",
      description: [
        "Built a tourism CRM covering bookings, transportation, and partner coordination.",
        "Automated driver reminders and daily task flows to keep teams aligned.",
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
