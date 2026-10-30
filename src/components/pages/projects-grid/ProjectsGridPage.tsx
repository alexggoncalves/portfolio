import "./ProjectsGrid.scss";
import { useMemo, useState } from "react";

import ProjectCard from "./ProjectCard";
import Filters from "./Filters";
import Window from "../../ui/Window";

import { projects, tags } from "../../../data/content";
import { WindowActionButton } from "../../ui/Buttons";
import { BrushIcon, FilterIcon } from "../../ui/Icons";
import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";
import Drawer from "../../ui/Drawer";

function ProjectsGridPage() {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const isMobile = useMediaQuery(MOBILE_QUERY);

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

    const windowRightHeader = <>
        {isMobile && <button
            type="button"
            className="button--action-text"
            onClick={() => setFiltersOpen(true)}
            aria-expanded={filtersOpen}
        >
            <span>Filters</span>
            <FilterIcon />
        </button>}
    </>

    const drawerHeader = <>
        <span className="filters-drawer__title">Filters</span>
        <WindowActionButton onAction={clearFilters} label="Clear filters">
            <BrushIcon style={{ color: "rgb(197, 86, 119)" }} />
        </WindowActionButton>
    </>

    return (
        <div className="projects-grid__page">
            {isMobile ? (
                <Drawer
                    className="filters-drawer"
                    header={drawerHeader}
                    peek={false}
                    open={filtersOpen}
                    onOpenChange={setFiltersOpen}
                >
                    <Filters
                        projects={projects}
                        filters={tags}
                        selectedFilters={appliedFilters}
                        setSelectedFilters={setAppliedFilters}
                    />
                </Drawer>)
                :
                <Window
                    title="filters"
                    headerLeft={<>Filters</>}
                    headerRight={
                        <WindowActionButton onAction={clearFilters} label="Clear filters">
                            <BrushIcon style={{ color: "rgb(197, 86, 119)" }} />
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
                    <span>{filteredProjects.length}{appliedFilters.length > 0 && ` / ${projects.length}`}</span>
                </>}
                headerRight={windowRightHeader}
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

        </div >
    );
}

export default ProjectsGridPage;
