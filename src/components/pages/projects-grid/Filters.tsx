import "./projectsGrid.scss";
import { type Dispatch, type SetStateAction } from "react";
import { CheckboxIcon } from "../../general/Icons";
import type { Project, Tag } from "../../../data/content";

type FiltersProps = {
    projects: Project[];
    filters: Tag[];
    title?: string;
    selectedFilters: string[];
    setSelectedFilters: Dispatch<SetStateAction<string[]>>;
}

function Filters({ projects, filters, title, selectedFilters, setSelectedFilters }: FiltersProps) {

    const toggleFilter = (tagId: string) => {
        setSelectedFilters((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId],
        );
    };

    return (
        <>
            <div className="filter-section">
                {title && <span className="filter-section__title">{title}</span>}

                {filters.map((filter) => {
                    const isActive = selectedFilters.includes(filter.id);
                    const count = projects.filter((p) => p.tags.includes(filter.id)).length;
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
                            <span className="filter__count">{count}</span>

                        </button>
                    );
                })}
            </div>
        </>
    );
}

export default Filters;
