import { create } from "zustand";

// Layout types
export type HeadingBlock = {
    type: "heading";
    text: string;
};

export type TextBlock = {
    type: "text";
    paragraphs: string[];
};

export type ImageBlock = {
    type: "image";
    src: string;
    alt?: string;
};

export type ImagePairBlock = {
    type: "image-pair";
    images: { src: string; alt?: string }[];
};

export type VideoBlock = {
    type: "video";
    src: string;
    alt?: string;
};

export type LayoutBlock =
    | HeadingBlock
    | TextBlock
    | ImageBlock
    | ImagePairBlock
    | VideoBlock;

// Person types
export type Person = {
    id: string;
    name: string;
    avatarSrc?: string;
    link?: string;

    image: CanvasImageSource;
};

export type TeamMember = { 
    id: string; 
    roles?: string[] 
};

// Tag type
export type Tag = {
    id: string;
    name: string;
    color: string;
};

// Work type
export type Work = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    year: string;
    thumbnailSrc: string;
    link?: string;
    git?: string;
    tools: string[];
    team?: TeamMember[];
    layout: LayoutBlock[];

    thumbnail: CanvasImageSource | void;
    images: CanvasImageSource[];
};

//---------------------------------------------------------------------
// Content Store: Store and manage works, people, and tags
//---------------------------------------------------------------------

type ContentState = {
    works: Work[];
    tags: Tag[];
    people: Person[];

    loaded: boolean;

    getWorkById: (id: string) => Work | null;
    getPersonById: (id: string) => Person | null;
    getTagById: (id: string) => Tag | null;
    getTags: (tags: string[]) => Tag[];

    // loadedImages: Set<string>;
    // loadWork: () => void;
    // loadInitialContent: () => void;
};

const useContentStore = create<ContentState>((_set, get) => ({
    works: [],
    tags: [],
    people: [],

    loaded: false,

    getWorkById: (id: string) => {
        const { works } = get();
        const work = works.find((work: Work) => work.id === id);
        return work || null;
    },
    getPersonById: (id: string) => {
        const { people } = get();
        const person = people.find((person: Person) => person.id === id);
        return person || null;
    },
    getTagById: (id: string) => {
        const { tags } = get();
        const tag = tags.find((tag: Tag) => tag.id === id);
        return tag || null;
    },
    getTags: (tags: string[]): Tag[] => {
        const { getTagById } = get();
        const output = [] as Tag[];

        tags.forEach((id) => {
            const tag = getTagById(id);
            if (tag !== null) output.push(tag);
        });

        return output;
    },

    // // Cache of already-loaded URLs
    // loadedImages: new Set<string>(),

    // loadInitialContent: async () => {
    //     // Get work and people data from json files
    //     const works = worksData as Work[];
    //     const people = peopleData as Person[];

    //     // Preload all work thumbnails
    //       // Preload all work assets
    //     await Promise.all(
    //         works.map(async (work: Work) => {
    //             work.images = [];

    //             for (const asset of work.assets) {
    //                 const src = asset.src;

    //                 if (!src || loadedImages.has(src)) continue; // skip if already loaded

    //                 if (asset.type == "image" || asset.type == "thumbnail") {
    //                     try {
    //                         // Create image object
    //                         const img = await loadImage(src,loadedImages)

    //                         // Add preloaded image to the works array
    //                         work.images.push(img);

    //                         loadedImages.add(src)
    //                         set({ loadedImages: new Set(loadedImages) });
    //                     } catch (error) {
    //                         console.log(`failed to load: ${asset.src}`, error);
    //                     }
    //                 } else if (asset.type == "video") {

    //                 }
    //             }
    //         })
    //     );

    // },

    // loadWork: async () => {
    //     const loadedImages = get().loadedImages;

    //     // Preload all work assets
    //     await Promise.all(
    //         works.map(async (work: Work) => {
    //             work.images = [];

    //             for (const asset of work.assets) {
    //                 const src = asset.src;

    //                 if (!src || loadedImages.has(src)) continue; // skip if already loaded

    //                 if (asset.type == "image" || asset.type == "thumbnail") {
    //                     try {
    //                         // Create image object
    //                         const img = await loadImage(src,loadedImages)

    //                         // Add preloaded image to the works array
    //                         work.images.push(img);

    //                         loadedImages.add(src)
    //                         set({ loadedImages: new Set(loadedImages) });
    //                     } catch (error) {
    //                         console.log(`failed to load: ${asset.src}`, error);
    //                     }
    //                 } else if (asset.type == "video") {

    //                 }
    //             }
    //         })
    //     );

    //     // Preload team avatars
    //     await Promise.all(
    //         people.map(async (person: Person) => {

    //             const src = person.imageSrc ? person.imageSrc : defaultAvatar
    //             // if(loadedImages.has(src)) return;
    //             try {
    //                 // Create image object
    //                 const img = await loadImage(src, loadedImages);
    //                 // Add preloaded image to each person
    //                 person.image = img;
    //             } catch (error) {
    //                 console.log(`failed to load: ${person.name} avatar`, error);
    //             }
    //         })
    //     );

    //     console.log("all loaded");

    //     set({
    //         works,
    //         people,
    //         loaded: true,
    //     });
    // },
}));

// const loadImage = (
//     src: string,
//     loadedImages: Set<string>
// ): Promise<HTMLImageElement> =>
//     new Promise((resolve, reject) => {
//         if (!src) return reject(new Error("Empty image src"));

//         // If image is already loaded, skip network request
//         if (loadedImages.has(src)) {
//             const cachedImg = new Image();
//             cachedImg.src = src;
//             // If already cached by the browser, it should load instantly
//             if (cachedImg.complete && cachedImg.naturalHeight !== 0) {
//                 resolve(cachedImg);
//                 return;
//             }
//         }

//         const img = new Image();
//         img.onload = () => resolve(img);
//         img.onerror = (err) => reject(err);
//         img.src = src;
//     });

export default useContentStore;
