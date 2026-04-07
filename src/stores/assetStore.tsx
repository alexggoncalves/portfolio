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

// Icon type
export type Icon = {
    id: string;
    src: string;
    image: CanvasImageSource | void;
};

//---------------------------------------------------------------------
// Content Store: Store and manage works, people, and tags
//---------------------------------------------------------------------

type AssetState = {
    works: Work[];
    tags: Tag[];
    people: Person[];
    icons: Icon[];

    loaded: boolean;

    getWorkById: (id: string) => Work | null;
    getPersonById: (id: string) => Person | null;
    getTagById: (id: string) => Tag | null;
    getTags: (tags: string[]) => Tag[];
    getIconById: (id: string) => Icon | null;
};

const useAssetStore = create<AssetState>((_set, get) => ({
    works: [],
    tags: [],
    people: [],
    icons: [],

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
    getIconById: (id: string) => {
        const { icons } = get();
        const icon = icons.find((icon: Icon) => icon.id === id);
        return icon || null;
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

}))

export default useAssetStore;
