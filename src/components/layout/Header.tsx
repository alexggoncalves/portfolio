import "./Header.scss"

import { NavLink } from "react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import useUIStore from "../../stores/UIStore";

import { MenuIcon, CloseIcon, Logo, ArrowUpRightIcon, GithubIcon, LinkedInIcon, DownloadIcon } from "../ui/Icons";
import Window from "../ui/Window";
import { SplitButton, WindowActionButton } from "../ui/Buttons";
import { padNumber } from "../../utils/stringUtils";
import usePageNavigate from "../../hooks/usePageNavigate";
import PageLink from "../ui/PageLink";

const LINKS = [
    { to: "/", label: "HOME" },
    { to: "/work", label: "WORK" },
    { to: "/contact", label: "CONTACT" },
];

function Nav() {
    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const pageNavigate = usePageNavigate();
    // const { pathname } = useLocation();

    const toggleRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // const currentLink = LINKS.find((link) => link.to !== "/" && pathname.startsWith(link.to)) ?? LINKS[0];

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setIsOpen(false);
            toggleRef.current?.focus();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, to: string) => {
        // allow ctrl/cmd/shift/middle have their behaviour
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        e.preventDefault();
        setIsOpen(false);
        pageNavigate(to);
    };

    const closeButton = <WindowActionButton onAction={() => setIsOpen(false)} label={"Close menu"}>
        <CloseIcon />
    </WindowActionButton>

    return (
        <header>
            <PageLink to="/" id="logo" aria-label="Alex, home">
                <Logo />
            </PageLink>

            <SplitButton
                // label={currentLink.label}
                label="Menu"
                icon={<MenuIcon />}
                ref={toggleRef}
                onAction={() => setIsOpen(true)}
                className="menu-button"
                active={isOpen}
                ariaLabel="Open menu"
                ariaControls="main-nav"
            />

            <Window
                title="Menu"
                headerLeft={<span>Menu</span>}
                headerRight={closeButton}
                className={`menu__window ${isOpen ? "menu__window--open" : ""}`}
            >
                <nav
                    className="menu__nav"
                    id="main-nav"
                    aria-label="Main"
                    inert={interfaceHidden || !isOpen}
                >
                    {LINKS.map((link, i) => (
                        <NavLink
                            className={`menu__page`}
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            onClick={(e) => handlePageClick(e, link.to)}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <span className="menu__page-index">{padNumber(i + 1)}</span>
                            <span className="menu__page-label">{link.label}</span>
                            <span className="menu__page-icon">
                                <ArrowUpRightIcon />
                            </span>
                        </NavLink>
                    ))}
                </nav>

                <div className="menu__footer">
                    <div className="menu__status">
                        <span className="menu__status-dot"></span>
                        <span>Available for work</span>
                    </div>
                    <span className="menu__email">contact@alexgg.com</span>
                    <div className="menu__links">
                        <a className="button--pill" target="_blank" href="https://github.com/alexggoncalves">
                            <GithubIcon />
                            <span>GitHub</span>
                        </a>
                        <a className="button--pill" target="_blank" href="https://www.linkedin.com/in/alexggoncalves/">
                            <LinkedInIcon />
                            <span>LinkedIn</span>
                        </a>
                        <a className="button--pill" href="/download_test.pdf" download="Alex_Goncalves_CV.pdf">
                            <DownloadIcon />
                            <span>CV</span>
                        </a>
                    </div>
                </div>
            </Window>

            <div
                className={`backdrop ${!isOpen ? "closed" : ""}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
        </header>
    );
}

export default Nav;
