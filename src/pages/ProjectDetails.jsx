import React from 'react';
import { useParams } from 'react-router-dom';
import { data } from '../components/sidepanelData';
import { ToolIcon } from '../components/toolIcon';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import '../css/ProjectDetails.css'; // Import the CSS file for styling


export function ProjectDetails() {
    const { id } = useParams();
    const project = data.projects.find((project) => project.id === id);
    const projectUrl = `/`;
    if (!project) {
        return <div className="not-found">Project not found</div>;
    }

    return (
        <div className='project-details-background'>
            <div className="project-details-container">
                <a href={projectUrl} rel="noopener noreferrer" className="project-card2">Back</a>

                <div className='projects-header-details'>
                    <header className="project-header">
                        <h1 className="project-title">{project.title}</h1>
                        <p className="project-summary">{project.shortDescription}</p>
                    </header>
                    <section className="project-media">
                        <div className="image-gallery">
                            <img src={project.images[1]} alt={project.title} className="projectDetails-image" />
                        </div>
                    </section>
                </div>

                <section className="project-details">
                    <div className='project-info'>
                        <div>
                            <h2 className="section-title">Overview:</h2>
                            <p className="project-description">{project.description}</p>
                            <p className="project-link"><a href={project.projectLink} target="_blank" rel="noopener noreferrer">View Project</a></p>
                        </div>
                        <div>
                            <h3 className='section-benefits-title'>Project Benefits:</h3>
                            <p className="section-benefits">{project.projectBenefits}</p>
                        </div>

                    </div>
                    <div className='project-category'>
                        <div>
                            <h3>Category</h3>
                            <p>{project.category}</p>
                        </div>
                        <div>
                            <h3>Clients</h3>
                            <p>{project.client}</p>
                        </div>
                        <div>
                            <h3>Date</h3>
                            <p>{project.date}</p>
                        </div>
                        <div>
                            <h3>Platforms</h3>
                            <p>{project.platforms}</p>
                        </div>
                    </div>
                </section>
                <section className='summary'>
                    <img
                        src={project.images[2]}
                        alt={project.title}
                        className="projectDetails-image"
                        style={{
                            boxShadow: `0 4px 17px ${project.color}`,
                            borderRadius: '8px'
                        }}
                    />                    <div>
                        <h2>Summary:</h2>
                        <p>{project.summary}</p>
                    </div>
                </section>

                <section className="technology-section">
                    <h2 className="section-title">Technologies Used:</h2>
                    <ul className="technology-list">
                        {project.techStack.map((tech, index) => (

                            <ToolIcon
                                key={index}
                                title={tech}
                                techStack={data.Images[tech]}
                            />

                        ))}
                    </ul>
                </section>
            </div>
        </div>

    );
}
