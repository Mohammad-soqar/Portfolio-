"use client";
import { useState, useEffect, useMemo } from "react";
import { getAll } from "@/lib/firestore";

export const dynamic = "force-dynamic";
import { Experience, Project, Profile } from "@/types";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  UserCircle,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const CATEGORIES = ["All", "Mobile", "Web", "UI/UX", "AI"];

// Helper to get localized content
const getLocalized = <T extends string | undefined>(
  content: T,
  contentAr: T,
  lang: string,
): T => {
  if (lang === "ar" && contentAr) return contentAr;
  return content;
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, projData, profData] = await Promise.all([
          getAll<Experience>("experiences", "order", "asc"),
          getAll<Project>("projects", "createdAt", "desc"),
          getAll<Profile>("profile"),
        ]);
        setExperiences(expData);

        // Sort projects in memory: order (asc), then createdAt (desc) fallback
        const sortedProjects = [...projData].sort((a, b) => {
          const orderA = a.order ?? 999;
          const orderB = b.order ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        });

        setProjects(sortedProjects);
        if (profData.length > 0) setProfile(profData[0]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter(
      (p) =>
        p.categories?.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase(),
        ) ||
        p.techStack?.some((tech) =>
          tech.toLowerCase().includes(selectedCategory.toLowerCase()),
        ),
    );
  }, [projects, selectedCategory]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white gap-6">
        <div className="w-10 h-10 border-[3px] border-[rgba(118,40,229,0.2)] border-t-[#7628E5] rounded-full animate-spin"></div>
        <p>{t("hero.architecting")}</p>
      </div>
    );
  }

  // Common Styles mapped from your CSS
  const sectionTagStyle =
    "flex items-center gap-2 font-semibold uppercase tracking-[0.1em] text-[0.8rem] mb-8 text-white";
  const gradientText =
    "bg-gradient-to-br from-white via-white to-[var(--accent-color)] bg-clip-text text-transparent";

  return (
    <main className="min-h-screen bg-[var(--bg-color)] bg-[url('/images/Background.png')] bg-cover bg-fixed text-[var(--text-color)] font-[family-name:var(--font-family)] antialiased leading-relaxed selection:bg-[var(--accent-color)] selection:text-white">
      {/* FLOATING NAV */}
      <nav className="fixed z-[1000] w-[90%] md:w-auto left-1/2 -translate-x-1/2 bottom-8 md:bottom-auto md:top-8">
        <div className="flex gap-4 md:gap-8 items-center justify-center bg-[rgba(10,10,10,0.4)] backdrop-blur-xl backdrop-saturate-[180%] border border-white/10 px-6 py-3 md:px-10 md:py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] w-full">
          <div className="flex gap-4 md:gap-8">
            {["home", "portfolio", "about", "contact"].map((item) => (
              <Link
                key={item}
                href={`#${item === "portfolio" ? "portfolio" : item}`}
                className="text-[0.9rem] font-semibold text-white/60 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] capitalize"
              >
                {t(`nav.${item === "portfolio" ? "work" : item}`)}
              </Link>
            ))}
          </div>
          <div className="flex items-center pl-4 ml-2 border-l border-white/10 h-6">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        {/* HEADER SECTION */}
        <section
          className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between pb-20 pt-24 lg:pt-0 gap-12 lg:gap-16"
          id="home"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className={sectionTagStyle}>
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="Star" fill />
              </div>
              <p>{t("hero.welcome")}</p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[2.5rem] md:text-[4rem] leading-[1.1] font-extrabold mb-6"
            >
              {i18n.language === "ar" ? "أنا" : "I am"}{" "}
              {getLocalized(profile?.name, profile?.name_ar, i18n.language) ||
                "Mohammad Ahmad"}
              , <br />
              <span className={gradientText}>
                {getLocalized(profile?.role, profile?.role_ar, i18n.language) ||
                  "Software Engineer"}
              </span>
              .
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl max-w-[600px] mb-10 opacity-70"
            >
              {getLocalized(
                profile?.catchyPhrase,
                profile?.catchyPhrase_ar,
                i18n.language,
              ) ||
                "Enhancing UI/UX and building scalable, secure web applications."}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="#portfolio"
                className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-[0_4px_15px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_var(--accent-glow)]"
              >
                {t("hero.viewWork")}
                <div className="relative w-[14px] h-[14px]">
                  <Image src="/images/Star.png" alt="" fill />
                </div>
              </Link>
              {profile?.cvLink && (
                <a
                  href={profile.cvLink}
                  target="_blank"
                  className="border border-[var(--border-color)] px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/5"
                >
                  {t("hero.downloadCv")}
                  <div className="relative w-[14px] h-[14px]">
                    <Image src="/images/Star.png" alt="" fill />
                  </div>
                </a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full lg:flex-1 max-w-[400px] lg:max-w-[450px] relative flex justify-center items-center"
          >
            {profile?.profilePic ? (
              <div className="w-full aspect-square relative z-10 rounded-[30px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_8%,rgba(255,255,255,0.1)_18%,rgba(255,255,255,0.05)_33%)] bg-[length:1000px_100%] animate-[shimmer_2s_infinite_linear]">
                <Image
                  src={profile.profilePic}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>
            ) : (
              <div className="w-full aspect-square relative z-10 rounded-[30px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center">
                <UserCircle size={100} opacity={0.1} />
              </div>
            )}
            <div className="absolute w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(118,40,229,0.3),transparent_70%)] z-0 blur-[40px]"></div>
          </motion.div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section className="py-12 md:py-24" id="portfolio">
          <div className="flex flex-col items-center mb-12 gap-8">
            <div className={sectionTagStyle + " mb-0"}>
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="Star" fill />
              </div>
              <p>{t("portfolio.title")}</p>
            </div>

            <div className="w-full flex items-center justify-center md:justify-center overflow-x-auto no-scrollbar py-2 px-4 whitespace-nowrap">
              <div className="inline-flex p-1.5 rounded-full bg-[rgba(255,255,255,0.06)] border border-white/10 backdrop-blur-sm whitespace-nowrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full cursor-pointer font-medium transition-all duration-200 text-sm md:text-base ${selectedCategory === cat ? "bg-[var(--accent-color)] text-white shadow-[0_4px_12px_var(--accent-glow)]" : "bg-transparent text-white hover:text-white"}`}
                  >
                    {t(`portfolio.${cat.toLowerCase().replace("/", "")}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, idx) => (
              // Note: Ensure ProjectCard component accepts generic stylings or is updated to tailwind too.
              // Assuming ProjectCard is wrapper, here is the container style recreated from .project-card
              <div key={project.id || idx} className="h-auto ">
                <ProjectCard project={project} idx={idx} />
              </div>
            ))}
          </motion.div>
        </section>

        {/* RESUME SECTION */}
        <section className="py-12 md:py-24" id="resume">
          <div className={sectionTagStyle}>
            <div className="relative w-[14px] h-[14px]">
              <Image src="/images/Star.png" alt="Star" fill />
            </div>
            <p>{t("resume.tag")}</p>
          </div>
          <h2 className="text-[2rem] md:text-[2.5rem] mb-8 md:mb-12 font-bold">
            {t("resume.title")}
          </h2>

          <div className="flex flex-col gap-8 md:gap-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id || idx}
                className="border-b border-white/10 pb-8 md:pb-12 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4 gap-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {getLocalized(exp.company, exp.company_ar, i18n.language)} —{" "}
                    {getLocalized(exp.role, exp.role_ar, i18n.language)}
                  </h3>
                  <span className="font-semibold">{exp.date}</span>
                </div>
                <p className="opacity-60 mb-4">
                  {getLocalized(exp.location, exp.location_ar, i18n.language)}
                </p>

                {/* Markdown Styles Matching CSS */}
                <div className="text-[0.95rem] opacity-80 leading-[1.6] [&>ul]:list-none [&>ul]:pl-2 [&>ul>li]:mb-3 [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:before:content-['●'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 rtl:[&>ul>li]:before:right-0 rtl:[&>ul>li]:before:left-auto rtl:[&>ul>li]:pl-0 rtl:[&>ul>li]:pr-6 [&>ul>li]:before:text-[var(--text-color)] [&>ul>li]:before:font-bold">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalized(
                      Array.isArray(exp.description)
                        ? exp.description.join("\n")
                        : exp.description || "",
                      exp.description_ar,
                      i18n.language,
                    ) || ""}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-12 md:py-24" id="about">
          <div className={sectionTagStyle}>
            <div className="relative w-[14px] h-[14px]">
              <Image src="/images/Star.png" alt="Star" fill />
            </div>
            <p>{t("about.tag")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[32px] text-center transition-all duration-400 hover:bg-[rgba(118,40,229,0.05)] hover:border-[rgba(118,40,229,0.2)] hover:-translate-y-1">
              <span className="text-[3rem] md:text-[3.5rem] font-extrabold block mb-2 text-white">
                {profile?.githubContributions || "2k+"}
              </span>
              <span className="opacity-40 uppercase text-xs tracking-[0.2em] font-bold">
                GitHub Contributions
              </span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[32px] text-center transition-all duration-400 hover:bg-[rgba(118,40,229,0.05)] hover:border-[rgba(118,40,229,0.2)] hover:-translate-y-1">
              <span className="text-[3rem] md:text-[3.5rem] font-extrabold block mb-2 text-white">
                {profile?.experienceYears || "2+"}
              </span>
              <span className="opacity-40 uppercase text-xs tracking-[0.2em] font-bold">
                Years Experience
              </span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[32px] text-center transition-all duration-400 hover:bg-[rgba(118,40,229,0.05)] hover:border-[rgba(118,40,229,0.2)] hover:-translate-y-1">
              <span className="text-[3rem] md:text-[3.5rem] font-extrabold block mb-2 text-white">
                {profile?.projectsDone || "14+"}
              </span>
              <span className="opacity-40 uppercase text-xs tracking-[0.2em] font-bold">
                Projects Completed
              </span>
            </div>
          </div>

          <div className="max-w-[800px]">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {getLocalized(
                profile?.catchyPhrase,
                profile?.catchyPhrase_ar,
                i18n.language,
              ) || "Engineering clarity into complex systems."}
            </h2>
            <div className="text-[1.1rem] opacity-80 leading-[1.8] [&>p]:mb-6 [&>strong]:text-white [&>strong]:font-bold [&>ul]:mb-6 [&>ul]:pl-6 [&>li]:mb-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getLocalized(
                  profile?.aboutMe,
                  profile?.aboutMe_ar,
                  i18n.language,
                ) ||
                  "I am a software engineer with 2 years of experience specializing in full-stack development and AI integration."}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <ContactForm />

        {/* SOCIAL LINKS SECTION */}
        <section className="pb-24 md:pb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className={sectionTagStyle + " mb-12"}
            >
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="Star" fill />
              </div>
              <p>{i18n.language === "ar" ? "تواصل معي" : "Connect with me"}</p>
            </motion.div>

            <motion.ul
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-4 md:gap-6 list-none"
            >
              {[
                {
                  name: "GitHub",
                  href: "https://github.com/Mohammad-soqar",
                  icon: <Github size={20} />,
                  color:
                    "hover:text-[#fff] hover:border-[#6e5494] hover:bg-[#6e5494]/10",
                },
                {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/in/mohammad-soqar/",
                  icon: <Linkedin size={20} />,
                  color:
                    "hover:text-[#0077b5] hover:border-[#0077b5] hover:bg-[#0077b5]/10",
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/mohammad_soqar/",
                  icon: <Instagram size={20} />,
                  color:
                    "hover:text-[#e4405f] hover:border-[#e4405f] hover:bg-[#e4405f]/10",
                },
              ].map((social) => (
                <motion.li key={social.name} variants={itemVariants}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 border border-white/10 px-6 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm bg-white/[0.02] ${social.color}`}
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                      {social.icon}
                    </span>
                    <span className="font-semibold text-[0.95rem]">
                      {social.name}
                    </span>
                    <ExternalLink
                      size={14}
                      className="opacity-0 group-hover:opacity-40 transition-all -translate-y-1 translate-x-1"
                    />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 md:py-24 text-center opacity-30 text-[0.8rem]">
          <p>© 2026 Mohammad Ahmad. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
