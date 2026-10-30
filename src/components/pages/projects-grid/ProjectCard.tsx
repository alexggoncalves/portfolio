import "./ProjectCard.scss"

import { Link } from "react-router";
import { type Project } from "../../../data/content";
import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";
import ProjectCardTags from "./ProjectCardTags";

type ProjectCardProps = {
    project: Project;
    route: string;
    variant?: "full" | "thumbnail";
};

function ProjectCard({ project, route, variant = "full" }: ProjectCardProps) {
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const maxTags = isMobile ? 3 : 2;
    
    return (
        <Link
            to={route}
            className={`project-card project-card--${variant}`}
            draggable={false}
        >
            <div className="project-card__image">
                <img
                    src={project.thumbnailSrc}
                    draggable={false}
                    loading="lazy"
                    alt=""
                />
                <div className="project-card__year">{project.year}</div>
                { variant === "full" && <ProjectCardTags tagIds={project.tags} maxTags={maxTags} />}
            </div>

            {variant === "full" &&
                <>
                    <div className="project-card__text">
                        <h3 className="project-card__title">{project.title}</h3>
                        <p className="project-card__subtitle">{project.subtitle}</p>
                    </div>
                </>
            }
        </Link>
    );
}

export default ProjectCard;
