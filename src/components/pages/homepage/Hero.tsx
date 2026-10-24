import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, AtIcon, SmileIcon } from '../../general/Icons';
import Window from '../../general/Window';
import HeroScene from './HeroScene';

function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);

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

    const headerRight = <SmileIcon className='window-header__icon' width={20} height={20} />

    return (
        <>
            <section ref={heroRef} id="hero">
                <HeroScene />

                <Window
                    title="hello"
                    headerLeft={headerLeft}
                    headerRight={headerRight}
                    className="hero__window"
                >
                    <span className='hero__greeting'>Hi, I'm Alexandre.</span>
                    <span className='hero__description'>Designer and developer... I make games, web experiences and everything in between.</span>
                </Window>

                <button
                    type="button"
                    className={`hero__scroll-cue ${scrolled ? "hero__scroll-cue--hidden" : ""}`}
                    onClick={scrollToNextSection}
                >
                    <span>Scroll</span>
                    <ArrowIcon />
                </button>
            </section>
        </>
    );
}

export default Hero;
