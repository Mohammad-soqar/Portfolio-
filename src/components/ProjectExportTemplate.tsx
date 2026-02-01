"use client";

import React from "react";
import { Project } from "@/types";
import Image from "next/image";

interface ProjectExportTemplateProps {
  project: Project;
  language: "en" | "ar";
}

export default function ProjectExportTemplate({
  project,
  language,
}: ProjectExportTemplateProps) {
  const isAr = language === "ar";
  const title = isAr ? project.title_ar || project.title : project.title;
  const shortDesc = isAr
    ? project.shortDescription_ar || project.shortDescription
    : project.shortDescription;
  const longDesc = isAr
    ? project.longDescription_ar || project.longDescription
    : project.longDescription;
  const features = isAr ? project.features_ar : project.features;
  const challenge = isAr ? project.challenge_ar : project.challenge;
  const results = isAr ? project.results_ar : project.results;
  const impact = isAr ? project.impact_ar : project.impact;

  // Split features/results if they are strings (from the textarea)
  const featuresList =
    typeof features === "string"
      ? features.split("\n").filter((f) => f.trim())
      : features;
  const resultsList =
    typeof results === "string"
      ? results.split("\n").filter((r) => r.trim())
      : results;

  return (
    <div
      id={`project-export-${project.id}`}
      style={{
        width: "800px",
        padding: "40px",
        backgroundColor: "white",
        color: "black",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        direction: isAr ? "rtl" : "ltr",
        position: "relative",
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "2px solid #7628E5",
          paddingBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#7628E5",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "5px 0 0 0",
              color: "#666",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {project.categories?.join(" • ")}
          </p>
        </div>
        {project.logo && (
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <img
              src={project.logo}
              alt="Logo"
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* Hero Image */}
      {project.homeImage && (
        <div
          style={{
            marginBottom: "30px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <img
            src={project.homeImage}
            alt="Hero"
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Narrative Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333",
            borderLeft: isAr ? "none" : "4px solid #7628E5",
            borderRight: isAr ? "4px solid #7628E5" : "none",
            padding: "0 15px",
          }}
        >
          {isAr ? "نظرة عامة على المشروع" : "Project Overview"}
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#444",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}
        >
          {shortDesc}
        </p>
        <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#555",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}
        >
          {longDesc}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Challenge */}
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#7628E5",
            }}
          >
            {isAr ? "التحدي" : "The Challenge"}
          </h3>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5" }}>
            {challenge}
          </p>
        </div>
        {/* Impact */}
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#7628E5",
            }}
          >
            {isAr ? "الأثر" : "The Impact"}
          </h3>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5" }}>
            {impact}
          </p>
        </div>
      </div>

      {/* Features & Results */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#7628E5",
            }}
          >
            {isAr ? "الميزات الرئيسية" : "Key Features"}
          </h3>
          <ul style={{ paddingInlineStart: "20px", margin: 0 }}>
            {featuresList &&
              (Array.isArray(featuresList) ? featuresList : [featuresList]).map(
                (f: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {f.replace(/^- /, "")}
                  </li>
                ),
              )}
          </ul>
        </div>
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#7628E5",
            }}
          >
            {isAr ? "النتائج" : "Results"}
          </h3>
          <ul style={{ paddingInlineStart: "20px", margin: 0 }}>
            {resultsList &&
              (Array.isArray(resultsList) ? resultsList : [resultsList]).map(
                (r: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "5px",
                    }}
                  >
                    {r.replace(/^- /, "")}
                  </li>
                ),
              )}
          </ul>
        </div>
      </div>

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#7628E5",
            }}
          >
            {isAr ? "التقنيات المستخدمة" : "Technologies Used"}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #eee",
          textAlign: "center",
          fontSize: "12px",
          color: "#999",
        }}
      >
        {project.projectLink && (
          <p style={{ marginBottom: "5px" }}>
            Live Link: {project.projectLink}
          </p>
        )}
        <p>© {new Date().getFullYear()} Mohammad Soqar Portfolio</p>
      </div>
    </div>
  );
}
