import PROJECTS from "../../data/projects.json";
import PEOPLE from "../../data/people.json";
import TAGS from "../../data/tags.json";
import ICONS from "../../data/icons.json";
import { createASCIITitle } from "./asciiFonts";

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
    asciiName: number[];
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

    asciiTitle?: number[];
    asciiSubtitle?: number[];
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

export const brightnessMap = new Map<string, number>();

export async function createAsciiTitleArrays() {
    for (let i = 0; i < projects.length; i++) {
        projects[i].asciiTitle = [];

        const title = createASCIITitle(projects[i].title);
        for (let j = 0; j < title.length; j++) {
            const charBrightness = getBrightnessFromChar(title[j]);
            projects[i].asciiTitle?.push(charBrightness);
        }

        const subtitle = projects[i].subtitle;
        for (let j = 0; j < subtitle.length; j++) {
            const charBrightness = getBrightnessFromChar(subtitle[j]);
            projects[i].asciiSubtitle?.push(charBrightness);
        }
    }
}

export async function createAsciiTeamNames() {
    for (let i = 0; i < people.length; i++) {
        const name = people[i].name;
        for (let j = 0; j < name.length; j++) {
            const charBrightness = getBrightnessFromChar(name[j]);
            people[i].asciiName?.push(charBrightness);
        }
    }
}

export function getBrightnessFromChar(char: string): number {
    const brightness = brightnessMap.get(char);
    if (brightness) return brightness;
    else return 0;
}

export function createBrightnessMap(asciiSequence: string) {
    const asciiArray = asciiSequence.split("");

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / asciiArray.length + 0.002; //  Offset brightness to avoid rounding to wrong value

        brightnessMap.set(char, mappedBrightness);
    });

    console.log(brightnessMap);
}

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

    tagIds.forEach((id) => {
        const tag = getTagById(id);
        if (tag !== null) output.push(tag);
    });

    return output;
}
