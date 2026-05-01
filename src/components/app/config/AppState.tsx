export type NavigationSource = "home" | "projects" | "contacts" | "outside";
export type Device = "mobile" | "tablet" | "desktop";
console.log("AppState module loaded");
export class AppState {

    static device: Device = "desktop";

    static navigationSource: NavigationSource = "outside";
    static pageHeight: number = 0;

    static pageScrolls: Record<string, number> = {};

    static setDevice(device: Device) {
        this.device = device;
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
