import "./projectViewer.scss";
import "./mediaStage.scss"

import { getProjectById, type MediaSlide, type Project } from "../../../data/content";
import { useEffect, useMemo, useRef, useState } from "react";

import ProjectInfoWindows from "./ProjectInfoWindows";
import MediaStage from "./MediaStage";
import ReturnButton from "./ReturnButton";
import MediaStrip from "./project-media/MediaStrip";
import VideoControls from "./project-media/VideoControls";
import MediaLabel from "./project-media/MediaLabel";
import ProjectHeading from "./ProjectHeading";

const isVideoSlide = (b?: MediaSlide) => b?.type === "single" && b.media.type === "video";

type Props = {
    projectId: string | null,
    isOpen: boolean
};

function ProjectViewer({ projectId, isOpen }: Props) {
    const [open, setOpen] = useState(false);
    const [windowsMinimized, setWindowsMinimized] = useState(false);
    const [index, setIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

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

    if (!project) return null;

    const slides = project.media;
    const currentSlide = slides[index];


    return (
        <div className={`project-viewer ${open ? "open" : ""}`}>
            <MediaStage slides={slides} index={index} videoRef={videoRef} />

            <div className="project-viewer__overlay">
                {windowsMinimized ?
                    <ProjectHeading title={project.title} subtitle={project.subtitle} maximizeWindows={() => setWindowsMinimized(false)} />
                    :
                    <ProjectInfoWindows project={project} setMinimized={setWindowsMinimized} />
                }
                <div className="project-viewer__controls">
                    <MediaStrip slides={slides} index={index} setIndex={setIndex} />
                    <div className="project-viewer__controls-right">
                        {isVideoSlide(currentSlide) && <VideoControls videoRef={videoRef} />}
                        <MediaLabel index={index} total={slides.length} title={currentSlide?.title} />
                    </div>
                </div>
            </div>
            <ReturnButton />
        </div>
    );
}

export default ProjectViewer;
