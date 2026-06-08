import { Link } from "react-router";
import { getTagsById, type Project } from "../../../data/content";
import "../homepage/homepage.scss";
import { XIcon } from "./Icons";

function ProjectCard({
    project,
    route,
    displayTags = false,
}: {
    project: Project;
    route: string;
    displayTags?: boolean;
}) {

    const tags = getTagsById(project.tags);

    return (
        <Link
            to={route}
            className="project-card"
            onDragStart={(e) => e.preventDefault()}
        >
            <img
                src={project.thumbnailSrc}
                alt={project.title}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />

            {/* TAGS */}
            {displayTags && (
                <div className="project-card__tags-container">
                    {tags.map((tag, i) => {
                        return (
                            <div key={i} className="tag-item">
                                <div
                                    className="tag-label"
                                    style={{
                                        backgroundColor: tag.color,
                                        color: tag.textColor,
                                    }}
                                >
                                    {tag.name.toUpperCase()}
                                </div>

                                <div
                                    className="tag-X"
                                    style={{
                                        color: tag.color,
                                    }}
                                >
                                    <XIcon />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Link>
    );
}

export default ProjectCard;
