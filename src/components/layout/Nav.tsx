import { Link } from "react-router";
import { useRef, useState, useEffect } from "react";

interface IndicatorState {
    left: number;
    width: number;
    opacity: number;
}

function Nav() {
    const navRef = useRef<HTMLElement>(null);
    const hasHovered = useRef<boolean>(false);

    const [indicator, setIndicator] = useState<IndicatorState>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const [animate, setAnimate] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 600);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isMobile) return;

        const linkRect = e.currentTarget.getBoundingClientRect();

        if (!hasHovered.current) {
            hasHovered.current = true;
            setAnimate(false);
        } else {
            setAnimate(true);
        }

        setIndicator({
            left: linkRect.left,
            width: linkRect.width,
            opacity: 1,
        });
    };

    const handleMouseLeave = () => {
        if (isMobile) return;

        setIndicator((prev) => ({ ...prev, opacity: 0 }));
        hasHovered.current = false;
        setAnimate(false);
    };

    return (
        <>
            <div className="top-gradient" />

            {isMobile && (
                <button
                    className="nav-toggle"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    ☰
                </button>
            )}

            {isMobile && isOpen && (
                <div
                    className="backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <nav
                ref={navRef}
                className={`nav ${isMobile ? "mobile" : ""} ${
                    isOpen ? "open" : ""
                }`}
                onMouseLeave={handleMouseLeave}
            >
                {/* ✅ Desktop indicator */}
                {!isMobile && (
                    <span
                        style={{
                            position: "fixed",
                            top: `calc((var(--nav-height) - 1.25em) / 2)`,
                            left: indicator.left,
                            width: indicator.width,
                            height: "1.5em",
                            border: "1px solid white",
                            borderRadius: "15px",
                            opacity: indicator.opacity,
                            pointerEvents: "none",
                            transition: animate
                                ? "left 0.25s ease, width 0.25s ease, opacity 0.15s ease"
                                : "opacity 0.15s ease",
                        }}
                    />
                )}

                <Link to="/" onMouseEnter={handleMouseEnter} onClick={() => setIsOpen(false)}>
                    INDEX
                </Link>
                <Link to="/projects" onMouseEnter={handleMouseEnter} onClick={() => setIsOpen(false)}>
                    PROJECTS
                </Link>
                <Link to="/contact" onMouseEnter={handleMouseEnter} onClick={() => setIsOpen(false)}>
                    CONTACT
                </Link>
            </nav>
        </>
    );
}

export default Nav;