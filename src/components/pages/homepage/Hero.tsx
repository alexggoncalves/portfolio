import { useEffect, useRef, useState } from 'react';
import { CameraIcon, ChevronDown, ReturnIcon, VinylIcon } from '../../ui/Icons';
import useSceneStore from '../../../stores/sceneStore';

import HeroWindow from './HeroWindow';
import PhotosWindow from './PhotosWindow';
import MusicWindow from './MusicWindow';

const windows = [
    { view: 'Center', Component: HeroWindow },
    { view: 'Camera', Component: PhotosWindow },
    { view: 'Music', Component: MusicWindow },
] as const;

function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const view = useSceneStore((s) => s.view)
    const setView = useSceneStore((s) => s.setView)

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

                <div className={`view-control-buttons`}>
                    {view === "Center" ? (<>
                        <button
                            type="button"
                            className={`button--glass`}
                            onClick={() => setView('Camera')}
                        >
                            <CameraIcon />
                        </button>

                        <button
                            type="button"
                            className={`button--glass`}
                            onClick={() => setView('Music')}
                        >
                            <VinylIcon />
                        </button>

                    </>) : <button
                        type="button"
                        className={`button--glass back-button`}
                        onClick={() => setView('Center')}
                    >
                        <ReturnIcon />
                        <span>Back</span>
                    </button>}
                </div>

            </section>
        </>
    );
}

export default Hero;
