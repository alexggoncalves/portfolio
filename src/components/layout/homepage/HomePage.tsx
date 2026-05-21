import AboutMe from "./AboutMe";
import Hero from "./Hero";
import "./homepage.scss";
import ProjectsRow from "./ProjectsRow";

function HomePage() {
    return (
        <>
            <Hero/>
            <ProjectsRow/>
            <section
                className="cat"
                id={"cat-section"}
            />
            <AboutMe></AboutMe>
        </>
    );
}

export default HomePage;
