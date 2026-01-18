import  { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { data } from '../components/sidepanelData';
import { ToolIcon } from '../components/toolIcon';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../css/ProjectDetails.css';

export function ProjectDetails() {
    const { id } = useParams();
    const project = data.projects.find((project) => project.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="not-found-container">
                <h2>Project not found</h2>
                <Link to="/" className="back-link">Return Home</Link>
            </div>
        );
    }

    return (
        <div className='project-details-background'>
            <div className="project-details-container">
                
                {/* Navigation Back */}
                <div className="nav-back">
                    <Link to="/">← Back to Portfolio</Link>
                </div>

                <div className='projects-header-details'>
                    <header className="project-header">
                        <span className="project-category-tag">{project.category}</span>
                        <h1 className="project-title">{project.title}</h1>
                        <p className="project-summary-text">{project.shortDescription}</p>
                        
                        <div className="project-meta-grid">
                            <div className="meta-item">
                                <h3>Client</h3>
                                <p>{project.client}</p>
                            </div>
                            <div className="meta-item">
                                <h3>Timeline</h3>
                                <p>{project.date}</p>
                            </div>
                            <div className="meta-item">
                                <h3>Platforms</h3>
                                <p>{project.platforms}</p>
                            </div>
                        </div>

                        {project.projectLink && (
                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="live-demo-btn">
                                View Project <img src={data.Images.star} alt="" className="btn-icon"/>
                            </a>
                        )}
                    </header>

                    <section className="project-media">
                        <div className="image-gallery">
                            {/* Safer image loading */}
                            {project.images && project.images.length > 0 && (
                                <img src={project.images[0]} alt={project.title} className="hero-image" />
                            )}
                        </div>
                    </section>
                </div>

                <section className="project-content-body">
                    <div className='project-info-column'>
                        <div className="info-block">
                            <h2 className="section-title">Overview</h2>
                            {/* Render HTML for bolding text in description */}
                            <p className="project-description" dangerouslySetInnerHTML={{ __html: project.description }}></p>
                        </div>
                        
                        <div className="info-block benefit-block">
                            <h3 className='section-benefits-title'>Key Impact & Benefits</h3>
                            <p className="section-benefits">{project.projectBenefits}</p>
                        </div>
                    </div>

                    <div className='project-tech-column'>
                        <div className="technology-section">
                            <h2 className="section-title">Tech Stack</h2>
                            <div className="technology-grid">
                                {project.techStack.map((tech, index) => (
                                    <ToolIcon
                                        key={index}
                                        title={tech} // Capitalize first letter logic can be added here
                                        techStack={data.Images[tech]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary Image Section if available */}
                {project.images && project.images[1] && (
                    <section className='summary-media'>
                        <img
                            src={project.images[1]}
                            alt={`${project.title} Detail`}
                            className="detail-image"
                            style={{ boxShadow: `0 4px 20px ${project.color}` }}
                        />
                        <div className="summary-text">
                            <h2>Technical Execution</h2>
                            <p>{project.summary}</p>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}