import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Layer } from "../core/Layer";
import { AsciiButton } from "../ascii/AsciiButton";
import type { InteractiveElement } from "../core/InteractiveElement";
import { ScrollBar } from "./ScrollBar";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Navigation extends Layer {
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4(0, 0.4, 0.4, 0);

    goTo: (path: string) => void;

    hoveredElement: InteractiveElement | null = null;

    contactsButton: AsciiButton | null = null;
    projectsButton: AsciiButton | null = null;
    homeButton: AsciiButton | null = null;
    scrollBar: ScrollBar | null = null;

    hMargin: number = 5;
    vMargin: number = 3;
    buttonGap: number = 3;

    constructor(goTo: (path: string) => void) {
        super("navigation", []);
        this.goTo = goTo;
    }

    init(isMobile?: boolean): void {
        let x = -5;
        let y = 3;

        this.contactsButton = new AsciiButton(
            "contacts",
            () => this.goTo("/contacts"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
        );
        this.addElement(this.contactsButton);

        x -= this.contactsButton.gridW + this.buttonGap;

        this.projectsButton = new AsciiButton(
            "projects",
            () => this.goTo("/projects"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
            undefined,
        );
        this.addElement(this.projectsButton);

        x -= this.projectsButton.gridW + 3;

        this.homeButton = new AsciiButton(
            "home",
            () => this.goTo("/"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
            undefined,
        );
        this.addElement(this.homeButton);

        this.scrollBar = new ScrollBar(
            -40,
            y,
            15,
            AsciiRenderConfig.canvasSize.y / 2,
            10,
        );
        this.addElement(this.scrollBar);
    }

    onResize(): void {
        console.log("resize");
        this.contactsButton?.applyAlignment();
        this.projectsButton?.applyAlignment();
        this.homeButton?.applyAlignment();
        this.scrollBar?.applyAlignment();
    }

    updateNavMouseState(mouseX: number, mouseY: number): void {
        this.hoveredElement = null;

        for (const element of this.interactiveElements) {
            element.isMouseOver = false;

            if (element.contains(mouseX, mouseY)) {
                this.hoveredElement = element;
                element.isMouseOver = true;
                break;
            }
        }
    }

    updateScrollBar(scrollOffset?: number, pageHeight?: number) {
        if (scrollOffset === undefined || pageHeight === undefined) return;
        this.scrollBar?.updatePageHeight(pageHeight);
        this.scrollBar?.updateScrollOffset(scrollOffset);
    }

    destroy(): void {
        this.contactsButton = null;
        this.projectsButton = null;
        this.homeButton = null;
        this.scrollBar = null;
        super.destroy();
    }
}
