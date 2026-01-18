import '../css/ProjectCard.css';

export function ProjectCard({ id, title, description, imageUrl, techStack , projectLink }) {
    // Construct the URL for the project details page
    const projectUrl = `/Portfolio-/#/project/${id}`;

    return (
        <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="project-card2">
            <div className="project-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
            <div className="project-overlay">
                <h3>{title}</h3>
                <ul className="tech-stack">
                    {techStack.map((tech, index) => (
                        <li key={index}>{tech}</li>
                    ))}
                </ul>
            </div>
        </a>
    );
}
