import { type Project } from "../../../../data/content";

import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import { GithubIcon, PreviewIcon, TeamIcon, ToolsIcon } from "../../../ui/Icons";
import { ExternalLink, PanelToggle } from "../../../ui/Buttons";
import type { Panel } from "./ProjectInfoWindows";

type ProjectInfoProps = {
    project: Project;
    panel?: Panel;
    onTogglePanel?: (panel: "tools" | "team") => void;
}

function ProjectInfo({ project, panel, onTogglePanel }: ProjectInfoProps) {
    if (!project) return;
    return (
        <>
            <ProjectTags tagIds={project.tags} />
            <p className="project-info__title">{project.title}</p>
            <p className="project-info__subtitle">{project.subtitle}</p>
            <ProjectDescription description={project.description} />

            <div className="project-info__actions">
                {onTogglePanel &&
                    <div>
                        <PanelToggle
                            icon={<ToolsIcon />}
                            label="Tools"
                            count={project.tools.length}
                            active={panel === "tools"}
                            onClick={() => onTogglePanel("tools")}
                        />
                        {project.team?.length ? (
                            <PanelToggle
                                icon={<TeamIcon />}
                                label="Team"
                                count={project.team?.length}
                                active={panel === "team"}
                                onClick={() => onTogglePanel("team")}
                            />
                        ) : null}
                    </div>}

                <div>
                    {project.git &&
                        <ExternalLink href={project.git} label="Source code on Github">
                            <GithubIcon />
                        </ExternalLink>
                    }

                    {project.link &&
                        <ExternalLink href={project.link} label={`Open ${project.title}`}>
                            <PreviewIcon />
                        </ExternalLink>
                    }

                </div>
            </div>
        </>
    );
}

export default ProjectInfo;
