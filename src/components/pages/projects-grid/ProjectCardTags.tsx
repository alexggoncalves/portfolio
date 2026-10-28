import { getTagsById } from "../../../data/content";

type ProjectCardTagsProps = {
    tagIds: string[];
    maxTags?: number;
};

function ProjectCardTags({ tagIds, maxTags = 2 }: ProjectCardTagsProps) {
    const tags = getTagsById(tagIds);

    const visibleTags = tags?.slice(0, maxTags);
    const hiddenTags = tags?.slice(maxTags);

    return (

        <div className="project-card__tags">
            {visibleTags.map((tag) => (
                <span
                    key={tag.id}
                    className="project-card__tag"
                    style={{ backgroundColor: tag.color, color:tag.textColor}}
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

    );
}

export default ProjectCardTags;
