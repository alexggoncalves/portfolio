import type Color4 from "three/src/renderers/common/Color4.js";

function getColorString(color: Color4, opacity: number): string {
    return `rgba(${color.r * 255 * opacity},
        ${color.g * 255 * opacity},
        ${color.b * 255 * opacity},
        ${color.a * opacity})`;
}

export default getColorString;