import { Link } from "react-router";
import useAssetStore from "../../assets/assetStore";
import type { Project } from "../../assets/contentAssets";
import "../homepage/homepage.scss";

function ProjectCard({ project }: { project: Project }) {
    const thumbnailAsset = useAssetStore(
        (s) => s.globalAssets[`${project.id}_thumbnail`],
    );

    const img =
        thumbnailAsset &&
        (thumbnailAsset.type === "image" || thumbnailAsset.type === "icon")
            ? thumbnailAsset.element
            : null;

    if (!thumbnailAsset?.isLoaded || !img) {
        return (
            <div
                className="project-card project-card--placeholder"
            />
        );
    }

    return (
        <Link
            to={`/projects/${project.id}`}
            className="project-card"
            onDragStart={(e) => e.preventDefault()}
        >
            <img
                src={img.currentSrc || img.src}
                alt={project.title}
                loading="lazy"
                decoding="async"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
        </Link>
    );
}

export default ProjectCard;
