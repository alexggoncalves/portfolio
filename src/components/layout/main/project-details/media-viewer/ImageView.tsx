import { Container, Image } from "@react-three/uikit";

import { useEffect, useMemo } from "react";
import { SRGBColorSpace, Texture } from "three";
import { useFrame } from "@react-three/fiber";
import type { ImageRecord } from "../../../../app/assets/assetLoaders";

function ImageView({ asset }: { asset: ImageRecord }) {
    // Create image texture
    const texture = useMemo(() => {
        if (!asset.element) return null;

        const t = new Texture(asset.element);
        t.colorSpace = SRGBColorSpace;
        return t;
    }, [asset.element]);

    // Dispose of texture on unmount or reload
    useEffect(() => {
        return () => {
            texture?.dispose();
        };
    }, [texture]);

    useFrame(() => {
        if (texture) texture.needsUpdate = true;
    });

    if (!texture) return null;

    return (
        <Container width="100%" height="100%" positionType="relative">
            <Image
                positionType="absolute"
                inset={0}
                src={texture}
                objectFit="cover"
                keepAspectRatio={true}
            />
        </Container>
    );
}

export default ImageView;
