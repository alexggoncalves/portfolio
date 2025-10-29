import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { Mesh } from "three";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type RotatingModelProps = {
    children: React.ReactNode;
    xSpeed?: number;
    ySpeed?: number;
    position?: [number, number, number];
};

export const RotatingModel = ({ children , xSpeed = 0, ySpeed = 0, position =[0,0,0]}: RotatingModelProps) => {
    const ref = useRef<Mesh>(null!);

    useFrame((_state, delta) => {
        ref.current.rotation.x += delta * xSpeed; // rotate on X
        ref.current.rotation.y += delta * ySpeed; // rotate on Y
    });

    return <group position={position} ref={ref}>{children}</group>;
}

type OBJModelProps = { path: string , position?: [number, number, number], scale?: number, rotation?: [number, number, number]};    

export const OBJModel = ({ path, position, scale, rotation }: OBJModelProps) => {
    const materials = useLoader(MTLLoader, `${path}/materials.mtl`);
    const object = useLoader(OBJLoader, `${path}/model.obj`, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    object.traverse((child) => {
        if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
    });

    return <primitive object={object} scale={scale} position={position} rotation={rotation}/>;
};
