import "./projectViewer.scss";
import "./mediaStage.scss"

import { getProjectById, type MediaSlide, type Project } from "../../../data/content";
import { useEffect, useMemo, useRef, useState } from "react";

import ProjectInfo from "./project-info/ProjectInfo";
import MediaStage from "./media-stage/MediaStage";
import ReturnButton from "./ReturnButton";
import MediaStrip from "./media-stage/MediaStrip";
import VideoControls from "./media-stage/VideoControls";
import MediaLabel from "./media-stage/MediaLabel";

const isVideoSlide = (b?: MediaSlide) => b?.type === "single" && b.media.type === "video";

type Props = {
    projectId: string | null,
    isOpen: boolean
};

function ProjectViewer({ projectId, isOpen }: Props) {
    const [open, setOpen] = useState(false);
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
    const current = slides[index];

    return (
        <div className={`project-viewer ${open ? "open" : ""}`}>
            <MediaStage slides={slides} index={index} videoRef={videoRef} />

            <div className="project-viewer__overlay">

                <ProjectInfo project={project} />
                <div className="project-viewer__controls">
                    <MediaStrip slides={slides} index={index} setIndex={setIndex} />
                    <div className="project-viewer__controls-right">
                        {isVideoSlide(current) && <VideoControls videoRef={videoRef} />}
                        <MediaLabel index={index} total={slides.length} title={current?.title} />
                    </div>

                </div>
            </div>
            <ReturnButton />
        </div>
    );
}

export default ProjectViewer;
