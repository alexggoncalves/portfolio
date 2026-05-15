import { Container, Text } from "@react-three/uikit";
import { type Project } from "../../../app/assets/contentAssets";
import Tools from "./Tools";
import Team from "./Team";
import Tag from "./Tag";

function ProjectDetails({ project }: { project: Project }) {
    return (
        <>
            {/* Details */}
            <Container flexDirection={"column"}>
                {/* Tags */}
                {project.tags && (
                    <Container width="100%" gap={10}>
                        {project.tags.map((tag, index) => (
                            <Tag key={"tag_" + index} tagId={tag}></Tag>
                        ))}
                    </Container>
                )}

                {/* Title */}
                <Text color={"white"} fontSize={40}>
                    {project.title}
                </Text>

                {/* Subtitle */}
                <Text color={"white"} fontSize={20} marginBottom={30}>
                    {project.subtitle}
                </Text>

                {/* Description */}
                {project.description.map((paragraph, index) => (
                    <Text
                        color={"white"}
                        fontSize={16}
                        marginBottom={10}
                        key={"paragraph_" + index}
                    >
                        {paragraph}
                    </Text>
                ))}

                {/* Tools */}
                <Tools tools={project.tools}></Tools>

                {/* Team */}
                {project.team && <Team team={project.team}></Team>}
            </Container>
        </>
    );
}

export default ProjectDetails;
