import { CanvasTexture } from "three";

export type NavigationSource = "home" | "projects" | "contacts" | "outside";

export class AppState {
    static backgroundTexture?: CanvasTexture | null;
    static uiTexture?: CanvasTexture | null;

    static navigationSource: NavigationSource = "outside";
    static pageHeight: number = 0;

    static pageScrolls: Record<string, number> = {};

    static setBackground(texture: CanvasTexture) {
        this.backgroundTexture = texture;
    }

    static setUI(texture: CanvasTexture) {
        this.uiTexture = texture;
    }

    static setNavigationSource(source: NavigationSource) {
        this.navigationSource = source;
    }

    static setCurrentPageHeight(height: number) {
        this.pageHeight = height;
    }

    static recordScroll(pageName: string, scroll: number) {
        this.pageScrolls = { ...this.pageScrolls, [pageName]: scroll };
    }
}
