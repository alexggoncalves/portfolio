import { VinylIcon } from "../../ui/Icons"
import Window from "../../ui/Window"

const MusicWindow = () => {

    const headerLeft = <span>My favorite albums</span>
        

    const headerRight = <VinylIcon className='window-header__icon' />

    return (
        <>
            <Window
                title="hello"
                headerLeft={headerLeft}
                headerRight={headerRight}
                className="hero__window"
            >
                MUSIC
            </Window>
        </>
    )
}

export default MusicWindow