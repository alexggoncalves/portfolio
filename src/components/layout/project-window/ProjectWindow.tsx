import { Link } from "react-router";
import {
    getPersonById,
    getProjectById,
    type Project,
} from "../../asset-handling/contentAssets";
import "./projectWindow.scss";

import { useEffect, useMemo, useState } from "react";

function ProjectWindow({
    projectId,
    isOpen,
}: {
    projectId: string | null;
    isOpen: boolean;
}) {
    const [open, setOpen] = useState(false);

    const project: Project | null = useMemo(() => {
        if (!projectId) return null;

        return getProjectById(projectId);
    }, [projectId]);

    if (!project) return null;

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setOpen(true));
        } else {
            setOpen(false);
        }
    }, [isOpen]);

    return (
        <div className={`project-window ${open ? "open" : ""}`}>
            <div className="project-window-container">
                <div className="project-window-panel left">
                    <Link to={"/"} className="project-window-back">
                        <div>+</div>
                    </Link>
                    <div className="project-details">
                        <h1>{project.title}</h1>
                        <h2>{project.subtitle}</h2>

                        <div>
                            {project.description.map((paragraph) => {
                                return <p>{paragraph}</p>;
                            })}
                        </div>

                        <h3>TOOLS:</h3>
                        <div className="project-tools">
                            {project.tools?.map((tool) => (
                                <div>{tool}</div>
                            ))}
                        </div>
                        {project.team && (
                            <>
                                <h3>TEAM:</h3>
                                <div className="project-team-container">
                                    {project.team?.map((teamMember) => {
                                        const person = getPersonById(
                                            teamMember.id,
                                        );
                                        if (!person) return;
                                        const splitName = person.name.replace(
                                            " ",
                                            "\n",
                                        );
                                        return <div>{splitName}</div>;
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="project-window-panel right"></div>
            </div>
        </div>
    );
}

export default ProjectWindow;
