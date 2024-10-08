import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

export function Navbar() {

    const [mobileToggle, setMobileToggle] = useState(false);

    const handleMobileToggle = () => {
        setMobileToggle(!mobileToggle);
    };

    return (
        <div className="navbar">
            <ScrollLink
                containerId="content"
                to="home"
                spy={true}
                duration={500}
                onClick={() => setMobileToggle(false)}
            >
                Home
            </ScrollLink>
            <ScrollLink
                containerId="content"
                to="portfolio"
                smooth={true}
                spy={true}
                duration={500}
                onClick={() => setMobileToggle(false)}
            >
                Portfolio
            </ScrollLink>
            <ScrollLink
                containerId="content"
                to="about"
                spy={true}
                duration={500}
                onClick={() => setMobileToggle(false)}
            >
                About Me
            </ScrollLink>
            <ScrollLink
                containerId="content"
                to="resume"
                spy={true}
                duration={500}
                onClick={() => setMobileToggle(false)}
            >
                Resume
            </ScrollLink>
            <ScrollLink
                containerId="content"
                to="contact"
                spy={true}
                duration={500}
                onClick={() => setMobileToggle(false)}
            >
                Contact
            </ScrollLink>
        </div>
    );
}
