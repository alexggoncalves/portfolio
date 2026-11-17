import { useEffect, useState } from "react";

type StarrySkyProps = {
    /** Tile size in CSS px (bigger hides the repetition better) */
    tileSize?: number;
    /** Stars per tile */
    starCount?: number;
    className?: string;
};

// Star sprite: bright core + soft cross rays
const spriteCache = new Map<number, HTMLCanvasElement>();
function getSprite(px: number) {
    const cached = spriteCache.get(px);
    if (cached) return cached;

    const c = document.createElement("canvas");
    c.width = c.height = px;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(px, px);

    for (let y = 0; y < px; y++) {
        for (let x = 0; x < px; x++) {
            const u = ((x + 0.5) / px) * 2 - 1;
            const v = ((y + 0.5) / px) * 2 - 1;
            const d = Math.hypot(u, v);
            const rays = 0.04 / (Math.abs(u * v) + 0.04);
            const t = Math.min(Math.max(d / 0.35, 0), 1);
            const core = 1 - t * t * (3 - 2 * t);
            const star = Math.max(rays * Math.min(Math.max(1 - d, 0), 1), core);
            const i = (y * px + x) * 4;
            img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
            img.data[i + 3] = Math.min(star, 1) * 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    spriteCache.set(px, c);
    return c;
}

type Star = { x: number; y: number; s: number; a: number };

function makeStars(size: number, count: number): Star[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * size,
        y: Math.random() * size,
        s: (5 + Math.pow(Math.random(), 4) * 16) * (0.6 + Math.random() * 0.4),
        a: 0.6 + Math.random() * 0.4,
    }));
}

function renderTile(stars: Star[], size: number, dpr: number): Promise<string> {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "lighter";

    for (const st of stars) {
        const sprite = getSprite(Math.max(2, Math.round(st.s * dpr)));
        ctx.globalAlpha = st.a;
        // Wrapped copies so the tile repeats seamlessly
        for (const dx of [-size, 0, size])
            for (const dy of [-size, 0, size])
                ctx.drawImage(sprite, st.x + dx - st.s / 2, st.y + dy - st.s / 2, st.s, st.s);
    }

    return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png")
    );
}

const StarrySky = ({ tileSize = 1024, starCount = 320, className = "" }: StarrySkyProps) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let created: string | null = null;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        renderTile(makeStars(tileSize, starCount), tileSize, dpr).then((result) => {
            created = result;
            if (cancelled) URL.revokeObjectURL(result);
            else setUrl(result);
        });

        return () => {
            cancelled = true;
            if (created) URL.revokeObjectURL(created);
        };
    }, [tileSize, starCount]);

    return (
        <div
            className={`starry-sky ${className}`}
            aria-hidden="true"
            style={url ? {
                backgroundImage: `url(${url})`,
                backgroundSize: `${tileSize}px ${tileSize}px`,
            } : undefined}
        />
    );
};

export default StarrySky;