// import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Mesh } from "three";
// import { Image } from "@react-three/drei";

import { Center, Text3D } from "@react-three/drei";
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
            {/* <RotatingModel ySpeed={0.01} position={[0, 0, 0]}>
                <OBJModel
                    path="/models/alex"
                    position={[0,0, 0]}
                    scale={10}
                    rotation={[0, 0, 0]}
                ></OBJModel>
            </RotatingModel> */}

            {/* <OBJModel
                path="/models/alex"
                position={[-6.6, 3.4, 0]}
                scale={1.3}
                rotation={[0, 0, 0]}
            >

            </OBJModel> */}

            {/* <RotatingModel ySpeed={0} position={[0, 0, -4]}>
                <Center>
                    <Text3D
                        scale={[7, 9, 8]}
                        font={"/fonts/IBMPlexMono_Regular.json"}
                    >
                        Alex
                        <meshNormalMaterial opacity={0.1} />
                    </Text3D>
                </Center>
            </RotatingModel> */}

            {/* HOME */}

            <Center left position={[-5.2, 3.3, 0]}>
                <Text3D
                    scale={[0.8, 0.8, 1]}
                    font={"/fonts/IBMPlexMono_Regular.json"}
                >
                    Alex
                    {/* <meshNormalMaterial />*/}
                    {/* <meshBasicMaterial color={[1,1,1]}></meshBasicMaterial> */}
                    <meshStandardMaterial color={[2.06,2.06,2.06]}></meshStandardMaterial>
                </Text3D>
            </Center>

            {/* <Center position={[0, 0, 0]}>
                <Text3D
                    scale={[1, 2, 2]}
                    font={"/fonts/IBMPlexMono_Regular.json"}
                    lineHeight={0.6}
                >
                    CREATIVE{`\n`}
                    DEVELOPER
                </Text3D>
            </Center> */}

            {/* WORK */}
            <Center position={[0, 3.2, 0]} scale={[1, 1, 0.8]}>
                <Text3D
                    
                    font={"/fonts/IBMPlexMono_Regular.json"}
                    lineHeight={0.6}
                >
                    WORK
                    {/* <meshBasicMaterial color={"white"}></meshBasicMaterial> */}
                    <meshNormalMaterial  />
                </Text3D>
            </Center>
        </group>
    );
}

export default MainScene;
