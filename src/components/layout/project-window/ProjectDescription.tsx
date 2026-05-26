function ProjectDescription({ description }: { description: string[] }) {
    if (description)
        return (
            <div>
                {description.map((paragraph, i) => {
                    return <p key={i}>{paragraph}</p>;
                })}
            </div>
        );
}

export default ProjectDescription;
