import { getTagsById } from "../../asset-handling/contentAssets";
import { XIcon } from "../general/Icons";

function ProjectTags({ tagIds }: { tagIds: string[] }) {
    if (!tagIds) return;

    const tags = getTagsById(tagIds);

    if (tags)
        return (
            <div className="project-window__tags">
                {tags.map((tag, i) => {
                    return (
                        <div
                            key={i}
                            style={{
                                backgroundColor: tag.color,
                                color: tag.textColor,
                            }}
                        >
                            <XIcon></XIcon>
                            <span>{tag.name.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>
        );
}

export default ProjectTags;
