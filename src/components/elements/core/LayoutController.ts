// import { Layer } from "./Layer";
// import { MathUtils } from "three";
// import { clamp } from "three/src/math/MathUtils.js";
// import type { InteractiveElement } from "./InteractiveElement";
// import { ProjectsRow } from "../../pages/homepage/ProjectsRow";
// import { RenderConfig } from "../../render/RenderConfig";
// import { AppState } from "../../app/AppState";
// import { DraggableLayer } from "./DraggableLayer";

// //----------------------------------
// // PAGE CLASS
// //----------------------------------

// export class LayoutController {
//     private nav: Navigation | null = null;
//     private currentPage: Page | null = null;
//     private nextPage: Page | null = null;

//     private canvasSize = { width: 0, height: 0 }
//     private distortedPointer = new Vector2();

//     // Callbacks
//     onFadeOutComplete?: () => void;
//     goTo: (path: string) => void;

//     // Flags
//     isMobile: boolean;


//     constructor(name: string, isMobile: boolean, goTo: (path: string) => void) {
//         this.name = name;
//         this.goTo = goTo;
//         this.isMobile = isMobile;
//     }

//     setPages(current: Page | null, next: Page | null) {
//         this.currentPage = current;
//         this.nextPage = next;
//     }

//     setCanvasSize(width: number, height: number) {
//         this.canvasSize.width = width;
//         this.canvasSize.height = height;

//         this.nav?.onResize();
//         this.currentPage?.onResize();
//         this.nextPage?.onResize();
//     }

//     update(delta: number, input: InputState) {
//         this.updatePointer(input.pointer);
//         this.updatePages(delta, input);
//         this.updateMouseTargets();
//         this.updateCursor();
//     }

//     draw(targets: RenderTargets) {
//         const { asciiCtx, bgCtx, clear } = targets;

//         // Clear
//         clear(asciiCtx, bgCtx, RenderConfig.bgColor);

//         // Draw pages
//         this.currentPage?.draw(asciiCtx, bgCtx);
//         this.nextPage?.draw(asciiCtx, bgCtx);

//         // Draw nav (fixed layer)
//         this.nav?.draw(asciiCtx, bgCtx, 1);
//     }
// }
