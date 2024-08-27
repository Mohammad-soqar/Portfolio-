// Portfolio.js
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { data } from './sidepanelData';

export function Portfolio() {
    return (
        <section className='portfolio' id='portfolio'>
            <div className="section-tag portfolio-tag">
                <img src={data.Images.star} alt="Star Icon" />
                <p>Portfolio!</p>
            </div>
            <div className="portfolio-grid">
                {data.projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        imageUrl={project.images[0]} // Retrieve the first image in the array
                        techStack={project.techStack}
                        projectLink={project.projectLink}
                    />
                ))}
            </div>
        </section>
    );
}
