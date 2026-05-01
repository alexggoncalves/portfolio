// import type { Color } from "three";
// import Color4 from "three/src/renderers/common/Color4.js";
// import { Element } from "../core/Element";
// import { getBrightnessFromChar } from "../../assets/asciiBlocks";

// //-----------------------------------------
// // Ascii Line Class
// //-----------------------------------------

// export class AsciiLine extends Element {
//     // Point A
//     xA: number;
//     yA: number;

//     // Point B
//     xB: number;
//     yB: number;

//     char: string; // character for the line
//     strokeWidth: number;

//     constructor(
//         char: string,
//         xA: number,
//         yA: number,
//         xB: number,
//         yB: number,
//         strokeWidth: number,
//         color: string,
//         horizontalAlign?: "left" | "center" | "right",
//         verticalAlign?: "top" | "middle" | "bottom",
//     ) {
//         super(
//             xA,
//             yA,
//             "grid",
//             color,
//             horizontalAlign,
//             verticalAlign,
//         );

//         this.char = char;
//         this.setSize(this.char);
//         // this.applyAlignment();

//         this.strokeWidth = strokeWidth;
//         this.xA = xA;
//         this.yA = yA;
//         this.xB = xB;
//         this.yB = yB;
//     }

//     draw(
//         asciiCtx: CanvasRenderingContext2D,
//         _bgCtx: CanvasRenderingContext2D,
//     ): void {
//         const brightness = getBrightnessFromChar(this.char) || 0 ;

//         this.drawASCIILine(
//             this.xA,
//             this.yA,
//             this.xB,
//             this.yB,
//             this.strokeWidth,
//             this.color.r,
//             this.color.g,
//             this.color.b,
//             brightness,
//             asciiCtx,
//         );
//     }

//     update(): void {}

//     fadeIn(): void {}

//     fadeOut(): void {}
// }
