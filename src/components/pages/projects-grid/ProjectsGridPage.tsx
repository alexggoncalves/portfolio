import "./ProjectsGrid.scss";
import { useMemo, useState } from "react";

import ProjectCard from "./ProjectCard";
import Filters from "./Filters";
import Window from "../../ui/Window";

import { projects, tags } from "../../../data/content";
import { WindowActionButton } from "../../ui/Buttons";
import { TrashIcon } from "../../ui/Icons";
import useMediaQuery from "../../../utils/useMediaQuery";

function ProjectsGridPage() {
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const isMobile = useMediaQuery("(max-width: 700px)");

    const filteredProjects = useMemo(() => {
        if (appliedFilters.length === 0) return projects;

        return projects.filter((project) =>
            appliedFilters.some((tag) => project.tags.includes(tag)),
        );
    }, [appliedFilters, projects]);

    const clearFilters = () => {
        setSelectedFilters([]);
        setAppliedFilters([]);
    };

    const applyFilters = () => {
        setAppliedFilters(selectedFilters);
    };

    return (
        <div className="projects-grid__page">
            {!isMobile &&
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
                        projects={projects}
                        filters={tags}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                    />
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="button--pill filters__apply-button"
                    >
                        APPLY
                    </button>
                </Window>
            }

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
