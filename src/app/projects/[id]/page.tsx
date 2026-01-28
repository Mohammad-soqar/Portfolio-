"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  LayoutGrid,
} from "lucide-react";
import { getById } from "@/lib/firestore";
import { Project } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SECTIONS = [
  { id: "hero", name: "Intro", key: "intro" },
  { id: "challenge", name: "Challenge", key: "challenge" },
  { id: "features", name: "Features", key: "features" },
  { id: "story", name: "Story", key: "story" },
  { id: "results", name: "Results", key: "results" },
  { id: "journey", name: "Journey", key: "journey" },
  { id: "gallery", name: "Showcase", key: "showcase" },
  { id: "impact", name: "Impact", key: "impact" },
];

export default function ProjectPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const themeColor = project?.color || "#7628E5";

  const filteredSections = SECTIONS.filter((s) => {
    if (s.id === "hero") return true;
    if (s.id === "challenge")
      return !!(
        project?.challenge ||
        project?.challenge_ar ||
        project?.longDescription
      );
    if (s.id === "features")
      return !!(project?.features || project?.features_ar);
    if (s.id === "story")
      return !!(project?.longDescription || project?.longDescription_ar);
    if (s.id === "results") return !!(project?.results || project?.results_ar);
    if (s.id === "journey")
      return !!(project?.journey && project.journey.length > 0);
    if (s.id === "gallery")
      return !!(project?.images && project.images.length > 0);
    if (s.id === "impact") return !!(project?.impact || project?.impact_ar);
    return true;
  });

  const getLocalized = <T extends string | undefined>(
    content: T,
    contentAr: T,
  ): T => {
    if (i18n.language === "ar" && contentAr) return contentAr;
    return content;
  };

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      const data = await getById<Project>("projects", id as string);
      if (data) setProject(data);
      setLoading(false);
    }
    loadProject();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;

      for (const section of filteredSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white gap-6">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-[#7628E5] rounded-full animate-spin shadow-[0_0_20px_#7628E5]"></div>
        <span className="animate-pulse text-sm text-white/50 tracking-widest uppercase">
          {t("hero.architecting")}
        </span>
      </div>
    );

  if (!project) return null;

  return (
    <main
      className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--theme-color)] selection:text-white overflow-x-hidden"
      style={{ "--theme-color": themeColor } as React.CSSProperties}
    >
      {/* 1. FIXED NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6 md:gap-8 flex-1">
            <button
              onClick={() => router.push("/")}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 font-bold text-xs tracking-widest uppercase group"
            >
              <div className="p-2 rounded-full border border-white/10 group-hover:border-[var(--theme-color)] transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="hidden md:inline">{t("common.back")}</span>
            </button>
            <div className="flex items-center gap-3 font-black text-sm tracking-widest uppercase">
              {project.logo && (
                <div className="relative w-8 h-8 overflow-hidden bg-white/5 rounded-lg border border-white/10">
                  <Image
                    src={project.logo}
                    fill
                    className="object-contain p-1"
                    alt=""
                  />
                </div>
              )}
              <span className="hidden md:inline line-clamp-1">
                {getLocalized(project.title, project.title_ar)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                className="bg-[var(--theme-color)] text-white border border-[var(--theme-color)] hover:bg-[var(--theme-color)]/80 hover:shadow-[0_0_20px_var(--theme-color)] rounded-full px-6 py-2.5 font-bold text-xs flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t("common.visitSite")} <ExternalLink size={14} />
              </a>
            )}
            <div className="pl-4 border-l border-white/10 hidden md:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SIDE PROGRESS NAV (Desktop) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-6 items-end">
        {filteredSections.map((s) => (
          <button
            key={s.id}
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => scrollTo(s.id)}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeSection === s.id
                  ? "opacity-100 translate-x-0 text-[var(--theme-color)]"
                  : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-white/40"
              }`}
            >
              {t(`portfolio.${s.key}`, s.name)}
            </span>
            <div
              className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                activeSection === s.id
                  ? "bg-[var(--theme-color)] border-[var(--theme-color)] scale-150 shadow-[0_0_10px_var(--theme-color)]"
                  : "bg-transparent border-white/20 group-hover:border-white/60"
              }`}
            ></div>
          </button>
        ))}
      </div>

      {/* 3. HERO SECTION (Full Height) */}
      <section
        id="hero"
        className="min-h-screen relative flex flex-col items-center justify-center pt-20"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] blur-[150px] opacity-20 animate-pulse pointer-events-none"
          style={{ backgroundColor: themeColor }}
        ></div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8 w-full relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 font-black text-xs tracking-[0.2em] text-[var(--theme-color)] mb-8 uppercase bg-[var(--theme-color)]/5 px-4 py-2 rounded-full border border-[var(--theme-color)]/20 shadow-[0_0_15px_var(--theme-color)]"
            style={{
              backgroundColor: `${themeColor}0D`,
              borderColor: `${themeColor}33`,
              color: themeColor,
              boxShadow: `0 0 15px ${themeColor}1A`,
            }}
          >
            <Sparkles size={14} /> {project.categories?.[0] || "Case Study"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-8 text-white drop-shadow-2xl"
          >
            {getLocalized(project.title, project.title_ar)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {getLocalized(
              project.shortDescription,
              project.shortDescription_ar,
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center gap-3 flex-wrap"
          >
            {project.techStack?.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/60"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CHALLENGE SECTION */}
      <section id="challenge" className="py-24 md:py-32 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight">
                {t("projectDetails.theChallenge")}
              </h2>
              <div className="text-lg leading-relaxed opacity-80 space-y-6 prose prose-invert max-w-none prose-strong:text-[var(--theme-color)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getLocalized(project.challenge, project.challenge_ar) ||
                    getLocalized(
                      project.longDescription,
                      project.longDescription_ar,
                    )?.split("\n\n")[0] ||
                    ""}
                </ReactMarkdown>
              </div>
            </div>

            <div className="lg:sticky lg:top-32">
              <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 md:p-12 rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div
                  className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-color)] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[var(--theme-color)] mb-8 relative z-10">
                  {t("projectDetails.technologies")}
                </h3>
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {project.techStack?.map((t) => (
                    <span
                      key={t}
                      className="bg-white/5 border border-white/10 hover:border-[var(--theme-color)] hover:text-[var(--theme-color)] text-white/80 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4b. FEATURES SECTION */}
      {filteredSections.some((s) => s.id === "features") && (
        <section id="features" className="py-24 md:py-32 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-color)] mb-4 block">
                  {t("projectDetails.keyFeatures", "Key Features")}
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                  {t(
                    "projectDetails.whatMakesItSpecial",
                    "What Makes It Special",
                  )}
                </h2>
                <p className="text-white/50 text-lg leading-relaxed">
                  {t(
                    "projectDetails.featuresIntro",
                    "Core functionality and standout capabilities that define this project.",
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div
                  className="absolute top-0 left-0 w-48 h-48 bg-[var(--theme-color)] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-li:marker:text-[var(--theme-color)] prose-ul:space-y-3 prose-li:text-white/80">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalized(project.features, project.features_ar) || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4c. FULL STORY / LONG DESCRIPTION */}
      {filteredSections.some((s) => s.id === "story") && (
        <section
          id="story"
          className="py-24 md:py-32 relative z-10 bg-[#080808]"
        >
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-cover opacity-5"></div>
          <div className="max-w-[900px] mx-auto px-6 md:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-color)] mb-4 block">
                {t("projectDetails.deepDive", "Deep Dive")}
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                {t("projectDetails.theStory", "The Full Story")}
              </h2>
            </div>
            <div className="prose prose-invert prose-lg max-w-none prose-strong:text-[var(--theme-color)] prose-headings:text-white prose-headings:font-black prose-p:text-white/70 prose-p:leading-relaxed prose-ul:space-y-2 prose-li:marker:text-[var(--theme-color)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getLocalized(
                  project.longDescription,
                  project.longDescription_ar,
                ) || ""}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* 4d. RESULTS SECTION */}
      {filteredSections.some((s) => s.id === "results") && (
        <section id="results" className="py-24 md:py-32 relative z-10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="lg:order-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-color)] mb-4 block">
                  {t("projectDetails.measurableSuccess", "Measurable Success")}
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                  {t("projectDetails.results", "Results & Achievements")}
                </h2>
                <p className="text-white/50 text-lg leading-relaxed">
                  {t(
                    "projectDetails.resultsIntro",
                    "Quantifiable outcomes and milestones achieved through this project.",
                  )}
                </p>
              </div>
              <div className="lg:order-1 bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 bg-[var(--theme-color)] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-li:marker:text-[var(--theme-color)] prose-ul:space-y-3 prose-li:text-white/80">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalized(project.results, project.results_ar) || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. THE JOURNEY (FIXED LAYOUT) */}
      {filteredSections.some((s) => s.id === "journey") && (
        <section
          id="journey"
          className="py-24 md:py-32 relative overflow-hidden"
        >
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-24 text-center tracking-tight">
              {t("projectDetails.theJourney")}
            </h2>

            <div className="relative max-w-5xl mx-auto">
              {/* SNAKE SVG LINE (Desktop Only) */}
              <div className="hidden md:block absolute top-0 left-0 w-full h-full -z-10 opacity-30">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                  className="overflow-visible"
                >
                  <path
                    d="M 500 0 
                      C 500 100, 100 100, 100 200 
                      C 100 300, 900 300, 900 400 
                      C 900 500, 100 500, 100 600 
                      C 100 700, 500 700, 500 800"
                    fill="none"
                    stroke="url(#gradient-path)"
                    strokeWidth="3"
                    strokeDasharray="10 10"
                  />
                  <defs>
                    <linearGradient
                      id="gradient-path"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#333" />
                      <stop offset="50%" stopColor={themeColor} />
                      <stop offset="100%" stopColor="#333" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* VERTICAL LINE (Mobile Only) - connects the dots */}
              <div
                className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, ${themeColor}80, transparent)`,
                }}
              ></div>

              <div className="space-y-4 md:space-y-0 relative">
                {project.journey?.map((phase, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    key={idx}
                    className={`relative flex flex-col items-center md:items-start md:mb-32 last:mb-0
                  ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
                `}
                  >
                    {/* Content Card */}
                    {/* FIX: Added mt-16 on mobile to push card DOWN below the dot */}
                    <div
                      className={`w-full md:w-[45%] bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl shadow-2xl relative group hover:border-[var(--theme-color)] transition-all duration-300 mt-16 md:mt-0
                      ${idx % 2 === 0 ? "md:mr-auto" : "md:ml-auto md:text-right"}
                    `}
                    >
                      {/* Glow effect on hover */}
                      <div
                        className="absolute inset-0 bg-[var(--theme-color)] opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300"
                        style={{ backgroundColor: themeColor }}
                      ></div>

                      <div
                        className={`flex items-center gap-4 mb-4 ${idx % 2 !== 0 && "md:flex-row-reverse"}`}
                      >
                        <span className="text-3xl md:text-4xl font-black text-white/5 group-hover:text-[var(--theme-color)]/20 transition-colors">
                          0{idx + 1}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold">
                          {getLocalized(phase.title, phase.title_ar)}
                        </h3>
                      </div>

                      <div className="text-sm md:text-base opacity-70 leading-relaxed text-white/80">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {getLocalized(
                            phase.description,
                            phase.description_ar,
                          ) || ""}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Center Node (Dot) */}
                    {/* FIX: Positioned absolute at top-0 for mobile, creating the gap filled by margin above */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-[#050505] border-4 border-[var(--theme-color)] shadow-[0_0_20px_var(--theme-color)] z-20 flex items-center justify-center text-[var(--theme-color)]"
                      style={{
                        borderColor: themeColor,
                        boxShadow: `0 0 20px ${themeColor}80`,
                        color: themeColor,
                        marginTop: idx === 0 ? "-20px" : "0",
                      }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!project.journey && (
                <div className="text-center py-20 opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
                  {t("projectDetails.journeyPending")}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. SHOWCASE GALLERY */}
      {filteredSections.some((s) => s.id === "gallery") && (
        <section id="gallery" className="py-24 md:py-32 bg-[#000]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
              {t("projectDetails.visualShowcase")}
            </h2>

            <div className="rounded-[40px] overflow-hidden bg-[#080808] border border-white/5 shadow-2xl relative group">
              <div className="h-[50vh] md:h-[80vh] relative flex items-center justify-center bg-[url('/images/grid.svg')] bg-cover bg-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    className="relative w-full h-full max-w-[95%] max-h-[90%]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[activeImg]}
                        fill
                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        alt={project.title}
                        priority={activeImg === 0}
                        sizes="(max-width: 1400px) 100vw, 1400px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
                        <LayoutGrid size={48} />
                        <span className="text-sm font-bold uppercase tracking-widest">
                          No Visual Assets
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[var(--theme-color)] hover:border-[var(--theme-color)] transition-all duration-300 z-20 group-hover:opacity-100 opacity-0 translate-x-[-20px] group-hover:translate-x-0"
                  onClick={() =>
                    setActiveImg((p) =>
                      p > 0 ? p - 1 : (project.images?.length || 1) - 1,
                    )
                  }
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[var(--theme-color)] hover:border-[var(--theme-color)] transition-all duration-300 z-20 group-hover:opacity-100 opacity-0 translate-x-[20px] group-hover:translate-x-0"
                  onClick={() =>
                    setActiveImg((p) =>
                      p < (project.images?.length || 1) - 1 ? p + 1 : 0,
                    )
                  }
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="p-6 md:p-8 flex justify-center gap-4 border-t border-white/5 bg-[#050505] overflow-x-auto">
                {project.images?.map((img, i) => (
                  <button
                    key={i}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${activeImg === i ? "border-[var(--theme-color)] opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}
                    style={{
                      borderColor: activeImg === i ? themeColor : "transparent",
                    }}
                    onClick={() => setActiveImg(i)}
                  >
                    <Image src={img} fill className="object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. IMPACT SECTION */}
      {filteredSections.some((s) => s.id === "impact") && (
        <section id="impact" className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="lg:order-2">
                <h2 className="text-4xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight">
                  {t("projectDetails.theOutcome")}
                </h2>
                <div className="text-lg leading-relaxed opacity-80 prose prose-invert max-w-none prose-ul:list-disc prose-li:marker:text-[var(--theme-color)]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalized(project.impact, project.impact_ar) ||
                      "The project successfully delivered a robust solution that addressed all initial challenges."}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="flex justify-center lg:order-1">
                <div className="relative bg-[#0A0A0A] border border-white/10 p-12 md:p-16 rounded-[40px] text-center w-full max-w-md overflow-hidden group">
                  <div
                    className="absolute top-0 right-0 w-40 h-40 bg-[var(--theme-color)] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-2xl bg-[var(--theme-color)] flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: themeColor,
                        boxShadow: `0 0 30px ${themeColor}66`,
                      }}
                    >
                      <Target className="text-white" size={40} />
                    </div>
                    <div className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                      100%
                    </div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-50">
                      {t("projectDetails.projectDelivery")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="py-20 text-center border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group border border-white/10 bg-white/5 text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[var(--theme-color)] hover:border-[var(--theme-color)] transition-all"
          >
            {t("projectDetails.backToTop")}
          </button>
        </div>
      </footer>
    </main>
  );
}
