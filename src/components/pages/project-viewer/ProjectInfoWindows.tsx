import { type Project } from "../../../data/content";

import ProjectTools from "./project-info/ProjectTools";
import ProjectTeam from "./project-info/ProjectTeam";
import Window from "../../interface/Window";
import ProjectInfo from "./project-info/ProjectInfo";
import { useState } from "react";
import { CloseIcon, MinimizeIcon } from "../../interface/Icons";
import { WindowActionButton } from "../../interface/Buttons";

export type Panel = "tools" | "team" | null;

type ProjectInfoWindowsProps = {
    project: Project | null;
    setMinimized: (value: boolean) => void;
    inert?: boolean;
}

function ProjectInfoWindows({ project, setMinimized, inert }: ProjectInfoWindowsProps) {
    const [panel, setPanel] = useState<Panel>(null);

    const togglePanel = (target: Exclude<Panel, null>) =>
        setPanel((current) => (current === target ? null : target));

    const closePanel = () => setPanel(null);

    const minimize = () => {
        setMinimized(true);
        setPanel(null);
    }

    if (!project) return;

    return (
        <div className="project-viewer__windows" inert={inert}>
            <Window
                title="Project info"
                className="project-info__window"
                headerLeft={<>
                    <span>Project</span>
                    <span aria-hidden={true}>•</span>
                    <span>{project.year}</span>
                </>}
                headerRight={
                    <WindowActionButton onAction={minimize} label={`Close project info window${panel ? "s" : ""}`}>
                        <MinimizeIcon />
                    </WindowActionButton>
                }
            >
                <ProjectInfo project={project} panel={panel} onTogglePanel={togglePanel}></ProjectInfo>
            </Window>

            {panel === "tools" && (
                <Window
                    title="Tools"
                    headerLeft={<span>Tools</span>}
                    headerRight={
                        <WindowActionButton onAction={closePanel} label="Close tools panel">
                            <CloseIcon />
                        </WindowActionButton>
                    }
                >
                    <ProjectTools tools={project.tools} />
                </Window>
            )}

            {panel === "team" && project.team && (
                <Window
                    title="Team"
                    className="project-team__window"
                    headerLeft={<span>Team</span>}
                    headerRight={
                       <WindowActionButton onAction={closePanel} label="Close team panel">
                            <CloseIcon />
                        </WindowActionButton>
                    }
                >
                    <ProjectTeam team={project.team} />
                </Window>

            )}
        </div >
    );
}

export default ProjectInfoWindows;
