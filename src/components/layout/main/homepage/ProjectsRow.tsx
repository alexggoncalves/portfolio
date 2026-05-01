import { useFrame, useThree } from "@react-three/fiber";
import ProjectCard from "../projects/ProjectCard";
import { useRef } from "react";
import type { Group } from "three";
import { projects } from "../../../app/assets/contentAssets";
import { Center, DragControls } from "@react-three/drei";
import {
    Container,
    Content,
    Fullscreen,
    Image,
    Portal,
    Text,
    VanillaContainer,
    type PortalProperties,
} from "@react-three/uikit";
// extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

const scale = 2.5;
const spacing = 1.4;
const titleSize = 30;

function ProjectsRow({ height = 2 }: { height: number }) {
    const rowRef = useRef<Group>(null);
    const pageRef = useRef(null);

    const { viewport, size } = useThree();

    const dragging = useRef(false);

    useFrame((state) => {
        if (!rowRef.current) return;
        if (dragging.current) {
            rowRef.current.position.x = state.pointer.x * 10;
        }
    });

    return (
        <>
            <group position={[0, -viewport.height / 2, 0]}>
                <Container
                    sizeY={height}
                    sizeX={viewport.width}
                    marginLeft={50}
                    positionType={"relative"}
                >
                    <Text
                        color={"white"}
                        textAlign={"left"}
                        fontSize={titleSize}
                        height={titleSize}
                        fontWeight={500}
                        transformTranslateY={"-170%"}
                        positionType={"absolute"}
                        anchorY={"top"}
                    >
                        MY PROJECTS
                    </Text>
                </Container>

                {/* INTERACTION LAYER */}
                <mesh
                    position={[0, 0, 0.1]} // slightly in front
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        dragging.current = true;
                    }}
                    onPointerUp={() => (dragging.current = false)}
                    onPointerLeave={() => (dragging.current = false)}
                    onPointerMove={(e) => {
                        if (!dragging.current || !rowRef.current) return;
                        rowRef.current.position.x += e.movementX * 0.01;
                    }}
                >
                    <planeGeometry args={[viewport.width, height]} />
                    <meshBasicMaterial opacity={0} transparent />
                </mesh>
                <group ref={rowRef}>
                    <Container
                        flexDirection={"column"}
                        sizeX={viewport.width}
                        marginLeft={50}
                    >
                        <Container
                            sizeY={height}
                            sizeX={viewport.width}
                            positionType={"relative"}
                            gap={10}
                        >
                            {projects?.map((project, index) => (
                                <ProjectCard
                                    height={height}
                                    key={index}
                                    project={project}
                                ></ProjectCard>
                            ))}
                        </Container>
                    </Container>
                </group>

                {/* Row Container */}
                {/* <Container sizeX={viewport.width}>
                        <Content
                            sizeY={height}
                            flexGrow={1}
                            flexDirection={"row"}
                        >
                            <group ref={rowRef}>
                                {projects?.map((project, index) => (
                                    <ProjectCard
                                        height={height}
                                        key={index}
                                        project={project}
                                    ></ProjectCard>
                                ))}
                            </group>
                        </Content>
                    </Container> */}
            </group>
        </>
    );
}

export default ProjectsRow;
