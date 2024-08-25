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
        <section className="header-section">
            <div className="header-main">
                <div className="section-tag">
                    <img src={data.Images.star} alt="" />
                    <p>Let's meet!</p>
                </div>
                <h1>I'm {data.aboutMe.personalInfo.name} Software Enginner</h1>
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
                    <Link className="header-cta">Download CV <img src={data.Images.star} alt="" /></Link>
                </div>



            </div>


        </section>
    );
}