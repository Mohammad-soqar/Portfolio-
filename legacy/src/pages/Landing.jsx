import { useEffect } from "react";
import { Header } from "../components/Header"
import { Portfolio } from "../components/Portfolio";
import { About } from "../components/About";
import { Resume } from "../components/Resume";
import { ContactMe } from "../components/ContactMe";

export function Landing() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
      
    return (
        <div className="landing-wrapper">
            <div className="portfolio-content" id="content">
                <Header />
                <div id="portfolio">
                    <Portfolio />
                </div>
                <Resume />
                <About />
                <ContactMe />
            </div>
        </div>
    );
}