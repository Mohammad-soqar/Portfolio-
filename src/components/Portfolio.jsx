// Portfolio.js
import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { data } from './sidepanelData';
import '../css/Portfolio.css';

export function Portfolio() {
    // State to control the "View More" functionality
    const [showMore, setShowMore] = useState(false);

    // Get the number of projects to display based on screen size
    const isMobile = window.innerWidth <= 768;

    // Show all projects on desktop, and only the first 3 on mobile
    const projectsToDisplay = isMobile && !showMore ? data.projects.slice(0, 3) : data.projects;

    return (
        <section className='portfolio' id='portfolio'>
            <div className="section-tag portfolio-tag">
                <img src={data.Images.star} alt="Star Icon" />
                <p>Portfolio!</p>
            </div>
            <div className="portfolio-grid">
                {projectsToDisplay.map((project, index) => (
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
            
            {/* Show 'View More' button only on mobile and if there are more than 3 projects */}
            {isMobile && data.projects.length > 3 && (
                <div className="view-more-button">
                    <button onClick={() => setShowMore(!showMore)}>
                        {showMore ? 'View Less' : 'View More'}
                    </button>
                </div>
            )}
        </section>
    );
}
