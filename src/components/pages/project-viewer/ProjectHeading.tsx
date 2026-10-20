import { ChevronUp } from "../../interface/Icons";

type ProjectHeadingProps = {
    title: string;
    subtitle: string;
    maximizeWindows: () => void;
    inert: boolean;
}

function ProjectHeading({ title, subtitle, maximizeWindows, inert }: ProjectHeadingProps) {
    return (
        <button onClick={maximizeWindows} className="project-viewer__heading" inert={inert}>
            <div>
                <span className="project-viewer__heading-title">{title}</span>
                <span className="project-viewer__heading-subtitle">{subtitle.toUpperCase()}</span>
            </div>

            <ChevronUp />
        </button>
    );
}

export default ProjectHeading;
