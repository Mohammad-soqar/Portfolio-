import { Navbar } from "./Navbar";
import { SidePanel } from "./SidePanel";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import "../css/Layout.css";

export function Layout() {

    useEffect(() => {
        const layout = document.querySelector('.layout'); // Apply to the whole layout

        const handleSmoothScroll = (event) => {
            event.preventDefault();
            const scrollStep = 3; // Adjust this for the scroll speed
            let scrollAmount = 0;

            const smoothScroll = setInterval(() => {
                layout.scrollBy(0, scrollStep * (event.deltaY > 0 ? 1 : -1));
                scrollAmount += scrollStep;
                if (scrollAmount >= Math.abs(event.deltaY)) {
                    clearInterval(smoothScroll);
                }
            }, 12); // 16ms interval for a 60fps effect
        };

        layout.addEventListener('wheel', handleSmoothScroll);

        return () => {
            layout.removeEventListener('wheel', handleSmoothScroll);
        };
    }, []);

    return (
        <div className="layout">
            <SidePanel />
            <div className="content" >
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}
