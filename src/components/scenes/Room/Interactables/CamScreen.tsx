import { Text, useTexture } from "@react-three/drei"
import { SRGBColorSpace, type Mesh } from "three"

import { type Photo } from "../../../../data/content"
import { useMemo } from "react"

type PhotoCameraScreenProps = {
    node: Mesh
    photos: Photo[]
    index: number
}

const SCREEN_ASPECT = 3 / 2
const TEXT_FONT = "/fonts/ShareTechMono-Regular.ttf"
const TEXT_COLOR = "#ffffff"
const TEXT_OFFSET = 0.0005
const TEXT_SIZE = 0.055
const PADDING = 0.04

const CamScreen = ({ node, photos, index }: PhotoCameraScreenProps) => {
    const photoTextures = useTexture(photos.map((p) => p.url));

    useMemo(() => {
        photoTextures.forEach((tex) => {
            tex.flipY = false
            tex.colorSpace = SRGBColorSpace

            const img = tex.image as HTMLImageElement
            const aspect = img.width / img.height
            if (aspect > SCREEN_ASPECT) tex.repeat.set(SCREEN_ASPECT / aspect, 1)
            else tex.repeat.set(1, aspect / SCREEN_ASPECT)
            tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2)
        })
    }, [photos])

    // Screen bounds in its local space
    const bounds = useMemo(() => {
        node.geometry.computeBoundingBox()
        const box = node.geometry.boundingBox!
        const height = box.max.y - box.min.y
        return {
            left: box.max.x,
            right: box.min.x,
            top: box.max.y,
            bottom: box.min.y,
            front: box.min.z - TEXT_OFFSET,
            fontSize: height * TEXT_SIZE,
            padding: height * PADDING,
        }
    }, [screen])

    return (
        <group position={node.position} rotation={node.rotation}>
            {/* Screen */}
            <mesh geometry={node.geometry}>
                <meshStandardMaterial
                    color="black"
                    emissive="white"
                    emissiveMap={photoTextures[index]}
                    emissiveIntensity={1.4}
                    roughness={1}
                    toneMapped={false}
                />
            </mesh>

            {/* Index indicator */}
            <Text
                position={[bounds.left - bounds.padding, bounds.bottom + bounds.padding, bounds.front]}
                rotation={[0, Math.PI, 0]}
                font={TEXT_FONT}
                fontSize={bounds.fontSize}
                color={TEXT_COLOR}
                anchorX="left"
                anchorY="bottom-baseline"
            >
                {`${index + 1}/${photos.length}`}
            </Text>


            {/* Date */}
            <Text
                position={[bounds.right + bounds.padding, bounds.bottom + bounds.padding, bounds.front]}
                rotation={[0, Math.PI, 0]}
                font={TEXT_FONT}
                fontSize={bounds.fontSize}
                color={TEXT_COLOR}
                anchorX="right"
                anchorY="bottom-baseline"
            >
                {photos[index].date}
            </Text>
        </group>
    )
}

export default CamScreen;