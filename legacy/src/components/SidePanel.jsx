import { data } from './sidepanelData';
import '../css/SidePanel.css'

export function SidePanel() {
    // Kept state in case you expand mobile functionality later

    return (
        <>
            <div className="SidePanel">
                <img 
                    src={data.Images.profilePic} 
                    alt="Profile" 
                />
                <h1>{data.aboutMe.personalInfo.name}</h1>
                
                <div className="sidepanel-tags">
                    <label>Specialization:</label>
                    <h2>- Full-Stack Developer</h2>
                    <h2>- Mobile Developer</h2>
                </div>
                
                <div className="sidepanel-tags">
                    <label>Based in:</label>
                    <h2>{data.aboutMe.personalInfo.location}</h2>
                </div>

                <ul className="nav social-link">
                    {data.socialData.map((element, index) => (
                        element.link ? (
                            /* Fixed: Key must be on the outermost element of the map */
                            <a 
                                key={index} 
                                href={element.link} 
                                className="hover-effect" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <li>
                                    <img src={element.icon} alt="Social Icon" />
                                </li>
                            </a>
                        ) : null
                    ))}
                </ul>

                {/* Updated: Directly opens email client using data.email */}
                <a
                    href={`mailto:${data.aboutMe.personalInfo.email}`}
                    className="cta-btn"
                >
                    Let’s Work Together
                </a>
            </div>
        </>
    );
}