import { Link } from "react-router";
import { getTagsById, type Project } from "../../../data/content";
import "./projectCard.scss"

const MAX_TAGS = 2;

function ProjectCard({
    project,
    route,
}: {
    project: Project;
    route: string;
    displayTags?: boolean;
}) {

    const tags = getTagsById(project.tags);
    const visibleTags = tags.slice(0, MAX_TAGS);
    const hiddenTags = tags.slice(MAX_TAGS);

    return (
        <Link
            to={route}
            className="project-card"
            draggable={false}
        >
            <div className="project-card__image">
                <img
                    src={project.thumbnailSrc}
                    draggable={false}
                    loading="lazy"
                    alt=""
                />
            </div>

            <div className="project-card__text">
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__subtitle">{project.subtitle}</p>
            </div>

            <div className="project-card__tags">
                {visibleTags.map((tag) => (
                    <span
                        key={tag.id}
                        className="project-card__tag"
                        style={{ backgroundColor: tag.color, color: tag.textColor }}
                    >
                        {tag.name}
                    </span>
                ))}

                {hiddenTags.length > 0 && (
                    <span
                        className="project-card__tag project-card__tag--more"
                        data-tooltip={hiddenTags.map((t) => t.name).join(" · ")}
                    >
                        +{hiddenTags.length}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default ProjectCard;
