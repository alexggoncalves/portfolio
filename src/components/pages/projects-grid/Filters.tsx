import "./projectsGrid.scss";
import { useState } from "react";
import { CheckboxIcon } from "../../interface/Icons";
import type { Tag } from "../../../data/content";

type FiltersProps = {
    filters: Tag[];
    title: string;
    onApply: (tags: string[]) => void;
    appliedFilters: string[];
}

function Filters({ filters, title, onApply, appliedFilters }: FiltersProps) {
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
            {/* Main container */}
            <div className="filter-section">
                <span className="filter-section__title">{title}</span>

                {filters.map((filter) => {
                    const isActive = selectedFilters.includes(filter.id);

                    return (
                        <button
                            type="button"
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter ${isActive ? "active" : ""}`}
                        >
                            <div className="filter__label">
                                <CheckboxIcon style={{ color: filter.color }} active={isActive} />
                                <span>{filter.name}</span>
                            </div>
                            <span className="filter__count">1</span>

                        </button>
                    );
                })}
            </div>

            {/* <div className="projects-grid__filters-buttons">
                    <div onClick={clearFilters}>clear</div>
                    <div onClick={applyFilters}>APPLY</div>
                </div> */}
        </>
    );
}

export default Filters;
