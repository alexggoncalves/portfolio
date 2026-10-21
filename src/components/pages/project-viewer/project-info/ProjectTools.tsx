import { getToolById } from "../../../../data/content";

function ProjectTools({ tools }: { tools: string[] }) {
    if (tools)
        return (
            <>
                <div className="project-tools">
                    {tools?.map((tool, i) => {
                        const icon = getToolById(tool);
                        if (icon)
                            return (
                                <div key={i} className="project-tools__tool">
                                    <span>{icon.title}</span>
                                    <img src={icon.src}/>
                                </div>
                            )
                    })}
                </div>
            </>
        );
}

export default ProjectTools;
