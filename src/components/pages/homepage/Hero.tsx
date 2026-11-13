import { useEffect, useRef, useState } from 'react';
import { AtIcon, CameraIcon, ChevronDown, ReturnIcon, SmileIcon, VinylIcon } from '../../ui/Icons';
import Window from '../../ui/Window';
import useSceneStore from '../../../stores/sceneStore';

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

    const headerLeft = <>
        <span>Hello</span>
        <span aria-hidden>•</span>
        <span className='at-icon' aria-label='Based in '><AtIcon /></span>
        <span>Madeira, PT</span>
    </>

    const headerRight = <SmileIcon className='window-header__icon' />

    return (
        <>
            <section ref={heroRef} id="hero">

                <Window
                    title="hello"
                    headerLeft={headerLeft}
                    headerRight={headerRight}
                    className="hero__window"
                >
                    <span className='hero__greeting'>Hi, I'm Alexandre.</span>
                    <span className='hero__description'>Designer and developer. I make games, web experiences and everything in between.</span>
                </Window>

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
                            onClick={() => setView('Left')}
                        >
                            <CameraIcon/>
                        </button>

                        <button
                            type="button"
                            className={`button--glass`}
                            onClick={() => setView('Right')}
                        >
                           <VinylIcon/>
                        </button>

                    </>) : <button
                        type="button"
                        className={`button--glass back-button`}
                        onClick={() => setView('Center')}
                    >
                        <ReturnIcon/>
                        <span>Back</span>
                    </button>}
                </div>

            </section>
        </>
    );
}

export default Hero;
