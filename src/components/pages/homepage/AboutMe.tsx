import { PersonIcon } from "../../general/Icons";
import Window from "../../general/Window";

function AboutMe() {
    const leftHeader = <>
        <span>About me</span>
    </>;

    const rightHeader = <>
        <PersonIcon className='window-header__icon' width={20} height={20}/>
    </>

    return (
        <Window
            title="About me"
            headerLeft={leftHeader}
            headerRight={rightHeader}
            className="about-me__window"
        >
            <div className="about-me__photo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWfAPb_7obVf5aEVeQPKFHBVBg8LA95wVGmdJ8-KmO3XQhDXIPgofoX0&s=10" alt="" />
            </div>
            <div className="about-me">
                <span className="about-me__greeting">Hi! I'm Alex.</span>
                <div className="about-me__roles">
                    <span>Developer</span>
                    <span aria-hidden={true}> • </span>
                    <span>Designer</span>
                    <span aria-hidden={true}> • </span>
                    <span>3D Artist</span>
                    <span aria-hidden={true}> • </span>
                    <span>Front-End</span>
                </div>
                <div className="about-me__description">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum dolor diam. Donec sed erat in velit convallis hendrerit. Suspendisse in ante in enim gravida consequat non sed dolor.
                    </p>
                    <p>
                        Pellentesque sagittis nisl vel maximus ullamcorper. Pellentesque porta et nulla a commodo. Fusce sodales felis tellus, a pellentesque urna auctor non. Nam vel lorem lorem. 
                    </p>

                </div>

            </div>

        </Window>
    );
}

export default AboutMe;
