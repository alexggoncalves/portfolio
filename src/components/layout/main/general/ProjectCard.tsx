import type { Project } from "../../../app/assets/contentAssets";
import { Container, Content } from "@react-three/uikit";
import { createSquircleGeometry } from "../../../../utils/createSquircle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAssetStore from "../../../app/assets/assetStore";
import { Group, Mesh, Texture } from "three";
import { useNavigate } from "react-router";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import CardTag from "./CardTag";

function ProjectCard({
    project,
    width,
    height,
    suppressClickRef,
}: {
    project: Project;
    width: number;
    height: number;
    suppressClickRef: React.RefObject<boolean>;
}) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const cardRef = useRef<Group>(null);
    const outlineRef = useRef<Mesh>(null);

    useCursor(isHovered);

    // Get image record
    const thumbnailAsset = useAssetStore(
        (s) => s.globalAssets[`${project.id}_thumbnail`],
    );

    // Create texture from thumbnail image
    const thumbnailTexture = useMemo(() => {
        if (!thumbnailAsset) return null;
        if (!thumbnailAsset.element) return null;

        const texture = new Texture(thumbnailAsset.element);
        texture.needsUpdate = true;

        return texture;
    }, [thumbnailAsset]);

    useEffect(() => {
        return () => thumbnailTexture?.dispose();
    }, [thumbnailTexture]);

    const squircle = useMemo(
        () => createSquircleGeometry(width, height, 0.5),
        [width, height],
    );

    const outline = useMemo(
        () => createSquircleGeometry(width + 0.01, height + 0.01, 0.5),
        [width, height],
    );

    useFrame((_, delta) => {
        if (!cardRef.current || !outlineRef.current) return;

        const smooth = 1 - Math.exp(-10 * Math.min(delta, 0.033));

        const target = isHovered ? 1.03 : 1;
        const outlineTarget = isHovered ? 1.01 : 0.99;

        cardRef.current.scale.x += (target - cardRef.current.scale.x) * smooth;
        cardRef.current.scale.y += (target - cardRef.current.scale.y) * smooth;

        outlineRef.current.scale.x +=
            (outlineTarget - outlineRef.current.scale.x) * smooth;
        outlineRef.current.scale.y +=
            (outlineTarget - outlineRef.current.scale.y) * smooth;
    });

    const navigateToProject = useCallback(() => {
        if (suppressClickRef.current) return;
        navigate(`/projects/${project.id}`);
    }, [navigate, project.id, suppressClickRef]);

    useEffect(() => {
        const onBlur = () => {
            if (!cardRef.current) return;
            cardRef.current.scale.set(1, 1, 1);
        };

        window.addEventListener("blur", onBlur);
        return () => window.removeEventListener("blur", onBlur);
    }, []);

    return (
        <Container height={"100%"} flexShrink={0} cursor={"pointer"}>
            <Content onClick={navigateToProject} cursor={"pointer"}>
                {squircle && (
                    <group ref={cardRef}>
                        <mesh ref={outlineRef} geometry={outline}>
                            <meshBasicMaterial color="white" />
                        </mesh>

                        <mesh
                            geometry={squircle}
                            onPointerEnter={() => {
                                setIsHovered(true);
                            }}
                            onPointerLeave={() => {
                                setIsHovered(false);
                            }}
                        >
                            {thumbnailTexture ? (
                                <meshBasicMaterial
                                    map={thumbnailTexture}
                                ></meshBasicMaterial>
                            ) : (
                                <meshBasicMaterial
                                    color={"white"}
                                ></meshBasicMaterial>
                            )}
                        </mesh>

                        {/* Tags */}
                        <Container
                            flexDirection={"column"}
                            positionType="absolute"
                            alignItems={"flex-end"}
                            sizeX={width}
                            sizeY={height}
                            positionTop={"12vh"}
                            positionLeft={5}
                            gap={4}
                        >
                            {project.tags.map((tag) => {
                                return <CardTag tagId={tag} isActive={isHovered}></CardTag>;
                            })}
                        </Container>
                    </group>
                )}
            </Content>
        </Container>
    );
}

export default ProjectCard;
