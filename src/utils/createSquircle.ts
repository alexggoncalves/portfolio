import { ExtrudeGeometry, Shape, ShapeGeometry } from "three";

export function createSquircleShape(
    width: number,
    height: number,
    radius: number,
) {
    const s = new Shape();

    const x = -width / 2;
    const y = -height / 2;

    s.moveTo(x, y + radius);
    s.lineTo(x, y + height - radius);
    s.quadraticCurveTo(x, y + height, x + radius, y + height);
    s.lineTo(x + width - radius, y + height);
    s.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    s.lineTo(x + width, y + radius);
    s.quadraticCurveTo(x + width, y, x + width - radius, y);
    s.lineTo(x + radius, y);
    s.quadraticCurveTo(x, y, x, y + radius);

    return s;
}


export function drawSquirclePath(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    r: number,
) {
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.lineTo(0, h - r);
    ctx.quadraticCurveTo(0, h, r, h);
    ctx.lineTo(w - r, h);
    ctx.quadraticCurveTo(w, h, w, h - r);
    ctx.lineTo(w, r);
    ctx.quadraticCurveTo(w, 0, w - r, 0);
    ctx.lineTo(r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.closePath();
}


export function createSquircleGeometry(
    width: number,
    height: number,
    radius: number,
    depth?: number,
) {
    const squircleShape = createSquircleShape(width, height, radius);

    if (!depth) {
        const geom = new ShapeGeometry(squircleShape);
        const pos = geom.attributes.position;
        const uv = geom.attributes.uv;
        const halfW = width / 2;
        const halfH = height / 2;
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            uv.setXY(i, (px + halfW) / width, (py + halfH) / height);
        }
        uv.needsUpdate = true;

        geom.computeBoundingBox();
        geom.computeBoundingSphere();

        return geom;
    } else {
        const geom = new ExtrudeGeometry(squircleShape, {
            depth: depth,
            bevelEnabled: false,
        });

        geom.computeBoundingBox();
        geom.computeBoundingSphere();
        return geom;
    }
}
