// import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Mesh } from "three";
// import { Image } from "@react-three/drei";

import { Center, Text3D } from "@react-three/drei";

function HomeScene() {
    return (
        <Center position={[0, 3.2, 0]} scale={[1, 1, 0.8]}>
            <Text3D font={"/fonts/IBMPlexMono_Regular.json"} lineHeight={0.6}>
                WORK
                {/* <meshBasicMaterial color={"white"}></meshBasicMaterial> */}
                <meshNormalMaterial />
            </Text3D>
        </Center>
    );
}

export default HomeScene;
