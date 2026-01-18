"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, Github, Sparkles, 
  ChevronLeft, ChevronRight, Cpu, Target, Award, UserCheck
} from 'lucide-react';
import { getById } from '@/lib/firestore';
import { Project } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const SECTIONS = [
  { id: 'hero', name: 'Intro' },
  { id: 'challenge', name: 'Challenge' },
  { id: 'journey', name: 'The Journey' },
  { id: 'gallery', name: 'Showcase' },
  { id: 'impact', name: 'Impact' }
];

export default function ProjectPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      const data = await getById<Project>('projects', id as string);
      if (data) setProject(data);
      setLoading(false);
    }
    loadProject();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.1, 0.3, 0.5] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [project]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="pd-loading">
      <div className="pd-loader"></div>
      <span>{t('hero.architecting')}</span>
    </div>
  );

  if (!project) return (
    <div className="pd-error">
      <h1>Project Not Found</h1>
      <button onClick={() => router.push('/')} className="pd-back-home">
        <ArrowLeft size={18} /> {t('common.back')}
      </button>
    </div>
  );

  return (
    <main className="pd-main">
      {/* 1. FIXED NAV */}
      <nav className="pd-nav">
        <div className="pd-nav-content">
          <button onClick={() => router.push('/')} className="pd-nav-back">
            <ArrowLeft size={18} /> {t('common.back')}
          </button>
          <div className="pd-nav-brand">
            {project.logo && (
              <div className="relative w-8 h-8 overflow-hidden bg-white/5 rounded-lg">
                <Image src={project.logo} fill className="object-contain p-1" alt="" />
              </div>
            )}
            <span>{project.title}</span>
          </div>
          <div className="pd-nav-actions">
            <a href={project.projectLink} target="_blank" className="pd-visit-btn">
              {t('common.visitSite')} <ExternalLink size={14} />
            </a>
            <div className="nav-lang-divider">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SIDE PROGRESS NAV */}
      <div className="pd-side-nav">
        {SECTIONS.map((s) => (
          <button 
            key={s.id} 
            className={`pd-dot-wrap ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            <span className="pd-dot-label">{t(`portfolio.${s.id === 'gallery' ? 'showcase' : s.id === 'hero' ? 'intro' : s.id}`)}</span>
            <div className="pd-dot"></div>
          </button>
        ))}
      </div>

      {/* 3. HERO SECTION */}
      <section id="hero" className="pd-hero">
        <div className="pd-hero-glow"></div>
        <div className="pd-container">
          <div className="pd-hero-content">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="pd-hero-top"
            >
              <div className="pd-tag">
                <Sparkles size={14} /> {t('portfolio.caseStudy')}
              </div>
              <h1 className="pd-title">{project.title}</h1>
              <p className="pd-pitch">{project.shortDescription}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CHALLENGE SECTION */}
      <section id="challenge" className="pd-section">
        <div className="pd-container">
          <div className="pd-grid-half">
            <div className="pd-challenge-text">
              <h2 className="pd-section-title">{t('projectDetails.theChallenge')}</h2>
              <div className="pd-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.challenge || project.longDescription?.split('\n\n')[0]}
                </ReactMarkdown>
              </div>
            </div>
            <div className="pd-challenge-meta">
              <div className="pd-meta-card">
                <h3>{t('projectDetails.technologies')}</h3>
                <div className="pd-tech-list">
                  {project.techStack?.map(t => (
                    <span key={t} className="pd-tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE JOURNEY (SNAKE PATH) - PURPLE THEMED */}
      <section id="journey" className="pd-section pd-journey-bg">
        <div className="pd-container">
          <h2 className="pd-section-title centered">{t('projectDetails.theJourney')}</h2>
          <div className="pd-snake-wrap">
            {/* SVG Connector Line */}
            <svg className="pd-snake-line" viewBox="0 0 100 800" preserveAspectRatio="none">
              <path 
                d="M 50 0 Q 80 100 50 200 Q 20 300 50 400 Q 80 500 50 600 Q 20 700 50 800" 
                fill="none" 
                stroke="#7628E5" 
                strokeWidth="2" 
                strokeDasharray="8 8"
              />
            </svg>

            {project.journey?.map((phase, idx) => (
              <div key={idx} className={`pd-phase-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="pd-phase-content">
                  <div className="pd-phase-header">
                    <span className="pd-phase-num">0{idx + 1}</span>
                    <h3>{phase.title}</h3>
                  </div>
                  <div className="pd-markdown-journey">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {phase.description}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="pd-phase-dot"></div>
              </div>
            ))}
            
            {!project.journey && (
              <div className="pd-journey-empty">
                {t('projectDetails.journeyPending')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. SHOWCASE GALLERY */}
      <section id="gallery" className="pd-section gallery-dark">
        <div className="pd-container">
          <h2 className="pd-section-title">{t('projectDetails.visualShowcase')}</h2>
          <div className="pd-gallery-carousel">
            <div className="pd-gallery-main">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeImg}
                  className="pd-gallery-img relative overflow-hidden shimmer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '600px', width: '100%' }}
                >
                  <Image 
                    src={project.images[activeImg]} 
                    fill 
                    className="object-contain" 
                    alt={project.title}
                    priority={activeImg === 0}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </motion.div>
              </AnimatePresence>
              <button className="pd-gallery-nav prev" onClick={() => setActiveImg(p => p > 0 ? p - 1 : project.images.length - 1)}>
                <ChevronLeft size={24} />
              </button>
              <button className="pd-gallery-nav next" onClick={() => setActiveImg(p => p < project.images.length - 1 ? p + 1 : 0)}>
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="pd-gallery-thumbs">
              {project.images.map((img, i) => (
                <button 
                  key={i} 
                  className={`pd-thumb-dot ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. IMPACT SECTION */}
      <section id="impact" className="pd-section">
        <div className="pd-container">
          <div className="pd-grid-half reversed">
            <div className="pd-impact-text">
              <h2 className="pd-section-title">{t('projectDetails.theOutcome')}</h2>
              <div className="pd-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.impact || "The project successfully delivered a robust solution that addressed all initial challenges, resulting in significant business value and improved user experience."}
                </ReactMarkdown>
              </div>
            </div>
            <div className="pd-impact-visual">
              <div className="pd-outcome-card">
                <Target color="#7628E5" size={40} />
                <div className="pd-outcome-val">100%</div>
                <div className="pd-outcome-label">{t('projectDetails.projectDelivery')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="pd-footer">
        <div className="pd-container">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="pd-scroll-top">
            {t('projectDetails.backToTop')}
          </button>
        </div>
      </footer>
    </main>
  );
}
