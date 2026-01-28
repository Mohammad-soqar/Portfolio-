"use client";
import { motion } from "framer-motion";
import { Plus, Star, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: Project;
  idx?: number;
  isPreview?: boolean;
}

export default function ProjectCard({
  project,
  idx = 0,
  isPreview = false,
}: ProjectCardProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const themeColor = project.color || "#7628E5";

  // Helper to get localized content
  const getLocalized = <T extends string | undefined>(
    content: T,
    contentAr: T,
  ): T => {
    if (i18n.language === "ar" && contentAr) return contentAr;
    return content;
  };

  // Use thumbnail, first image, or fallback
  const thumbnailImage = project.thumbnail || project.images?.[0] || null;

  const content = (
    <motion.div
      className="project-card group relative rounded-2xl overflow-hidden cursor-pointer"
      initial={isPreview ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={isPreview ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      style={
        {
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          "--card-theme-color": themeColor,
        } as any
      }
    >
      {/* Movie Thumbnail Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Thumbnail Image */}
        {thumbnailImage ? (
          <Image
            src={thumbnailImage}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            alt={project.title || "Project thumbnail"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-black flex items-center justify-center">
            <Plus size={32} className="text-white/20" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

        {/* Top Glassy Badge - Category */}
        {project.categories?.[0] && (
          <div
            className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {project.categories[0]}
          </div>
        )}

        {/* Tech Stack Pills - Bottom of Image */}
        {project.techStack && project.techStack.length > 0 && (
          <div
            className={`absolute bottom-4 ${isRtl ? "right-4" : "left-4"} flex gap-2 flex-wrap max-w-[80%]`}
          >
            {project.techStack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold"
                style={{
                  background: `${themeColor}4D`, // 30% opacity
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${themeColor}4D`,
                }}
              >
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Section - Glassy Footer */}
      <div
        className="p-5 relative"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Title and Logo Row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {project.logo ? (
              <Image
                src={project.logo}
                width={48}
                height={48}
                className="object-contain p-2 rounded-2xl"
                alt=""
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            )}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg tracking-tight line-clamp-1 text-white group-hover:text-[var(--card-theme-color)] transition-colors">
              {getLocalized(project.title, project.title_ar) ||
                "Untitled Project"}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              {/* Rating-like indicator */}
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" fill="#facc15" />
                <span className="text-[11px] text-white/60 font-medium">
                  Featured
                </span>
              </div>
              {/* Year/Time indicator */}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
          {getLocalized(
            project.shortDescription,
            project.shortDescription_ar,
          ) ||
            "An innovative project pushing the boundaries of design and technology."}
        </p>

        {/* Bottom Shimmer Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
          }}
        />
      </div>

      {/* Corner Glow Effect on Hover */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${themeColor}CC 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );

  if (isPreview) {
    return <div className="preview-card-wrap">{content}</div>;
  }

  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
}
