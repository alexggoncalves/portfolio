import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MeshBasicMaterial } from "three";
import { damp } from "three/src/math/MathUtils.js";
import { createASCIITitle } from "../general/asciiFonts";
import AsciiBlock from "../general/AsciiBlock";

function ContactScene() {
    const titleRef = useRef<MeshBasicMaterial>(null);
    const opacity = useRef(0);

    useFrame((_, delta) => {
        opacity.current = damp(opacity.current, 1, 4, delta);

        if (titleRef.current) {
            titleRef.current.opacity = opacity.current;
        }
    });

    const ascii = useMemo(() => {
        return createASCIITitle(" CONTACTS ");
    }, []);

    return (
        <>
            <AsciiBlock ascii={ascii} position={[0, 1.7, 0]} />
        </>
    );
}

export default ContactScene;
