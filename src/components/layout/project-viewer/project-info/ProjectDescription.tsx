function RichText({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*")
                    ? <em key={i}>{part.slice(1, -1)}</em>
                    : part
            )}
        </>
    );
}

function ProjectDescription({ description }: { description: string[] }) {
    if (description)
        return (
            <div className="project-window__description">
                {description.map((paragraph, i) => {
                    return <p key={i}><RichText text={paragraph}></RichText></p>;
                })}
            </div>
        );
}

export default ProjectDescription;
