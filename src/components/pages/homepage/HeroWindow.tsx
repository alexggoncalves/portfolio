import { AtIcon, SmileIcon } from "../../ui/Icons"
import Window from "../../ui/Window"

const HeroWindow = () => {

    const headerLeft = <>
        <span>Hello</span>
        <span aria-hidden>•</span>
        <span className='at-icon' aria-label='Based in '><AtIcon /></span>
        <span>Madeira, PT</span>
    </>

    const headerRight = <SmileIcon className='window-header__icon' />

    return (
        <>
            <Window
                title="hello"
                headerLeft={headerLeft}
                headerRight={headerRight}
                className="hero__window"
            >
                <span className='hero__greeting'>Hi, I'm Alexandre.</span>
                <span className='hero__description'>Designer and developer. I make games, web experiences and everything in between.</span>
            </Window>
        </>
    )
}

export default HeroWindow