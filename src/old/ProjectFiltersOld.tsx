import "./projectsGrid.scss";
import { tags } from "../data/content";
import { useState } from "react";
import { ArrowIcon, CheckboxIcon, FilterIcon } from "../components/interface/Icons";

function ProjectFiltersOld({
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
            {/* <button
                className="button button--icon toggle toggle-right-btm filters-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isOpen ? <ArrowIcon /> : <FilterIcon />}
                {appliedFilters.length > 0 && (
                    <div className="filter-count">{appliedFilters.length}</div>
                )}
            </button> */}

            {/* Backdrop */}
            {/* <div
                className={`backdrop ${!isOpen ? "closed" : ""}`}
                style={{ zIndex: 10 }}
                onClick={() => {
                    setIsOpen(false);
                }}
            /> */}

            {/* Main container */}
            <div className={`projects-grid__filters open`}>
                <div className="projects-grid__filters-container">

                    {tags.map((tag) => {
                        const isActive = selectedFilters.includes(tag.id);

                        return (
                            <div
                                key={tag.id}
                                onClick={() => toggleFilter(tag.id)}
                                className={`filter ${isActive ? "active" : ""}`}
                            >
                                <div>
                                    <CheckboxIcon style={{color:tag.color}} active={isActive} />
                                    <span>{tag.name.toUpperCase()}</span>
                                </div>
                                <span>1</span>

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

export default ProjectFiltersOld;
