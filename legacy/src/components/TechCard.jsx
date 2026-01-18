import '../css/TechCard.css';

export function TechCard({ title, tags, description, techStack }) {
    return (
        <div className="tech-card">
            <div className="tech-card-content">
                <div className="tech-card-header">
                    <h2>{title}</h2>
                    <div className="tech-stack-images">
                        {techStack.map((image, index) => (
                            <div key={index} className="tech-stack-image-container">
                                <img
                                    src={image}
                                    alt="Tech Logo"
                                    className="tech-stack-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tech-card-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tech-tag">{tag}</span>
                    ))}
                </div>
                <p>{description}</p>
            </div>
        </div>
    );
}
