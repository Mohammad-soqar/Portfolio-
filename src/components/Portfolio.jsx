import React from 'react';
import { ProjectCard } from './ProjectCard';
import { data } from './sidepanelData';

export function Portfolio() {
    const projects = [
        {
            title: 'LocaLink',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['Flutter', 'Dart', 'Firebase'],
            projectLink: 'https://my-portfolio.com'
        },
        {
            title: 'Portfolio Website',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['React', 'CSS', 'JavaS cript'],
            projectLink: 'https://my-portfolio.com'
        },
        {
            title: 'Portfolio Website',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['React', 'CSS', 'JavaS cript'],
            projectLink: 'https://my-portfolio.com'
        },
        {
            title: 'LocaLink',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['Flutter', 'Dart', 'Firebase'],
            projectLink: 'https://my-portfolio.com'
        },
        {
            title: 'Portfolio Website',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['React', 'CSS', 'JavaS cript'],
            projectLink: 'https://my-portfolio.com'
        },
        {
            title: 'Portfolio Website',
            description: 'A personal portfolio website built with React.',
            imageUrl: data.Images.LocaLink,
            techStack: ['React', 'CSS', 'JavaS cript'],
            projectLink: 'https://my-portfolio.com'
        },

        // Add more projects as needed
    ];

    return (
        <section className='portfolio'>
            <div className="section-tag">
                <img src={data.Images.star} alt="" />
                <p>Portfolio!</p>
            </div>
            <div className="portfolio-grid">

                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        title={project.title}
                        description={project.description}
                        imageUrl={project.imageUrl}
                        techStack={project.techStack}
                        projectLink={project.projectLink}
                    />
                ))}
            </div>
        </section>
    );
}
