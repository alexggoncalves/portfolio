import { getTagsById } from "../../../../data/content";

function ProjectTags({ tagIds }: { tagIds: string[] }) {
    if (!tagIds) return;

    const tags = getTagsById(tagIds);

    if (tags)
        return (
            <div className="project-info__tags">
                {tags.map((tag, i) => {
                    return (
                        <div
                            key={i}
                            style={{
                                backgroundColor: tag.color,
                                // color: tag.textColor,
                            }}
                        >
                            <span>{tag.name.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>
        );
}

export default ProjectTags;
