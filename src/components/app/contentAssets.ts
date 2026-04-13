import PROJECTS from "./../../data/projects.json";
import PEOPLE from "./../../data/people.json";
import TAGS from "./../../data/tags.json";
import ICONS from "./../../data/icons.json";

// Layout types
export type HeadingBlock = {
    type: "heading";
    text: string;
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

export type TextBlock = {
    type: "text";
    paragraphs: string[];
};

export type MediaBlock =
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
    description: TextBlock;
    link?: string;
    git?: string;
    tools: string[];
    team?: TeamMember[];
    media: MediaBlock[];
};

// Tag type
export type Tag = {
    id: string;
    name: string;
    color: string;
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

    tagIds.forEach((id) => {
        const tag = getTagById(id);
        if (tag !== null) output.push(tag);
    });

    return output;
}
