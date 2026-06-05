import { useRef } from "react";
import useSceneStore from "../../../stores/sceneStore";
import CatSection from "./CatSection";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

function HomeScene() {
    const projectId = useSceneStore((s) => s.projectId);
    const opacity = useRef(0);
    const targetOpacity = !projectId ? 1 : 0;

    useFrame((_, delta) => {
        opacity.current = MathUtils.damp(
            opacity.current,
            targetOpacity,
            6,
            delta,
        );
    });

    return (
        <>
            <CatSection opacity={opacity}></CatSection>
        </>
    );
}

export default HomeScene;
