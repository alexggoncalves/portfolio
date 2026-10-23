import "./projectsGrid.scss";
import { projects, tags } from "../../../data/content";
import ProjectCard from "../../general/ProjectCard";
import { useMemo, useState } from "react";
import Filters from "./Filters";
import Window from "../../general/Window";
import { WindowActionButton } from "../../general/Buttons";
import { TrashIcon } from "../../general/Icons";

function ProjectsGridPage() {
    const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
    // const [toolFilters, setToolFilters] = useState<string[]>([]);

    const filteredProjects = useMemo(() => {
        if (categoryFilters.length === 0) return projects;

        return projects.filter((project) =>
            categoryFilters.some((tag) => project.tags.includes(tag)),
        );
    }, [categoryFilters, projects]);

    const clearFilters = () => {

    }

    return (
        <div className="projects-grid__page">
            <Window
                title="filters"
                headerLeft={<>Filters</>}
                headerRight={
                    <WindowActionButton onAction={clearFilters} label="Clear filters">
                        <TrashIcon style={{ color: "rgb(197, 86, 119)" }} />
                    </WindowActionButton>
                }
                className="filters__window"
            >
                <Filters
                    filters={tags}
                    title="Category"
                    onApply={setCategoryFilters}
                    appliedFilters={categoryFilters}
                />
                {/* <Filters
                    filters={tools}
                    onApply={setFilters}
                    appliedFilters={filters}
                /> */}

            </Window>

            <Window
                title="projects"
                headerLeft={<>
                    <span>Work</span>
                    <span aria-hidden={true}>•</span>
                    <span>{filteredProjects.length} projects</span>
                </>}
                headerRight={<></>}
                className="projects-grid__window"
            >
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            route={`/work/${project.id}`}
                        />
                    ))}
                </div>
            </Window>

        </div>
    );
}

export default ProjectsGridPage;
