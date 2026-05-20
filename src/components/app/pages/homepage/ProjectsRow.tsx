import { Link } from "react-router";

import { projects } from "../../assets/contentAssets";
import ProjectCard from "../general/ProjectCard";
import useHorizontalDragScroll from "../../../../hooks/useHorizontalDragScroll";

function ProjectsRow() {
    const { viewportRef, trackRef, onPointerDown } = useHorizontalDragScroll();

    return (
        <section className="projects-row-container">
            <div className="projects-row-header">
                <div className="projects-row-header-left">
                    <h1>MY PROJECTS</h1>
                    <Link to="/projects" className="projects-row-header-link">
                        View Grid
                    </Link>
                </div>

                <div className="projects-row-scroll" />
            </div>

            <div className="projects-row-viewport-wrap">
                <div className="left-gradient" />
                <div
                    ref={viewportRef}
                    className="projects-row"
                    onPointerDown={onPointerDown}
                >
                    <div ref={trackRef} className="projects-row__track">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
                <div className="right-gradient" />
            </div>
        </section>
    );
}

export default ProjectsRow;
