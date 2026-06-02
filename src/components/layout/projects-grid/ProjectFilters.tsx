import "./projectsGrid.scss";
import { tags } from "../general/content";
import { useState } from "react";
import { ArrowIcon, CheckboxIcon, FilterIcon } from "../general/Icons";

function ProjectFilters({
    onApply,
    appliedFilters,
}: {
    onApply: (tags: string[]) => void;
    appliedFilters: string[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (tagId: string) => {
        setSelectedFilters((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId],
        );
    };

    const clearFilters = () => {
        setSelectedFilters([]);
        onApply([]);
        setIsOpen(false);
    };

    const applyFilters = () => {
        onApply(selectedFilters);
        setIsOpen(false);
    };

    return (
        <>
            {/* Toggle */}
            <button
                className="toggle toggle-right"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isOpen ? <ArrowIcon /> : <FilterIcon />}
                {appliedFilters.length > 0 && (
                    <div className="filter-count">{appliedFilters.length}</div>
                )}
            </button>

            {/* Backdrop */}
            <div
                className={`backdrop ${!isOpen ? "closed" : ""}`}
                style={{ zIndex: 10 }}
                onClick={() => {
                    setIsOpen(false);
                }}
            />

            {/* Main container */}
            <div className={`projects-grid__filters ${isOpen ? "open" : ""}`}>
                <div className="projects-grid__filters-container">
                    <span>FILTERS</span>

                    {tags.map((tag) => {
                        const isActive = selectedFilters.includes(tag.id);

                        return (
                            <div
                                key={tag.id}
                                onClick={() => toggleFilter(tag.id)}
                                className={`filter ${isActive ? "active" : ""}`}
                                style={{
                                    backgroundColor: isActive
                                        ? tag.color
                                        : "rgba(255, 255, 255, 0.05)",
                                    color: isActive ? tag.textColor : "white",
                                }}
                            >
                                <span>{tag.name.toUpperCase()}</span>
                                <CheckboxIcon active={isActive} />
                            </div>
                        );
                    })}
                </div>
                
                <div className="projects-grid__filters-buttons">
                    <div onClick={clearFilters}>clear</div>
                    <div onClick={applyFilters}>APPLY</div>
                </div>
            </div>
        </>
    );
}

export default ProjectFilters;
