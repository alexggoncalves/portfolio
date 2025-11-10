import { create } from "zustand";

import worksData from "./works.json";

export type Asset = {
    type: "image" | "video";
    src: string;
    alt?: string;
};

export type TeamMember = {
    name: string;
    roles: string[];
    link?: string;
};

export type Work = {
    id: string;
    title: string;
    subtitle: string;
    link?: string;
    git?:string;
    year: string;
    tags: string[];
    description: string;
    tools: string[];
    roles: string[];
    team: TeamMember[];

    assets: Asset[];
    

    images: CanvasImageSource[];
};

type WorkState = {
    works: Work[];
    currentWork: string | null;
    loaded: boolean;

    loadWork: () => void;
    setCurrentWork: (work: string) => void;
};

const useWorkStore = create<WorkState>((set, _get) => ({
    works: [],
    currentWork: null,
    loaded: false,

    loadWork: async () => {
        // Get work data from json file
        const works = worksData as Work[];

        // Preload all assets
        await Promise.all(
            works.map(async (work: Work) => {
                work.images = [];

                for (const asset of work.assets) {
                    if (asset.type == "image") {
                        try {
                            // Create image object
                            const img = new Image();
                            img.src = asset.src;
                            img.alt = asset.alt ?? "";

                            // Wait for image to load
                            await img.decode(); 
                            
                            // Add preloaded image to the works array
                            work.images.push(img); 
                            
                        } catch (error) {
                            console.log(`failed to load: ${asset.src}`, error);
                        }
                    }
                }
                set({ loaded: true });
            })
        );

        set({
            works,
        });
    },

    // Doesnt do anything
    setCurrentWork: (_work: string) => {
        set({ currentWork: null });
    },
}));

export default useWorkStore;
