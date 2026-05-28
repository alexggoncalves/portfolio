import "./projectsGrid.scss";
import { projects, tags } from "../../asset-handling/contentAssets";
import ProjectCard from "../general/ProjectCard";
import { useMemo, useState } from "react";
import { ArrowIcon, FilterIcon } from "../general/Icons";

function ProjectsGridPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [appliedTags, setAppliedTags] = useState<string[]>([]);

    const filteredProjects = useMemo(() => {
        if (appliedTags.length === 0) return projects;

        return projects.filter((project) =>
            appliedTags.some((tag) => project.tags.includes(tag)),
        );
    }, [appliedTags, projects]);

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId],
        );
    };

    const clearTags = () => {
        setSelectedTags([]);
        setAppliedTags([]);
        setIsOpen(false);
    };

    const applyTags = () => {
        setAppliedTags(selectedTags);
        setIsOpen(false);
    };

    return (
        <>
            {/* FILTERS */}
            <button
                className="toggle toggle-right"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isOpen ? <ArrowIcon /> : <FilterIcon />}
            </button>

            <div
                className={`backdrop ${!isOpen ? "closed" : ""}`}
                onClick={() => {
                    setSelectedTags(appliedTags);
                    setIsOpen(false);
                }}
            />

            <div className={`projects-grid__filters ${isOpen ? "open" : ""}`}>
                <div className="projects-grid__filters-container">
                    {tags.map((tag) => {
                        const isActive = selectedTags.includes(tag.id);

                        return (
                            <div
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={isActive ? "active" : ""}
                                style={{
                                    backgroundColor: isActive
                                        ? tag.color
                                        : "transparent",
                                    color: isActive ? tag.textColor : "white",
                                }}
                            >
                                {tag.name}
                            </div>
                        );
                    })}
                </div>
                <div className="projects-grid__filters-buttons">
                    <div onClick={clearTags}>clear</div>
                    <div onClick={applyTags}>APPLY</div>
                </div>
            </div>

            {/* GRID */}
            <div className="projects-grid">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        route={`/projects/${project.id}`}
                    />
                ))}
            </div>
        </>
    );
}

export default ProjectsGridPage;
