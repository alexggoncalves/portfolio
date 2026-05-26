import "./projectsGrid.scss";
import { projects } from "../../asset-handling/contentAssets";
import ProjectCard from "../general/ProjectCard";

function ProjectsGridPage() {
    return (
        <div className="projects-grid-page">
            <div className="projects-grid-page__filters">
                <span>FILTERS</span>
            </div>

            <div className="projects-grid-page__grid">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        route={`/projects/${project.id}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProjectsGridPage;
