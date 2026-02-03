// import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Mesh } from "three";
// import { Image } from "@react-three/drei";

import { OBJModel, RotatingModel } from "./ModelComponents";

function MainScene() {
    return (
        <group>
            {/* Colors and background */}

            <hemisphereLight intensity={1.5} />
            <pointLight
                position={[-10, 20, 2]}
                intensity={3}
                castShadow
                shadow-mapSize={1024}
            />

            <pointLight
                position={[10, 20, 2]}
                intensity={3}
                castShadow
                shadow-mapSize={1024}
            />
            {/* Objects */}
            {/* <RotatingModel ySpeed={0.1} position={[0, 0, 0]}>
                <OBJModel
                    path="/models/alex"
                    position={[0, 0, 0]}
                    scale={6}
                    rotation={[0, 0, 0]}
                ></OBJModel>
            </RotatingModel> */}

            {/* <GradientTexture
                stops={[0, 0.5]} // As many stops as you want
                colors={["black", "white"]} // Colors need to match the number of stops
                size={1024} // Size is optional, default = 1024
            /> */}
            {/* <Image
                url="/images/cat.jpg"
                rotation={[0, 0, 0]}
                position={[4, 0, 1.5]}
                scale={3}
            /> */}
            {/* <mesh
                position={[0, 0, 1]}
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <sphereGeometry args={[0.8, 24, 24]} />
                <meshPhongMaterial color="royalblue" />
            </mesh> */}
        </group>
    );
}

export default MainScene;
