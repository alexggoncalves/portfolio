import { create } from "zustand";

export type Page = "home" | "projects" | "contact";

type RouteStoreState = {
    page: Page;
    projectId: string | null;
    setRoute: (page: Page, projectId: string | null) => void;
};

const useRouteStore = create<RouteStoreState>((set) => ({
    page: "home",
    projectId: null,
    setRoute: (page, projectId) => set(() => ({ page, projectId })),
}));

export default useRouteStore;
