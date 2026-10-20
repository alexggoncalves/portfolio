import "./projectViewer.scss";
import "./mediaViewer.scss"

import { getProjectById, type Project } from "../../../data/content";
import { useEffect, useMemo, useState } from "react";

import ProjectInfoWindows from "./ProjectInfoWindows";
import ReturnButton from "./ReturnButton";
import MediaStrip from "./project-media/MediaStrip";
import MediaLabel from "./project-media/MediaLabel";
import ProjectHeading from "./ProjectHeading";
import { EyeClosedIcon, EyeIcon } from "../../interface/Icons";
import useUIStore from "../../../stores/UIStore";
import MediaPlayer from "./MediaViewer";

type ProjectViewerProps = {
    projectId: string | null,
    isOpen: boolean
};

function ProjectViewer({ projectId, isOpen }: ProjectViewerProps) {
    const [open, setOpen] = useState(false);
    const [windowsMinimized, setWindowsMinimized] = useState(false);
    const [index, setIndex] = useState(0);

    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const toggleInterface = useUIStore((s) => s.toggleInterface);
    const setInterfaceHidden = useUIStore((s) => s.setInterfaceHidden);

    // Go back to first media block when another project opens
    useEffect(() => {
        setIndex(0);
    }, [projectId])

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

    const slides = project.media;

    return (
        <div className={`project-viewer ${open ? "open" : ""} ${interfaceHidden ? "ui-hidden" : ""}`}>
            <MediaPlayer slides={slides} index={index} />

            <div className="project-viewer__overlay">
                <div className="project-viewer__controls">
                    <ReturnButton />
                    <button
                        onClick={toggleInterface}
                        className="hide-interface__button"
                        aria-pressed={interfaceHidden}
                    >
                        {interfaceHidden ? <EyeClosedIcon /> : <EyeIcon />}
                        <span>{interfaceHidden ? "Show " : "Hide "} interface</span>
                    </button>
                </div>


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
                <MediaStrip slides={slides} index={index} setIndex={setIndex} />

            </div>


        </div>
    );
}

export default ProjectViewer;
