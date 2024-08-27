import { useState } from "react";
import { Link as ScrollLink } from 'react-scroll';
import { data } from './sidepanelData';
import { Link } from 'react-router-dom';


export function Header() {

    const [mobileToggle, setMobileToggle] = useState(false);

    const handleMobileToggle = () => {
        setMobileToggle(!mobileToggle);
    };


    return (
        <section className="header-section home" id="home">
            <div className="header-main">
                <div className="section-tag">
                    <img src={data.Images.star} alt="" />
                    <p>Let's meet!</p>
                </div>
                <h1>I am {data.aboutMe.personalInfo.name} Software Enginner</h1>
                <div className="header-cta-section">
                    <ScrollLink
                        className="header-cta highlight-btn"
                        containerId="content"
                        to="portfolio"
                        smooth={true}
                        spy={true}
                        duration={500}
                        onClick={() => setMobileToggle(false)}
                    >
                        My Work
                        <img src={data.Images.star} alt="" />
                    </ScrollLink>
                    <a href="https://drive.google.com/file/d/1q0cG1bVah8QrlUMPj5JTfZyf2XW1WvWt/view?usp=drive_link" className="header-cta" target="_blank" rel="noopener noreferrer">
                        Download CV <img src={data.Images.star} alt="" />
                    </a>
                </div>



            </div>


        </section>
    );
}