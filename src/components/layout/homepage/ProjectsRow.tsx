import { Link } from "react-router";

import { projects } from "../../asset-handling/contentAssets";
import ProjectCard from "../general/ProjectCard";
import useHorizontalDragScroll from "../../../hooks/useHorizontalDragScroll";
import { GoToGridIcon } from "../general/Icons";

function ProjectsRow() {
    const { viewportRef, trackRef, onPointerDown } = useHorizontalDragScroll();

    return (
        <section className="projects-row">
            <div className="projects-row__header">
                <div className="projects-row__header-left">
                    <h1 className="projects-row__title">PROJECTS</h1>
                    <Link to="/projects" className="projects-row__grid-link">
                        <GoToGridIcon/>
                    </Link>
                </div>

                <div className="projects-row__scroll-indicator" />
            </div>

            <div className="projects-row__wrap">
                <div className="projects-row__gradient  projects-row__gradient--left" />
                <div
                    ref={viewportRef}
                    className="projects-row__scroller"
                    onPointerDown={onPointerDown}
                >
                    <div ref={trackRef} className="projects-row__track">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} route={`/${project.id}`}/>
                        ))}
                    </div>
                </div>
                <div className="projects-row__gradient projects-row__gradient--right" />
            </div>
        </section>
    );
}

export default ProjectsRow;
