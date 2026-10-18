import { type Project } from "../../../../data/content";

import ProjectDescription from "./ProjectDescription";
import ProjectTools from "./ProjectTools";
// import ProjectTeam from "./ProjectTeam";
import ProjectTags from "./ProjectTags";
import { MinimizeIcon } from "../../general/Icons";

function ProjectInfo({ project }: { project: Project | null; }) {

    if (project)
        return (
            <>
                <div className="project-info">
                    <div className="project-info__header">
                        <span>PROJECT</span>
                        <span>•</span>
                        <span>{project.year}</span>
                        <MinimizeIcon className="project-info__minimize" />
                    </div>

                    <div className="project-info__content">
                        <ProjectTags tagIds={project.tags}></ProjectTags>
                        <h1>{project.title}</h1>
                        <h2>{project.subtitle.toUpperCase()}</h2>

                        <ProjectDescription description={project.description} />
                        {/* <ProjectTools tools={project.tools} /> */}

                        {/* <ProjectTeam team={project.team} /> */}
                    </div>
                </div>
            </>
        );
}

export default ProjectInfo;
