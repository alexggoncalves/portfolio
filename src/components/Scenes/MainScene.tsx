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
            <spotLight
                decay={0}
                position={[10, 20, 10]}
                angle={1}
                penumbra={1}
                intensity={3}
                castShadow
                shadow-mapSize={1024}
            />
            {/* Objects */}
            <RotatingModel ySpeed={2} xSpeed={0.5} position={[3, -0.5, -2]}>
                <OBJModel
                    path="/models/banana2"
                    position={[0, 0, 0]}
                    scale={2.9}
                    rotation={[0, 3, -0.3]}
                />
            </RotatingModel>
            {/* <Image
                url="/images/cat.jpg"
                rotation={[0, 0, 0]}
                position={[4, 0, 1.5]}
                scale={3}
            /> */}
            <mesh
                position={[0, 0, 1]}
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <sphereGeometry args={[0.8, 24, 24]} />
                <meshPhongMaterial color="royalblue" />
            </mesh>
        </group>
    );
}

export default MainScene;
