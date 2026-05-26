import { getTagsById } from "../../asset-handling/contentAssets";

function ProjectTags({ tagIds }: { tagIds: string[] }) {
    if (!tagIds) return;

    const tags = getTagsById(tagIds);

    if (tags)
        return (
            <div className="project-window__tags">
                {tags.map((tag, i) => {
                    return (
                        <span
                            style={{
                                backgroundColor: tag.color,
                                color: tag.textColor,
                            }}
                            key={i}
                        >
                            {tag.name.toUpperCase()}
                        </span>
                    );
                })}
            </div>
        );
}

export default ProjectTags;
