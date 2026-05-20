import { Container, Image, Text } from "@react-three/uikit";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { getTagById } from "../../../app/assets/contentAssets";
import { drawSquirclePath } from "../../../../utils/createSquircle";

function Tag({ tagId }: { tagId: string }) {
    const tag = useMemo(() => getTagById(tagId), [tagId]);

    const containerRef = useRef<any>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        const c = containerRef.current;
        if (!c) return;
        return c.size.subscribe((v: [number, number] | undefined) => {
            if (!v) return;
            const [w, h] = v;
            setSize((prev) =>
                prev && prev.w === w && prev.h === h ? prev : { w, h },
            );
        });
    }, []);

    const texture = useMemo(() => {
        if (!size || !tag) return null;

        const dpr = window.devicePixelRatio || 1;
        const w = Math.ceil(size.w * dpr);
        const h = Math.ceil(size.h * dpr);
        const r = h / 2;

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = tag.color;
        drawSquirclePath(ctx, w, h, r);
        ctx.fill();

        const tex = new CanvasTexture(canvas);
        tex.colorSpace = SRGBColorSpace;
        tex.needsUpdate = true;
        return tex;
    }, [size?.w, size?.h, tag?.color]);

    useEffect(() => () => texture?.dispose(), [texture]);

    if (!tag) return null;

    return (
        <Container
            ref={containerRef}
            paddingX={12}
            paddingY={3}
            flexShrink={0}
        >
            {texture && (
                <Image
                    src={texture}
                    positionType={"absolute"}
                    inset={0}
                    objectFit={"fill"}
                />
            )}

            <Text fontSize={14} color={tag.textColor} fontWeight={500}>
                {tag.name.toUpperCase()}
            </Text>
        </Container>
    );
}

export default Tag;