import { useEffect, useState } from "react";
import "./StarrySky.scss";

type StarrySkyProps = {
    /** Base tile size in CSS px */
    tileSize?: number;
    /** Total stars per base tile (split across groups) */
    starsPerTile?: number;
    className?: string;
};

// Star sprite using the same math as the old shader (core + soft cross rays)
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
            const core = 1 - t * t * (3 - 2 * t); // smoothstep(0.35, 0.0, d)
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

type Star = { x: number; y: number; s: number; a: number; k: [number, number] };

function makeStars(size: number, count: number): Star[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * size,
        y: Math.random() * size,
        s: 5 + Math.pow(Math.random(), 4) * 16,
        a: 0.6 + Math.random() * 0.4,
        // size multiplier in frame A and frame B: each star shrinks/grows by its own amount
        k: [0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4],
    }));
}

function renderTile(stars: Star[], size: number, dpr: number, frame: 0 | 1): Promise<string> {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "lighter";

    for (const st of stars) {
        const s = st.s * st.k[frame];
        const sprite = getSprite(Math.max(2, Math.round(s * dpr)));
        ctx.globalAlpha = st.a;
        // Wrapped copies so the tile repeats seamlessly
        for (const dx of [-size, 0, size])
            for (const dy of [-size, 0, size])
                ctx.drawImage(sprite, st.x + dx - s / 2, st.y + dy - s / 2, s, s);
    }

    return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png")
    );
}

// Each group has its own tile size (hides repetition) and its own rhythm
const GROUPS = [
    { scale: 1, duration: 2.8, delay: 0 },
    { scale: 0.83, duration: 3.7, delay: -1.2 },
    { scale: 0.71, duration: 4.9, delay: -2.5 },
];

type Layer = { url: string; size: number; frame: 0 | 1; duration: number; delay: number };

const StarrySky = ({ tileSize = 512, starsPerTile = 80, className = "" }: StarrySkyProps) => {
    const [layers, setLayers] = useState<Layer[]>([]);

    useEffect(() => {
        let cancelled = false;
        let created: string[] = [];
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const perGroup = starsPerTile / GROUPS.length;

        Promise.all(
            GROUPS.flatMap(({ scale, duration, delay }) => {
                const size = Math.round(tileSize * scale);
                const stars = makeStars(size, Math.round(perGroup * scale * scale));
                return ([0, 1] as const).map(async (frame) => ({
                    url: await renderTile(stars, size, dpr, frame),
                    size, frame, duration, delay,
                }));
            })
        ).then((result) => {
            created = result.map((l) => l.url);
            if (cancelled) created.forEach(URL.revokeObjectURL);
            else setLayers(result);
        });

        return () => {
            cancelled = true;
            created.forEach(URL.revokeObjectURL);
        };
    }, [tileSize, starsPerTile]);

    return (
        <div className={`starry-sky ${className}`} aria-hidden="true">
            {layers.map((l) => (
                <div
                    key={l.url}
                    className={`starry-sky__layer${l.frame ? " starry-sky__layer--b" : ""}`}
                    style={{
                        backgroundImage: `url(${l.url})`,
                        backgroundSize: `${l.size}px ${l.size}px`,
                        animationDuration: `${l.duration}s`,
                        animationDelay: `${l.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default StarrySky;