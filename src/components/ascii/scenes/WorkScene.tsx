import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MeshBasicMaterial } from "three";
import { damp } from "three/src/math/MathUtils.js";
import { createASCIITitle } from "../general/asciiFonts";
import AsciiBlock from "../general/AsciiBlock";

function WorkScene() {
    const ascii = useMemo(() => {
        return createASCIITitle(" MY WORK ");
    }, []);

    return (
        <>
            <AsciiBlock ascii={ascii} position={[0, 3.4, 0]} />
        </>
    );
}

export default WorkScene;
