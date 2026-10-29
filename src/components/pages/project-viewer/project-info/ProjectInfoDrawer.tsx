import "./ProjectDrawer.scss"

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Project } from "../../../../data/content";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectTools from "./ProjectTools";
import ProjectTeam from "./ProjectTeam";
import Window from "../../../ui/Window";
import { GithubIcon, PreviewIcon, TeamIcon, ToolsIcon } from "../../../ui/Icons";
import { ExternalLink } from "../../../ui/Buttons";

const DRAG_THRESHOLD = 6; // px a press has to move before it counts as a drag
const SNAP_DISTANCE = 60; // px dragged before letting go switches state

interface DragState {
    active: boolean;
    moved: boolean;
    startY: number;
    lastY: number;
    startOffset: number;
    maxOffset: number;
}

const initialDragState: DragState = {
    active: false,
    moved: false,
    startY: 0,
    lastY: 0,
    startOffset: 0,
    maxOffset: 0
}
type ProjectInfoDrawerProps = {
    project: Project;
}

const ProjectInfoDrawer = ({ project }: ProjectInfoDrawerProps) => {
    const [expanded, setExpanded] = useState(false);

    const drawerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null)
    const drag = useRef<DragState>(initialDragState);

    const setOpen = (open: boolean) => {
        setExpanded(open);

        // Scroll body to the top
        if (!open) bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClick = () => {
        setOpen(!expanded);
    }

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        const drawer = drawerRef.current;
        if (!drawer || e.button !== 0) return;

        const maxOffset = drawer.offsetHeight - e.currentTarget.offsetHeight;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = {
            active: true,
            moved: false,
            startY: e.clientY,
            lastY: e.clientY,
            startOffset: expanded ? 0 : maxOffset,
            maxOffset,
        };
        drawer.classList.add("project-drawer--dragging");
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        const drawer = drawerRef.current;
        if (!drawer || !d.active) return;

        d.lastY = e.clientY;
        const dy = e.clientY - d.startY;
        if (Math.abs(dy) > DRAG_THRESHOLD) d.moved = true;

        // follow the finger, clamped between open and collapsed
        const offset = Math.min(Math.max(d.startOffset + dy, 0), d.maxOffset);
        drawer.style.transform = `translateY(${offset}px)`;
    }

    const endDrag = () => {
        const d = drag.current;
        const drawer = drawerRef.current;
        if (!d.active || !drawer) return;

        d.active = false;
        drawer.classList.remove("project-drawer--dragging");
        drawer.style.transform = "";

        if (!d.moved) return;
        const dy = d.lastY - d.startY;
        if (!expanded && dy < -SNAP_DISTANCE) setOpen(true);
        if (expanded && dy > SNAP_DISTANCE) setOpen(false);
    };

    // Set header peek height so the media viewer can sit on top of it
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;
        const observer = new ResizeObserver(() => {
            header.closest<HTMLElement>(".project-viewer")?.style.setProperty("--peek-height", `${header.offsetHeight}px`)
        })
        observer.observe(header);
        return () => observer.disconnect();
    }, [])

    return (
        <div
            ref={drawerRef}
            className={`project-drawer ${expanded ? "project-drawer--expanded" : ""}`}
        >
            <div
                ref={headerRef}
                className="project-drawer__header"
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                <button
                    type="button"
                    className="project-drawer__handle"
                />
                {/* <div className="project-drawer__meta">
                    <span>Project</span>
                    <span aria-hidden={true}>•</span>
                    <span>{project.year}</span>
                </div> */}
                <ProjectTags tagIds={project.tags} />
                <div className="project-drawer__heading">
                    <div className="project-drawer__title-group">
                        <h1 className="project-drawer__title">{project.title}</h1>
                        <span className="project-drawer__subtitle">{project.subtitle}</span>
                    </div>
                    <div className="project-drawer__links">
                        {project.git &&
                            <ExternalLink href={project.git} label="Source code on Github">
                                <GithubIcon />
                            </ExternalLink>
                        }
                        {project.link &&
                            <ExternalLink href={project.link} label={`Open ${project.title}`}>
                                <PreviewIcon />
                            </ExternalLink>
                        }
                    </div>
                </div>
            </div>
            <div
                ref={bodyRef}
                className="project-drawer__body"
            >
                <ProjectDescription description={project.description} />
                <Window
                    title="Tools"
                    className="project-tools__window"
                    headerLeft={<>
                        <span>Tools</span>
                        <span aria-hidden={true}>•</span>
                        <span>{project.tools.length}</span>
                    </>}
                    headerRight={<ToolsIcon className='window-header__icon' />}
                >
                    <ProjectTools tools={project.tools} />
                </Window>

                <Window
                    title="Team"
                    className="project-team__window"
                    headerLeft={<>
                        <span>Team</span>
                        <span aria-hidden={true}>•</span>
                        <span>{project.team?.length}</span>
                    </>}
                    headerRight={<TeamIcon className='window-header__icon' />}
                >
                    <ProjectTeam team={project.team} />
                </Window>
            </div>
        </div>
    )
}

export default ProjectInfoDrawer;