import { Link, useLocation } from "react-router";
import { getProjectById, type Project } from "../../../data/content";
import "./projectWindow.scss";

import { useEffect, useMemo, useState } from "react";
import ProjectDescription from "./ProjectDescription";
import ProjectTools from "./ProjectTools";
import ProjectTeam from "./ProjectTeam";
import ProjectTags from "./ProjectTags";
import { CloseIcon } from "../general/Icons";
import useSceneStore from "../../../stores/sceneStore";
import MediaPanel from "./media-carousel/MediaPanel";

function ProjectWindow({
    projectId,
    isOpen,
}: {
    projectId: string | null;
    isOpen: boolean;
}) {
    const [open, setOpen] = useState(false);
    const isMobile = useSceneStore((s) => s.isMobile);

    const project: Project | null = useMemo(() => {
        if (!projectId) return null;

        return getProjectById(projectId);
    }, [projectId]);

    if (!project) return null;

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setOpen(true));
        } else {
            setOpen(false);
        }
    }, [isOpen]);

    // Back path
    const location = useLocation();
    const backPath = useMemo(() => {
        if (location.pathname.startsWith("/work/")) {
            return "/work";
        }

        if (location.pathname.startsWith("/")) {
            return "/";
        }

        return "/";
    }, [location.pathname]);

    return (
        <>
            {isMobile && (
                <Link
                    to={backPath}
                    className={`button button--icon project-close ${!open ? "open" : ""}`}
                >
                    <CloseIcon />
                </Link>
            )}

            <div className={`project-window ${open ? "open" : ""}`}>
                <div className="project-window__details-panel">
                    <div className="project-window__details-spacer">
                        {!isMobile && (
                            <Link
                                to={backPath}
                                className="button button--icon project-close"
                            >
                                <CloseIcon />
                            </Link>
                        )}
                    </div>
                    <div className="project-window__details-content">
                        <ProjectTags tagIds={project.tags}></ProjectTags>
                        <h1>{project.title}</h1>
                        <h2>{project.subtitle.toUpperCase()}</h2>

                        <ProjectDescription description={project.description} />
                        <ProjectTools tools={project.tools} />

                        <ProjectTeam team={project.team} />
                    </div>
                </div>

                <div className="project-window__media-panel">
                    <MediaPanel items={project.media}></MediaPanel>
                </div>
            </div>
        </>
    );
}

export default ProjectWindow;
