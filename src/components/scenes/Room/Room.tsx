import { useGLTF, useTexture } from "@react-three/drei"
import { useEffect } from "react"
import { Object3D, SRGBColorSpace, type Mesh } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import Moon from "./Moon"
import Ocean from "./Ocean"
import VinylStand from "./VinylStand"
import PhotoCamera from "./PhotoCamera"

type RoomGLTF = GLTF & {
    nodes: {
        Shell: Mesh
        Plants: Mesh
        Art: Mesh
        Bookshelf: Mesh
        PhysicalMedia: Mesh
        Furniture: Mesh
        Props: Mesh

        // Dynamic
        CandleFire1: Mesh
        CandleFire2: Mesh
        FairyLights: Mesh
        MonitorScreen: Mesh
        NintendoScreens: Mesh

        // Helpers
        Moon_Target: Object3D
        Cam_Center: Object3D
    }
}

const textureNames = ['shell', 'plants', 'art', 'bookshelf', 'physical_media', 'furniture', 'props', 'nintendo_screens']

const Room = () => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as RoomGLTF

    // Load textures
    const textures = useTexture(Object.fromEntries(textureNames.map(n => [n, `/room/textures/${n}.webp`])))
    Object.values(textures).forEach(t => { t.flipY = false; t.colorSpace = SRGBColorSpace })

    useEffect(() => {
        console.log(nodes);
    }, [nodes])

    return <>
        {/* <primitive object={scene} /> */}
        <mesh geometry={nodes.Shell.geometry}>
            <meshBasicMaterial map={textures.shell} />
        </mesh>
        <mesh geometry={nodes.Plants.geometry}>
            <meshBasicMaterial map={textures.plants} />
        </mesh>
        <mesh geometry={nodes.Art.geometry}>
            <meshBasicMaterial map={textures.art} />
        </mesh>
        <mesh geometry={nodes.Bookshelf.geometry}>
            <meshBasicMaterial map={textures.bookshelf} />
        </mesh>
        <mesh geometry={nodes.PhysicalMedia.geometry}>
            <meshBasicMaterial map={textures.physical_media} />
        </mesh>
        <mesh geometry={nodes.Furniture.geometry}>
            <meshBasicMaterial map={textures.furniture} />
        </mesh>
        <mesh geometry={nodes.Props.geometry}>
            <meshBasicMaterial map={textures.props} />
        </mesh>
        


        {/* LIGHTS */}
        <mesh geometry={nodes.CandleFire1.geometry} position={nodes.CandleFire1.position} rotation={nodes.CandleFire1.rotation}>
            <meshBasicMaterial color={[5, 3, 1.25]} toneMapped={false} />
        </mesh>
        <mesh geometry={nodes.CandleFire2.geometry} position={nodes.CandleFire2.position} rotation={nodes.CandleFire2.rotation}>
            <meshBasicMaterial color={[5, 3, 1.25]} toneMapped={false} />
        </mesh>
        <mesh geometry={nodes.FairyLights.geometry} position={nodes.FairyLights.position} rotation={nodes.FairyLights.rotation}>
            <meshBasicMaterial color={[4, 4, 4]} toneMapped={false} />
        </mesh>


        {/* Screens */}
        <mesh geometry={nodes.MonitorScreen.geometry} position={nodes.MonitorScreen.position} rotation={nodes.MonitorScreen.rotation}>
            <meshBasicMaterial color={[1.3, 1.3, 1.3]} toneMapped={false} />
        </mesh>
        <mesh geometry={nodes.NintendoScreens.geometry} position={nodes.NintendoScreens.position} rotation={nodes.NintendoScreens.rotation}>
            <meshBasicMaterial map={textures.nintendo_screens} color={[1.2, 1.2, 1.2]} toneMapped={false} />
        </mesh>


        <PhotoCamera/>
        <VinylStand/>
        <Moon from={nodes.Cam_Center.position} target={nodes.Moon_Target.position} />
        <Ocean moonDir={nodes.Moon_Target.position.clone().sub(nodes.Cam_Center.position).normalize()} level={-2} tilt={0.04} size={160} />
    </>
}
export default Room;

useGLTF.preload('/room/room.glb')
useTexture.preload([...textureNames.map(n => `/room/textures/${n}.webp`), '/room/textures/moon.webp'])