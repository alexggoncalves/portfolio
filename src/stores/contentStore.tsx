import { create } from "zustand";

import worksData from "./works.json";
import peopleData from "./people.json";

const defaultAvatar = "/images/default/default_avatar.jpg";
const defaultProjectThumbnail = "";

export type Person = {
    id: string;
    name: string;
    link?: string;
    imageSrc?: string;

    image: CanvasImageSource;
};

export type TeamMember = {
    id: string;
    roles: string[];
};

export type Asset = {
    type: "image" | "video" | "thumbnail";
    src: string;
    alt?: string;
};

export type Work = {
    id: string;
    title: string;
    subtitle: string;
    link?: string;
    git?: string;
    year: string;
    tags: string[];
    description: string;
    tools: string[];
    roles: string[];
    team: TeamMember[];

    assets: Asset[];

    images: CanvasImageSource[];
};

type ContentState = {
    works: Work[];
    people: Person[];
    loaded: boolean;

    loadWork: () => void;
    loadInitialAssets: ()=> void;
    getPersonById: (id: string) => Person | null;
};

const useContentStore = create<ContentState>((set, get) => ({
    works: [],
    people: [],
    loaded: false,

    loadWork: async () => {
        // Get work and people data from json files
        const works = worksData as Work[];
        const people = peopleData as Person[];

        // Preload all work assets
        await Promise.all(
            works.map(async (work: Work) => {
                work.images = [];

                for (const asset of work.assets) {
                    if (asset.type == "image" || asset.type == "thumbnail") {
                        try {
                            // Create image object
                            const img = new Image();

                            // Set image source
                            if (asset.src) {
                                img.src = asset.src;
                            } else {
                                if (asset.type == "thumbnail")
                                    img.src = defaultProjectThumbnail;
                                else return;
                            }

                            img.alt = asset.alt ?? "";

                            // Wait for image to load
                            await img.decode();

                            // Add preloaded image to the works array
                            work.images.push(img);
                        } catch (error) {
                            console.log(`failed to load: ${asset.src}`, error);
                        }
                    } else if (asset.type == "video") {
                    }
                }
            })
        );

        // Preload team avatars
        await Promise.all(
            people.map(async (person: Person) => {
                try {
                    // Create image object
                    const img = new Image();

                    if (person.imageSrc) img.src = person.imageSrc;
                    else img.src = defaultAvatar;

                    img.alt = person.name;

                    // Wait for image to load
                    await img.decode();

                    // Add preloaded image to each person
                    person.image = img;
                } catch (error) {
                    console.log(`failed to load: ${person.name} avatar`, error);
                }
            })
        );

        console.log("all loaded");

        set({
            works,
            people,
            loaded: true,
        });
    },

    loadInitialAssets: ()=> {

    },

    getPersonById: (id: string) => {
        const { people } = get();
        const person = people.find((person: Person) => person.id === id);
        return person || null;
    },
}));

export default useContentStore;
