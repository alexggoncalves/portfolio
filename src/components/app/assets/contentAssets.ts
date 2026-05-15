import PROJECTS from "../../../data/projects.json";
import PEOPLE from "../../../data/people.json";
import TAGS from "../../../data/tags.json";
import ICONS from "../../../data/icons.json";

// Layout types
export type ImageAsset = {
    type: "image";
    src: string;
    id?: string;
};

export type VideoAsset = {
    type: "video";
    src: string;
    id?: string;
};

export type ModelAsset = {
    type: "model";
    src: string;
    id?: string;
};

export type Media = ImageAsset | VideoAsset | ModelAsset;

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
    media: Media[];

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

// createAsciiTitles();

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
