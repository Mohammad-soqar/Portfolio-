"use client";
import { useState, useEffect, useMemo } from "react";
import { getAll } from "@/lib/firestore";

export const dynamic = "force-dynamic";
import { Experience, Project, Profile } from "@/types";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserCircle, ExternalLink, Github, Linkedin, Instagram, Plus, X, Award, Target } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const CATEGORIES = ["All", "Mobile", "Web", "UI/UX", "AI"];

export default function Home() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, projData, profData] = await Promise.all([
          getAll<Experience>("experiences", "createdAt"),
          getAll<Project>("projects", "createdAt"),
          getAll<Profile>("profile")
        ]);
        setExperiences(expData);
        setProjects(projData);
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
    return projects.filter(p => 
      p.techStack?.some(tech => tech.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (p as any).types?.some((t: string) => t.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [projects, selectedCategory]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>{t('hero.architecting')}</p>
      </div>
    );
  }

  return (
    <main className="landing-wrapper">
      <nav className="floating-nav">
        <div className="nav-glass">
          <div className="nav-links flex gap-8">
            <Link href="#home">{t('nav.home')}</Link>
            <Link href="#portfolio">{t('nav.work')}</Link>
            <Link href="#about">{t('nav.about')}</Link>
            <Link href="#contact">{t('nav.contact')}</Link>
          </div>
          <div className="nav-lang-divider">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
      
      <div className="container">
        {/* HEADER SECTION */}
        <section className="header-section" id="home">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="header-main"
          >
            <motion.div variants={itemVariants} className="section-tag">
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="Star" fill />
              </div>
              <p>{t('hero.welcome')}</p>
            </motion.div>
            
            <motion.h1 variants={itemVariants}>
              I am {profile?.name || "Mohammad Ahmad"}, <br/> 
              <span className="gradient-text">{profile?.role || "Software Engineer"}</span>.
            </motion.h1>
            
            <motion.p variants={itemVariants} className="header-subtitle">
              {profile?.catchyPhrase || "Enhancing UI/UX and building scalable, secure web applications. Engineering clarity into complex systems."}
            </motion.p>

            <motion.div variants={itemVariants} className="header-cta-section">
              <Link href="#portfolio" className="highlight-btn">
              {t('hero.viewWork')}
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="" fill />
              </div>
            </Link>
              {profile?.cvLink && (
                <a href={profile.cvLink} target="_blank" className="header-cta">
                {t('hero.downloadCv')} 
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
            className="hero-image-wrap"
          >
            {profile?.profilePic ? (
              <div className="hero-img relative overflow-hidden shimmer">
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
                <div className="hero-img glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <UserCircle size={100} opacity={0.1} />
                </div>
            )}
            <div className="img-glow"></div>
          </motion.div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section className="portfolio" id="portfolio">
          <div className="portfolio-header">
            <div className="section-tag portfolio-tag">
              <div className="relative w-[14px] h-[14px]">
                <Image src="/images/Star.png" alt="Star" fill />
              </div>
              <p>{t('portfolio.title')}</p>
            </div>

            <div className="segmented-wrap">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`segment ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {t(`portfolio.${cat.toLowerCase().replace('/', '')}`)}
                </button>
              ))}
            </div>
          </div>

        <motion.div layout className="portfolio-grid">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id || idx} project={project} idx={idx} />
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '8rem 0 4rem', textAlign: 'center' }}>
        <p style={{ opacity: 0.3, fontSize: '0.8rem' }}>© 2026 Mohammad Ahmad. Narrative Engineering.</p>
      </footer>

        {/* RESUME SECTION */}
        <section className="resume" id="resume">
          <div className="section-tag">
            <div className="relative w-[14px] h-[14px]">
              <Image src="/images/Star.png" alt="Star" fill />
            </div>
            <p>{t('resume.tag')}</p>
          </div>
          <h2 className="table-title">{t('resume.title')}</h2>
          
          <div className="experience-timeline">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={exp.id || idx}
                className="experience-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="exp-header">
                  <h3>{exp.company} — {exp.role}</h3>
                  <span className="exp-date">{exp.date}</span>
                </div>
                <p style={{ opacity: 0.6, marginBottom: '1rem' }}>{exp.location}</p>
                <div className="exp-markdown" style={{ marginTop: '1rem' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {exp.description?.join("\n") || ""}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="About" id="about">
          <div className="section-tag">
            <div className="relative w-[14px] h-[14px]">
              <Image src="/images/Star.png" alt="Star" fill />
            </div>
            <p>{t('about.tag')}</p>
          </div>
          
          <div className="metrics">
            <div className="metric-item">
              <span className="metric-num">{profile?.githubContributions || "2k+"}</span>
              <span className="metric-label">GitHub Contributions</span>
            </div>
            <div className="metric-item">
              <span className="metric-num">{profile?.experienceYears || "2+"}</span>
              <span className="metric-label">Years Experience</span>
            </div>
            <div className="metric-item">
              <span className="metric-num">{profile?.projectsDone || "14+"}</span>
              <span className="metric-label">Projects Completed</span>
            </div>
          </div>

          <div className="about-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{profile?.catchyPhrase || "Engineering clarity into complex systems."}</h2>
            <div className="about-bio-markdown" style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.8 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {profile?.aboutMe || "I am a software engineer with 2 years of experience specializing in full-stack development and AI integration. I transform complex requirements into pixel-perfect, scalable applications. From winning Teknofest awards to architecting enterprise SaaS platforms, I focus on delivering high-impact code."}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="ContactMe-Section" id="contact">
          <h2 className="Contact-Me">{t('contact.title')}</h2>
          <a href={`mailto:${profile?.email || "mnsoqar1@gmail.com"}`} className="gradient-text">
            Let&apos;s build something amazing
          </a>
          <ul className="social-link-Contact">
            <li><a href="https://github.com/Mohammad-soqar">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/mohammad-soqar/">LinkedIn</a></li>
            <li><a href="https://www.instagram.com/mohammad_soqar/">Instagram</a></li>
          </ul>
        </section>

        <footer style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem' }}>
          © 2026 Mohammad Ahmad. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
