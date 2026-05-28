import { Link, useLocation } from "react-router";
import {
    getProjectById,
    type Project,
} from "../../asset-handling/contentAssets";
import "./projectWindow.scss";

import { useEffect, useMemo, useState } from "react";
import ProjectDescription from "./ProjectDescription";
import ProjectTools from "./ProjectTools";
import ProjectTeam from "./ProjectTeam";
import MediaCarousel from "./media-carousel/MediaCarousel";
import ProjectTags from "./ProjectTags";
import { CloseIcon } from "../general/Icons";
import useSceneStore from "../../../stores/sceneStore";

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
        if (location.pathname.startsWith("/projects/")) {
            return "/projects";
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
                    className={`project-window__back-button-mobile ${!open ? "open" : ""}`}
                >
                    <CloseIcon />
                </Link>
            )}
            <div className={`project-window ${open ? "open" : ""}`}>
                {!isMobile && (
                    <Link to={backPath} className="project-window__back-button">
                        <CloseIcon />
                    </Link>
                )}
                <div className="project-window__details-panel">
                    <div className="project-window__details">
                        <ProjectTags tagIds={project.tags}></ProjectTags>
                        <h1>{project.title}</h1>
                        <h2>{project.subtitle}</h2>

                        <ProjectDescription description={project.description} />
                        <ProjectTools tools={project.tools} />

                        <ProjectTeam team={project.team} />
                    </div>
                </div>

                <div className="project-window__media-panel">
                    <MediaCarousel items={project.media}></MediaCarousel>
                </div>
            </div>
        </>
    );
}

export default ProjectWindow;
