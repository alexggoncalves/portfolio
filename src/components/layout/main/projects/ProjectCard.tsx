import { useLoader, type Vector3 } from "@react-three/fiber";
import { TextureLoader } from "three";
import type { Project } from "../../../app/assets/contentAssets";
import { useNavigate } from "react-router";
import { Container, Image, SuspendingImage } from "@react-three/uikit";
import { Suspense } from "react";

// extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

function ProjectCard({
    height,
    project,
}: {
    height: number;
    project: Project;
}) {
    const texture = useLoader(TextureLoader, project.thumbnailSrc);

    const navigate = useNavigate();

    const aspect = texture.image.width / texture.image.height;
    return (
        <Container height={"100%"} flexShrink={0}>
            <Image src={project.thumbnailSrc} onPointerDown={() => navigate(`/projects/${project.id}`)}></Image>
        </Container>
        
        // // Projects Row
        // <group position={position} scale={scale}>
        // <mesh
        //     position={[0, 0, 0]}
            
        // >
        //     <planeGeometry args={[aspect, 1]}></planeGeometry>
        //     <meshBasicMaterial attach="material" map={texture} transparent />
        //     {/* <meshBasicMaterial color="red" wireframe /> */}
        // </mesh>

        //
        // </group>
    );
}

export default ProjectCard;
