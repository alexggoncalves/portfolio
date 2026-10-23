import AboutMe from "./AboutMe";
import Hero from "./Hero";
import "./homepage.scss";
import SelectedProjects from "./SelectedProjects";

function HomePage() {
    return (
        <>
            <Hero />
            <SelectedProjects />
            <AboutMe />
        </>
    );
}

export default HomePage;
