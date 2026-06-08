import PROJECTS from "./projects.json";
import PEOPLE from "./people.json";
import TAGS from "./tags.json";
import ICONS from "./icons.json";

// Layout types
export type ImageAsset = {
    type: "image";
    title?: string;
    alt?: string;
    src: string;
    id?: string;
};

export type VideoAsset = {
    type: "video";
    title?: string;
    src: string;
    id?: string;
};

export type ModelAsset = {
    type: "model";
    title?: string;
    src: string;
    id?: string;
};

export type Media = ImageAsset | VideoAsset | ModelAsset;

export type SingleMediaBlock = {
    type: "single";
    title?: string;
    media: Media;
};

export type GridMediaBlock = {
    type: "grid";
    title?: string;
    columns: 2 | 3 | 4;
    items: Media[];
};

export type MediaBlock = SingleMediaBlock | GridMediaBlock;

// Person types
export type Person = {
    id: string;
    name: string;
    asciiName: number[];
    link?: string;
};

export type TeamMember = {
    id: string;
    roles?: string[];
};

// Work type
export type Project = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    year: string;
    thumbnailSrc: string;
    description: string[];
    link?: string;
    git?: string;
    tools: string[];
    team?: TeamMember[];
    media: MediaBlock[];

    asciiTitle?: number[];
    asciiSubtitle?: number[];
};

// Tag type
export type Tag = {
    id: string;
    name: string;
    color: string;
    textColor: string;
};

// Icon type
export type Icon = {
    id: string;
    src: string;
    aspect: number;
};

export const projects = PROJECTS as Project[];
export const people = PEOPLE as Person[];
export const tags = TAGS as Tag[];
export const icons = ICONS as Icon[];

// Images to Preload
const thumbnailUrls = projects.map((project) => project.thumbnailSrc);
const iconUrls = icons.map((icon) => icon.src);
export const imagesToPreload = [...thumbnailUrls, ...iconUrls];

export function getProjectById(id: string): Project | null {
    const project = projects.find((work) => work.id === id);
    return project || null;
}

export function getPersonById(id: string): Person | null {
    const person = people.find((person) => person.id === id);
    return person || null;
}

export function getTagById(id: string): Tag | null {
    const tag = tags.find((tag) => tag.id === id);
    return tag || null;
}
export function getIconById(id: string): Icon | null {
    const icon = icons.find((icon) => icon.id === id);
    return icon || null;
}

export function getTagsById(tagIds: string[]): Tag[] {
    const output = [] as Tag[];

    for (let i = 0; i < tagIds.length; i++) {
        const tag = getTagById(tagIds[i]);
        if (tag !== null) output.push(tag);
    }

    return output;
}
