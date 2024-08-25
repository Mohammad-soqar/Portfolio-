import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/ProjectCard.css'

export function ProjectCard({ title, description, imageUrl, techStack, projectLink }) {
    const navigate = useNavigate(); // use useNavigate() for react-router v6

    const handleClick = () => {
        navigate.push(projectLink);
    };

    return (
        <div className="project-card2">
        <div className="project-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <div className="project-overlay">
            <h3>{title}</h3>
           
            <ul className="tech-stack"> 
                {techStack.map((tech, index) => (
                    <li key={index}>{tech}</li>
                ))}
            </ul>
        </div>
    </div>
    );
}
