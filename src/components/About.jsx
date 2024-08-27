import React from 'react';
import { Link } from 'react-router-dom';
import { data } from './sidepanelData';
import { TechCard } from './TechCard';
import "../css/About.css";

export function About() {
    const { metrics, personalInfo } = data.aboutMe;

    const skills = [
        {
            title: "Mobile Development",
            tags: ["MobileDev", "Android", "iOS"],
            description: "Building cross-platform mobile apps that work seamlessly on both Android and iOS.",
            techStack: [data.Images.flutter, data.Images.dart, data.Images.firebase]
        },
        {
            title: "Front-End",
            tags: ["Frontend", "WebDesign"],
            description: "Creating engaging, user-friendly interfaces for web applications.",
            techStack: [data.Images.react, data.Images.js]
        },
        {
            title: "Back-End",
            tags: ["Backend", "ServerSide"],
            description: "Developing robust server-side logic and managing databases for scalable applications.",
            techStack: [data.Images.nodejs, data.Images.aspnet, data.Images.csharp, data.Images.firebase]
        },
        {
            title: "Artificial Intelligence",
            tags: ["Machine Learning", "PythonAI"],
            description: "Implementing machine learning models and AI-driven solutions to solve complex problems.",
            techStack: [data.Images.python, data.Images.colab, data.Images.chatgpt]
        },
        {
            title: "UI/UX Design",
            tags: ["UIUX", "User Experience"],
            description: "Designing intuitive and visually appealing user experiences.",
            techStack: [data.Images.figma]
        },
        {
            title: "Databases",
            tags: ["Databases", "Data Storage"],
            description: "Managing and organizing data storage solutions for applications.",
            techStack: [data.Images.firebase, data.Images.mysql, data.Images.mongodb]
        },
        {
            title: "Version Control Tools",
            tags: ["Version Control", "Collaboration"],
            description: "Managing and tracking changes in code efficiently using Git and GitHub.",
            techStack: [data.Images.git, data.Images.github]
        },
        {
            title: "Graphic Design",
            tags: ["Graphic Design", "Adobe Creative"],
            description: "Crafting visually striking designs and graphics using industry-standard tools.",
            techStack: [data.Images.illustrator, data.Images.photoshop]
        },
    ];

    return (
        <section className='About'>
            <div className="section-tag">
                <img src={data.Images.star} alt="Star" />
                <p>About Me!</p>
            </div>
            <div className="About-content">
                <h2 className='catchy-phrase gradient-text'>{personalInfo.catchyphrase}</h2>
                <div className='metrics'>
                    <div className='metric-item'>
                        <p className='metric-num gradient-text'>{metrics.githubContributions}</p>
                        <p>GitHub Contributions</p>
                    </div>
                    <div className='metric-item'>
                        <p className='metric-num gradient-text'>{metrics.experienceYears}</p>
                        <p>Years of experience</p>
                    </div>
                    <div className='metric-item'>
                        <p className='metric-num gradient-text'>{metrics.projectsDone}</p>
                        <p>Projects done</p>
                    </div>
                </div>
                <div className='personal'>
                    <div className='about-cv'>
                        <p>{personalInfo.aboutnme}</p>
                        <a href='https://drive.google.com/file/d/1q0cG1bVah8QrlUMPj5JTfZyf2XW1WvWt/view?usp=drive_link' target="_blank" className="header-cta" download>
                            Download CV <img src={data.Images.star} alt="Star" />
                        </a>
                    </div>
                    <div className='personal-info'>
                        <div className='personal-info-item'>
                            <label>Name</label>
                            <p>{personalInfo.name}</p>
                        </div>
                        <div className='personal-info-item'>
                            <label>Phone</label>
                            <p>{personalInfo.phone}</p>
                        </div>
                        <div className='personal-info-item'>
                            <label>Email</label>
                            <p>{personalInfo.email}</p>
                        </div>
                        <div className='personal-info-item'>
                            <label>Location</label>
                            <p>{personalInfo.location}</p>
                        </div>
                    </div>
                </div>
                <div className="skills-section">
                    <h3 className='gradient-text catchy-phrase'>Tech-Stack :</h3>
                    <div className='skills'>
                        {skills.map((skill, index) => (
                            <TechCard
                                key={index}
                                title={skill.title}
                                tags={skill.tags}
                                description={skill.description}
                                techStack={skill.techStack}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
