import { ArrowIcon, SmileIcon } from '../../general/Icons';
import Window from '../../general/Window';
import HeroScene from './HeroScene';

function Hero() {
    return (
        <>
            <section id="hero">
                <HeroScene />

                <Window
                    title="hello"
                    headerLeft={
                        <>
                            <span>Hello</span>
                            <span aria-hidden={true}>•</span>
                            <span>Madeira, PT</span>
                        </>
                    }
                    headerRight={<SmileIcon className='window-header__icon' width={20} height={20}/>}
                    className="hero__window"
                >
                    <span className='hero__greeting'>Hey, I'm Alexandre.</span>
                    <span className='hero__description'>Designer and developer... I make games, web experiences and everything in between.</span>
                </Window>
                <div className='hero__scroll-tag'>
                    <span>Scroll</span>
                    <ArrowIcon />
                </div>
            </section>
        </>
    );
}

export default Hero;
