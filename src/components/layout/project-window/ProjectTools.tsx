import { getIconById } from "../../../data/content";

function ProjectTools({ tools }: { tools: string[] }) {
    if (tools)
        return (
            <>
                <h3>TOOLS:</h3>
                <div className="project-window__tools">
                    {tools?.map((tool) => {
                        const icon = getIconById(tool);

                        if (icon) return <img src={icon?.src} alt="" />;
                        else return <span>{tool}</span>;
                    })}
                </div>
            </>
        );
}

export default ProjectTools;
