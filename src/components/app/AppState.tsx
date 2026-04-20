import { Texture } from "three";

export type NavigationSource = "home" | "projects" | "contacts" | "outside";

export class AppState {
    static backgroundTexture?: Texture | null;
    static uiTexture?: Texture | null;

    static navigationSource: NavigationSource = "outside";
    static pageHeight: number = 0;

    static pageScrolls: Record<string, number> = {};

    static setBackground(texture: Texture) {
        this.backgroundTexture = texture;
    }

    static setUI(texture: Texture) {
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
