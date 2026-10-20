import { type Project } from "../../../data/content";

import ProjectTools from "./project-info/ProjectTools";
import ProjectTeam from "./project-info/ProjectTeam";
import Window from "../../interface/Window";
import ProjectInfo from "./project-info/ProjectInfo";
import { useState } from "react";

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
                header={<>
                    <span>PROJECT</span>
                    <span>•</span>
                    <span>{project.year}</span>
                </>}
                actionType="minimize"
                onAction={minimize}
                className="project-info__window"
            >
                <ProjectInfo project={project} panel={panel} onTogglePanel={togglePanel}></ProjectInfo>
            </Window>

            {panel === "tools" && (
                < Window
                    title="Tools"
                    header={<span>TOOLS</span>}
                    actionType="close"
                    onAction={closePanel}
                    className="project-team__window"
                >
                    <ProjectTools tools={project.tools} />
                </Window>
            )}

            {panel === "team" && project.team && (
                <Window
                    title="Team"
                    header={<span>TEAM</span>}
                    actionType="close"
                    onAction={closePanel}
                    className="project-team__window"
                >
                    <ProjectTeam team={project.team} />
                </Window>

            )}
        </div >
    );
}

export default ProjectInfoWindows;
