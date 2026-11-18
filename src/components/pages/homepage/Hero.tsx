import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from '../../ui/Icons';
import useSceneStore from '../../../stores/sceneStore';

import HeroWindow from './HeroWindow';
import MusicWindow from './MusicWindow';
import HeroControls from './HeroControls';

const windows = [
    { view: 'Center', Component: HeroWindow },
    { view: 'Music', Component: MusicWindow },
] as const;

function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const view = useSceneStore((s) => s.view)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)

        window.addEventListener("scroll", onScroll)
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [])

    const scrollToNextSection = () => {
        if (!heroRef.current) return;
        heroRef.current.nextElementSibling?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <>
            <section ref={heroRef} id="hero">

                <div className="hero__window-stack">
                    {windows.map(({ view: key, Component }) => {
                        const active = view === key;
                        return (
                            <div
                                key={key}
                                className={`hero__window-slot ${active ? 'hero__window-slot--active' : ''}`}
                                aria-hidden={!active}
                                inert={!active}
                            >
                                <Component />
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className={`hero__scroll-cue ${scrolled ? "hero__scroll-cue--hidden" : ""}`}
                    onClick={scrollToNextSection}
                >
                    <span>Scroll</span>
                    <ChevronDown />
                </button>

                <HeroControls/>

            </section>
        </>
    );
}

export default Hero;
