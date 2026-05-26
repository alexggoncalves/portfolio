import { Link } from "react-router";
import useAssetStore from "../../../stores/assetStore";
import { getTagsById, type Project } from "../../asset-handling/contentAssets";
import "../homepage/homepage.scss";

function ProjectCard({ project, route }: { project: Project; route: string }) {
    const thumbnailAsset = useAssetStore(
        (s) => s.globalAssets[`${project.id}_thumbnail`],
    );

    const img =
        thumbnailAsset &&
        (thumbnailAsset.type === "image" || thumbnailAsset.type === "icon")
            ? thumbnailAsset.element
            : null;

    if (!thumbnailAsset?.isLoaded || !img) {
        return <div className="project-card project-card--placeholder" />;
    }

    const tags = getTagsById(project.tags);

    return (
        <Link
            to={route}
            className="project-card"
            onDragStart={(e) => e.preventDefault()}
        >
            <img
                src={img.currentSrc || img.src}
                alt={project.title}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />

            {/* TAGS */}
            <div className="project-card__tags-container">
                {tags.map((tag, i) => {
                    return (
                        <div
                            style={{
                                backgroundColor: tag.color,
                                color: tag.textColor,
                            }}
                            key={i}
                        >
                            {tag.name.toUpperCase()}
                        </div>
                    );
                })}
            </div>
        </Link>
    );
}

export default ProjectCard;
