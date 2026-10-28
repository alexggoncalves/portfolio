import "./MediaViewer.scss"
import "./ProjectViewer.scss";

import { getProjectById, type Project } from "../../../data/content";
import { useEffect, useMemo, useState } from "react";

import ProjectInfoWindows from "./ProjectInfoWindows";
import ReturnButton from "./ReturnButton";
import ProjectHeading from "./ProjectHeading";
import useUIStore from "../../../stores/UIStore";
import MediaPlayer from "./MediaViewer";
import ToggleInterfaceButton from "./ToggleInterfaceButton"
import useMediaQuery from "../../../utils/useMediaQuery";
import ProjectInfoDrawer from "./ProjectInfoDrawer";

type ProjectViewerProps = {
    projectId: string | null,
    isOpen: boolean
};

function ProjectViewer({ projectId, isOpen }: ProjectViewerProps) {
    const isMobile = useMediaQuery("(max-width: 700px)");
    const [open, setOpen] = useState(false);
    const [windowsMinimized, setWindowsMinimized] = useState(false);

    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const setInterfaceHidden = useUIStore((s) => s.setInterfaceHidden);

    // Find project by ID
    const project: Project | null = useMemo(() => {
        if (!projectId) return null;

        return getProjectById(projectId);
    }, [projectId]);

    // Handle slide in animation
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setOpen(true));
        } else {
            setOpen(false);
        }
    }, [isOpen]);

    // Show hidden interface when project window closes
    useEffect(() => {
        if (!isOpen) setInterfaceHidden(false);
    }, [isOpen, setInterfaceHidden]);

    if (!project) return null;

    return (
        <div className={`project-viewer ${open ? "open" : ""} ${interfaceHidden ? "ui-hidden" : ""}`}>
            <MediaPlayer project={project} enabled={open} />
            <ReturnButton enabled={open} />
            <ToggleInterfaceButton />

            {isMobile ?
                <ProjectInfoDrawer project={project}/>
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
