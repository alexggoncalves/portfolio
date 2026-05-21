import { useRef } from "react";
import useRouteStore from "../../../stores/routeStore";
import CatSection from "./CatSection";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

function HomeScene() {
    const page = useRouteStore((s) => s.page);
    const projectId = useRouteStore((s) => s.projectId);
    const opacity = useRef(0);
    const targetOpacity = page === "home" && !projectId ? 1 : 0;

    useFrame((_, delta) => {
        opacity.current = MathUtils.damp(
            opacity.current,
            targetOpacity,
            6,
            delta,
        );
    });

    if(page === "home")
    return (
        <>
            <CatSection opacity={opacity}></CatSection>
        </>
    );
}

export default HomeScene;
