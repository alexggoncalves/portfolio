import type { Project } from "../../../app/assets/contentAssets";
import { Container, Content } from "@react-three/uikit";
import { createSquircleGeometry } from "../../../../utils/createSquircle";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";

function ProjectCard({
    project,
    width,
    height,
}: {
    project: Project;
    width: number;
    height: number;
}) {
    const thumbnail = useTexture(project.thumbnailSrc);

    const squircle = useMemo(() => createSquircleGeometry(width, height, 0.5), []);

    return (
        <Container height={"100%"} flexShrink={0}>
            <Content>
                {squircle && (
                    <mesh  geometry={squircle}>
                        <meshBasicMaterial  map={thumbnail}></meshBasicMaterial>
                    </mesh>
                )}
            </Content>

            <Container positionType={"absolute"}>
                {/* {project.tags.map((tag)=>{
                    return <></>
                })} */}
            </Container>
        </Container>
    );
}

export default ProjectCard;
