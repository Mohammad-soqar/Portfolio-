// Portfolio.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { data } from './sidepanelData';
import '../css/Portfolio.css';

const CATEGORIES = ['All', 'Mobile', 'Web', 'UI/UX'];

export function Portfolio() {
  // Single-select (switch) state
  const [selected, setSelected] = useState('All');

  // Mobile "View More"
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Switch handler
  const chooseCategory = (cat) => {
    setSelected(cat);
    setShowMore(false);
  };

  const normalize = (s) => (s || '').trim().toLowerCase();

  // Filter (single category)
  const filteredProjects = useMemo(() => {
    if (selected === 'All') return data.projects;
    const sel = normalize(selected);
    return data.projects.filter((p) => {
      const tags = Array.isArray(p.types) ? p.types : (p.type ? [p.type] : []);
      return tags.map(normalize).includes(sel);
    });
  }, [selected]);

  const projectsToDisplay =
    isMobile && !showMore ? filteredProjects.slice(0, 3) : filteredProjects;

  return (
    <section className="portfolio" id="portfolio">
      {/* Header row: left tag + right segmented switch */}
      <div className="portfolio-header">
        <div className="section-tag portfolio-tag">
          <img src={data.Images.star} alt="Star Icon" />
          <p>Portfolio!</p>
        </div>

        {/* Segmented switch */}
        <div className="segmented-wrap" role="tablist" aria-label="Project category">
          {CATEGORIES.map((cat) => {
            const active = selected === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                className={`segment ${active ? 'active' : ''}`}
                onClick={() => chooseCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="portfolio-grid">
        {projectsToDisplay.map((project, index) => (
          <ProjectCard
            key={index}
            id={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.images?.[0]}
            techStack={project.techStack}
            projectLink={project.projectLink}
          />
        ))}
      </div>

      {/* View More (mobile only; respects current filter) */}
      {isMobile && filteredProjects.length > 3 && (
        <div className="view-more-button">
          <button onClick={() => setShowMore(!showMore)}>
            {showMore ? 'View Less' : 'View More'}
          </button>
        </div>
      )}
    </section>
  );
}
