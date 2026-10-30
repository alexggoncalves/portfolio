import type { Project } from "../../../../data/content";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectTools from "./ProjectTools";
import ProjectTeam from "./ProjectTeam";
import Window from "../../../ui/Window";
import { GithubIcon, PreviewIcon, TeamIcon, ToolsIcon } from "../../../ui/Icons";
import { ExternalLink } from "../../../ui/Buttons";
import Drawer from "../../../ui/Drawer";


type ProjectInfoDrawerProps = {
    project: Project;
}

const ProjectInfoDrawer = ({ project }: ProjectInfoDrawerProps) => {
    const header = <>
        
        <div className="project-drawer__heading">
            <div className="project-drawer__title-group">
                <h1 className="project-drawer__title">{project.title}</h1>
                <span className="project-drawer__subtitle">{project.subtitle}</span>
            </div>
            <div className="project-drawer__links">
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
        <ProjectTags tagIds={project.tags} />
    </>

    return (
        <Drawer header={header} className="project-drawer">
            <ProjectDescription description={project.description} />
            <Window
                title="Tools"
                className="project-tools__window"
                headerLeft={<>
                    <span>Tools</span>
                    <span aria-hidden={true}>•</span>
                    <span>{project.tools.length}</span>
                </>}
                headerRight={<ToolsIcon className='window-header__icon' />}
            >
                <ProjectTools tools={project.tools} />
            </Window>

            <Window
                title="Team"
                className="project-team__window"
                headerLeft={<>
                    <span>Team</span>
                    <span aria-hidden={true}>•</span>
                    <span>{project.team?.length}</span>
                </>}
                headerRight={<TeamIcon className='window-header__icon' />}
            >
                <ProjectTeam team={project.team} />
            </Window>

        </Drawer>
    )
}

export default ProjectInfoDrawer;