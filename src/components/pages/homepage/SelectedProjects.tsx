import { projects, type Project } from "../../../data/content";
import ProjectCard from "../../general/ProjectCard";
import useHorizontalDragScroll from "../../../hooks/useHorizontalDragScroll";
import Window from "../../general/Window";
import { Link } from "react-router";
import { ChevronRight } from "../../general/Icons";
import useReveal from "../../../hooks/useReveal";

const SELECTED_PROJECTS_IDS = ["endless", "muse", "malleus-vr", "endless-purrs", "crimes-exemplares-digital", "mirage", "undone", "frogger-vr"]

function SelectedProjects() {
    const { viewportRef, trackRef, onPointerDown, indicatorRef } =
        useHorizontalDragScroll();
    const { ref, revealed } = useReveal<HTMLDivElement>();

    const selectedProjects = SELECTED_PROJECTS_IDS
        .map((id) => projects.find((p) => p.id === id))
        .filter((p): p is Project => !!p);

    const leftHeader = <>
        <span>Selected work</span>
        <span aria-hidden={true}>•</span>
        <span>{selectedProjects.length}</span>
    </>;

    const rightHeader = <>
        <Link className="button--action-text" to={"/work"}>
            <span>All work</span>
            <ChevronRight />
        </Link>
    </>



    return (
        <div ref={ref} className={`reveal ${revealed ? "reveal--visible" : ""}`}>
            <Window
                title="Featured projects"
                headerLeft={leftHeader}
                headerRight={rightHeader}
                className="selected-projects__window"
            >
                <div
                    ref={viewportRef}
                    className="selected-projects__scroller"
                    onPointerDown={onPointerDown}
                >
                    <div
                        ref={trackRef}
                        className="selected-projects__track"
                    >
                        {selectedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                route={`/${project.id}`}
                                variant="thumbnail"
                            />
                        ))}
                    </div>
                </div>
                <div className="selected-projects__scroll-indicator">
                    <div className="selected-projects__scroll-indicator-track">
                        <div
                            ref={indicatorRef}
                            className="selected-projects__scroll-indicator-thumb"
                        />
                    </div>
                </div>

            </Window>
        </div>

    );
}

export default SelectedProjects;
