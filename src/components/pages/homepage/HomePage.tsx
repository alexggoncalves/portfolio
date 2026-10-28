import AboutMe from "./AboutMe";
import Hero from "./Hero";
import "./Homepage.scss";
import SelectedProjects from "./SelectedProjects";

function HomePage() {
    return (
        <div className="homepage">
            <Hero />
            <SelectedProjects />
            <AboutMe />
        </div>
    );
}

export default HomePage;
