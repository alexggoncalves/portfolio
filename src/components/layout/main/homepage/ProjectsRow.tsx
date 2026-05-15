import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import ProjectCard from "../general/ProjectCard";
import { useCallback, useMemo, useRef } from "react";
import type { Group } from "three";
import { projects } from "../../../app/assets/contentAssets";
import { Container, Text } from "@react-three/uikit";
import Button3D from "../general/Button3D";
import { useNavigate } from "react-router";

const titleSize = 30;

const friction = 8; // inertia damping
const springK = 80; // spring stiffness at bounds
const springDamping = 20; // spring damping
const bottomMargin = 0.5;

const DRAG_CLICK_THRESHOLD = 0.02;

function ProjectsRow({
    height = 2,
    margin = 50,
    cardGap = 15,
    cardAspect = 4 / 3,
}: {
    height: number;
    cardGap?: number;
    margin?: number;
    cardAspect?: number;
}) {
    const { viewport, size } = useThree();
    const navigate = useNavigate();

    const rowRef = useRef<Group>(null);
    const totalDrag = useRef(0);
    const suppressCardClick = useRef(false);

    const maxOffset = useMemo(() => {
        const cardWidthWorld = height * cardAspect;

        const gapWorld = (cardGap / size.width) * viewport.width;

        const marginWorld = (margin / size.width) * viewport.width;

        const totalContentWorld =
            projects.length * cardWidthWorld +
            Math.max(0, projects.length - 1) * gapWorld;
        const visibleWorld = Math.max(0, viewport.width - marginWorld * 2);
        return Math.max(0, totalContentWorld - visibleWorld);
    }, [height, size.width, viewport.width, projects.length]);

    const currentX = useRef(0);
    const dragLastX = useRef(0);
    const velocity = useRef(0);

    const isDragging = useRef(false);

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        dragLastX.current = e.point.x;
        isDragging.current = true;
        velocity.current = 0;

        totalDrag.current = 0;
        suppressCardClick.current = false;
    };

    const onPointerUp = (_e: ThreeEvent<PointerEvent>) => {
        isDragging.current = false;
    };

    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging.current || !rowRef.current) return;

        // Calculate delta
        const delta = e.point.x - dragLastX.current;
        dragLastX.current = e.point.x;

        // Add up total drag to supress card navigation
        totalDrag.current += Math.abs(delta);
        if (totalDrag.current > DRAG_CLICK_THRESHOLD) {
            suppressCardClick.current = true;
        }

        // Update velocity for damping on release
        velocity.current = delta * 60;
        currentX.current += delta;
    };

    useFrame((_state, delta) => {
        if (!rowRef.current) return;

        if (isDragging.current) {
            rowRef.current.position.x = currentX.current;
            return;
        }

        const isLeft = currentX.current > 0;
        const isRight = currentX.current < -maxOffset;

        if (isLeft || isRight) {
            const targetX = isLeft ? 0 : -maxOffset;

            const springForce =
                -springK * (currentX.current - targetX) -
                springDamping * velocity.current;
            if (!isDragging.current) {
                velocity.current += springForce * delta;
                currentX.current += velocity.current * delta;
            }
        } else {
            currentX.current += velocity.current * delta;
            velocity.current *= Math.exp(-friction * delta);
            if (Math.abs(velocity.current) < 0.001) velocity.current = 0;
        }
        if (velocity.current != 0) {
            rowRef.current.position.x = currentX.current;
        }
    });

    const goToProjectsGrid = useCallback(() => {
        navigate("/projects");
    }, [navigate]);

    return (
        <>
            <group
                position={[
                    0,
                    -viewport.height / 2 + height / 2 + bottomMargin,
                    0,
                ]}
            >
                {/* Title */}
                <Container
                    sizeY={height}
                    sizeX={viewport.width}
                    paddingLeft={50}
                    paddingRight={50}
                    positionType={"relative"}
                >
                    <Container
                        width={"100%"}
                        height={titleSize}
                        positionType={"relative"}
                        transformTranslateY={"-180%"}
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                    >
                        <Container gap={40} flexDirection={"row"}>
                            <Text
                                color={"white"}
                                textAlign={"left"}
                                fontSize={titleSize}
                                fontWeight={500}
                            >
                                MY PROJECTS
                            </Text>

                            <Button3D
                                width={8}
                                height={2}
                                depth={1.2}
                                callBack={goToProjectsGrid}
                            ></Button3D>
                        </Container>
                        <Container
                            height={"50%"}
                            width={100}
                            anchorX={"right"}
                            borderRadius={25}
                            borderColor={"white"}
                            borderWidth={1}
                            alignSelf={"center"}
                        ></Container>
                    </Container>
                </Container>

                {/* Interaction quad stripe */}
                <mesh
                    position={[0, 0, 0.1]}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerMove={onPointerMove}
                    onPointerCancel={onPointerUp}
                    onPointerLeave={onPointerUp}
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
                            flexDirection={"row"}
                            gap={cardGap}
                        >
                            {projects?.map((project, index) => (
                                <ProjectCard
                                    height={height}
                                    width={height * cardAspect}
                                    key={index}
                                    project={project}
                                    suppressClickRef={suppressCardClick}
                                ></ProjectCard>
                            ))}
                        </Container>
                    </Container>
                </group>
            </group>
        </>
    );
}

export default ProjectsRow;
