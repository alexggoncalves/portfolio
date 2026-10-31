import "./ProjectViewer.scss";
import "./media-viewer/MediaViewer.scss"
import "./project-info/ProjectInfo.scss"

import { getProjectById, type Project } from "../../../data/content";
import { useEffect, useMemo, useState } from "react";

import ProjectInfoWindows from "./project-info/ProjectInfoWindows";
import ReturnButton from "./ReturnButton";
import ProjectHeading from "./project-info/ProjectHeading";
import useUIStore from "../../../stores/UIStore";
import MediaPlayer from "./media-viewer/MediaViewer";
import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";
import ProjectInfoDrawer from "./project-info/ProjectInfoDrawer";

type ProjectViewerProps = {
    projectId: string | null,
    isOpen: boolean
};

function ProjectViewer({ projectId, isOpen }: ProjectViewerProps) {
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const isShort = useMediaQuery("(max-height: 500px)");

    const [infoOpen, setInfoOpen] = useState(false);
    const [windowsMinimized, setWindowsMinimized] = useState(false);
    const open = isOpen;

    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const setInterfaceHidden = useUIStore((s) => s.setInterfaceHidden);

    // Find project by ID
    const project: Project | null = useMemo(() => {
        if (!projectId) return null;

        return getProjectById(projectId);
    }, [projectId]);

    // Show hidden interface when project window closes
    useEffect(() => {
        if (!isOpen) setInterfaceHidden(false);
    }, [isOpen, setInterfaceHidden]);

    if (!project) return null;

    return (
        <div className={`project-viewer ${open ? "open" : ""} ${interfaceHidden ? "ui-hidden" : ""}`}>
            <MediaPlayer key={project.id} project={project} enabled={open} />
            <ReturnButton enabled={open} />
            {isShort && (
                <button
                    type="button"
                    className="button--glass project-viewer__info-button"
                    onClick={() => setInfoOpen(true)}
                    aria-expanded={infoOpen}
                >
                    + INFO
                </button>
            )}
            {isMobile ?
                <ProjectInfoDrawer
                    project={project}
                    peek={!isShort}
                    open={isShort ? infoOpen : undefined}
                    onOpenChange={setInfoOpen}
                />
                :
                <div className="project-viewer__overlay">
                    {windowsMinimized ?
                        <ProjectHeading
                            title={project.title}
                            subtitle={project.subtitle}
                            maximizeWindows={() => setWindowsMinimized(false)}
                            inert={interfaceHidden}
                        />
                        :
                        <ProjectInfoWindows
                            project={project}
                            setMinimized={setWindowsMinimized}
                            inert={interfaceHidden}
                        />
                    }
                </div>}

        </div>
    );
}

export default ProjectViewer;
