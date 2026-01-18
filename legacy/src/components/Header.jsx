import { Link as ScrollLink } from 'react-scroll';
import { data } from './sidepanelData';
import '../css/Header.css';

export function Header() {

    return (
        <section className="header-section home" id="home">
            <div className="header-main">
                <div className="section-tag">
                    <img src={data.Images.star} alt="" />
                    <p>Welcome</p>
                </div>
                {/* Dynamically pulls name "Mohammad Ahmad" from sidepanelData */}
                <h1>I am {data.aboutMe.personalInfo.name}, <br/> <span className="gradient-text">Software Engineer</span>.</h1>
                
                <p className="header-subtitle">
                   [cite_start]{/* Summary from CV [cite: 5] */}
                   Enhancing UI/UX and building scalable, secure web applications.
                </p>

                <div className="header-cta-section">
                    <ScrollLink
                        className="header-cta highlight-btn"
                        containerId="content"
                        to="portfolio" // Ensure this ID exists in Landing or Portfolio component
                        smooth={true}
                        spy={true}
                        duration={500}
                        offset={-50}
                    >
                        View My Work
                        <img src={data.Images.star} alt="" />
                    </ScrollLink>
                    <a href={data.aboutMe.personalInfo.cvLink} className="header-cta" target="_blank" rel="noopener noreferrer">
                        Download CV <img src={data.Images.star} alt="" />
                    </a>
                </div>
            </div>
        </section>
    );
}