import { useState } from "react";
import { Link } from 'react-router-dom';
import { data } from './sidepanelData';
import { Link as ScrollLink } from 'react-scroll';
import '../css/SidePanel.css'

export function SidePanel() {
    const [mobileToggle, setMobileToggle] = useState(false);

    const handleMobileToggle = () => {
        setMobileToggle(!mobileToggle);
    };

    return (
        <>
            <div className="SidePanel">
                <img src={data.Images.profilePic} alt="Profile Picture" />
                <h1>{data.aboutMe.personalInfo.name}</h1>
                <div className="sidepanel-tags">
                    <label>Specialization:</label>
                    <h2>- Full-Stack Developer</h2>
                    <h2>- Mobile Developer</h2>
                </div>
                <div className="sidepanel-tags">
                    <label>Based in:</label>
                    <h2> {data.aboutMe.personalInfo.location} </h2>
                </div>
                <ul className="nav social-link">
                    {data.socialData.map((element, index) => (
                        element.link ? (
                            <a href={element.link} className="hover-effect" target="_blank" rel="noopener noreferrer">
                                <li key={index}>

                                    <img src={element.icon} />

                                </li>
                            </a>
                        ) : null
                    ))}
                </ul>

                <ScrollLink
                    className="cta-btn"
                    to="contact"
                    spy={true}
                    duration={500}
                    onClick={() => setMobileToggle(false)}
                >
                    Let’s Work Together
                </ScrollLink>


            </div>

        </>
    );
}