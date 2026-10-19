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
        </>
    );
}

export default HomePage;
