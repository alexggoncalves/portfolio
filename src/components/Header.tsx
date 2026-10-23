import "./../styles/header.scss"

import { Link, NavLink } from "react-router";
import { useRef, useState } from "react";

import useUIStore from "../stores/UIStore";
import useMediaQuery from "../utils/useMediaQuery";

import { BurgerIcon, CloseIcon, Logo } from "./general/Icons";

const LINKS = [
    { to: "/", label: "INDEX" },
    { to: "/work", label: "WORK" },
    { to: "/contact", label: "CONTACT" },
];

interface IndicatorState {
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
}

function Nav() {
    const isMobile = useMediaQuery("(max-width: 700px)");
    const interfaceHidden = useUIStore((s) => s.interfaceHidden);

    const hasHovered = useRef<boolean>(false);
    const [animate, setAnimate] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);

    // Hover indicator
    const [indicator, setIndicator] = useState<IndicatorState>({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0,
    });

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isMobile) return;

        setAnimate(hasHovered.current);
        hasHovered.current = true;

        const link = e.currentTarget;
        const nav = link.parentElement!;
        const l = link.getBoundingClientRect();
        const n = nav.getBoundingClientRect();

        setIndicator({
            left: l.left - n.left - nav.clientLeft,
            top: l.top - n.top - nav.clientTop,
            width: l.width,
            height: l.height,
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
            {isMobile && (
                <button
                    type="button"
                    className="button button--icon toggle nav-toggle toggle-right-top"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    aria-controls="main-nav"
                >
                    {isOpen ? <CloseIcon /> : <BurgerIcon />}
                </button>
            )}

            {isMobile && (
                <div
                    className={`backdrop ${!isOpen ? "closed" : ""}`}
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <header >
                <Link to="/" id="logo" aria-label="Alex, home">
                    <Logo />
                </Link>

                <nav
                    id="main-nav"
                    aria-label="Main nav"
                    className={`nav ${isOpen ? "open" : ""} ${interfaceHidden ? "ui-hidden" : ""}`}
                    onMouseLeave={handleMouseLeave}
                    inert={interfaceHidden || (isMobile && !isOpen)}
                >
                    {LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            onMouseEnter={handleMouseEnter}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* HOVER INDICATOR */}
                    {!isMobile && (
                        <span
                            className="nav__indicator"
                            aria-hidden="true"
                            style={{
                                left: indicator.left,
                                top: indicator.top,
                                width: indicator.width,
                                height: indicator.height,
                                opacity: indicator.opacity,
                                transition: animate
                                    ? "left 0.25s ease, width 0.25s ease, opacity 0.15s ease"
                                    : "opacity 0.15s ease",
                            }}
                        />
                    )}
                </nav>

            </header>

        </>
    );
}

export default Nav;
