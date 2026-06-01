import "./projectsGrid.scss";
import { projects } from "../../asset-handling/contentAssets";
import ProjectCard from "../general/ProjectCard";
import { useMemo, useState } from "react";
import ProjectFilters from "./ProjectFilters";

function ProjectsGridPage() {
    const [filters, setFilters] = useState<string[]>([]);

    const filteredProjects = useMemo(() => {
        if (filters.length === 0) return projects;

        return projects.filter((project) =>
            filters.some((tag) => project.tags.includes(tag)),
        );
    }, [filters, projects]);

    return (
        <>
            
            <div className="projects-grid">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        route={`/projects/${project.id}`}
                        displayTags
                    />
                ))}
            </div>
            <ProjectFilters onApply={setFilters} appliedFilters={filters}></ProjectFilters>
        </>
    );
}

export default ProjectsGridPage;
