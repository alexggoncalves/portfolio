// JS Stick Letters  https://patorjk.com/software/taag/#p=display&f=JS+Stick+Letters&t=Work&x=none&v=4&h=4&w=80&we=false

import { createASCIITitle } from "./asciiFonts";
import { people, projects } from "./contentAssets";

// ASCII SHADER CHARACTER BRIGHTNESS
export const brightnessMap = new Map<string, number>();

export function createBrightnessMap(asciiSequence: string) {
    const asciiArray = asciiSequence.split("");

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / asciiArray.length + 0.002; //  Offset brightness to avoid rounding to wrong value

        brightnessMap.set(char, mappedBrightness);
    });
}

export function getBrightnessFromChar(char: string): number {
    const brightness = brightnessMap.get(char);
    if (brightness !== undefined) return brightness;
    return 0;
}

// ASCII BLOCK ATLAS

export const asciiBlockBitmaps = new Map<string, ImageBitmap>();

export function getAsciiBitmap(id: string) {
    const bitmap = asciiBlockBitmaps.get(id);

    if (bitmap) return bitmap;
    else return null;
}

export async function createAsciiBlocks() {
    await createProjectAsciiBlocks();
    await createAsciiTeamNames();
    await createAsciiButtons();
}

const buttons = [
    { text: ["home"], id: "home" },
    { text: ["projects"], id: "projects" },
    { text: ["contacts"], id: "contacts" },
    { text: ["<< Go back"], id: "back" },
    { text: ["undefined"], id: "fallback" },
];

async function createAsciiButtons() {
    for (let i = 0; i < buttons.length; i++) {
        const bitmap = await createBitmapFromAscii(buttons[i].text);
        asciiBlockBitmaps.set(buttons[i].id, bitmap);
    }
}

async function createBitmapFromAscii(ascii: string[]): Promise<ImageBitmap> {
    const height = ascii.length;
    let width = ascii[0].length;

    for (let i = 1; i < ascii.length; i++) {
        if (ascii[i].length > width) width = ascii[i].length;
    }

    const buffer = new Uint8ClampedArray(width * height * 4); //rgba

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const brightness = getBrightnessFromChar(ascii[y][x]) * 255;

            const index = (y * width + x) * 4;
            if (brightness > 0) {
                buffer[index] = 255;
                buffer[index + 1] = 255;
                buffer[index + 2] = 255;
                buffer[index + 3] = brightness;
            } else {
                buffer[index + 3] = 0;
            }
        }
    }

    const imageData = new ImageData(buffer, width, height);

    return await createImageBitmap(imageData);
}

async function createProjectAsciiBlocks() {
    // Create project blocks
    for (let i = 0; i < projects.length; i++) {
        // Title
        const asciiTitle = createASCIITitle(projects[i].title);
        const titleBitmap = await createBitmapFromAscii(asciiTitle);
        asciiBlockBitmaps.set(projects[i].id, titleBitmap);

        // Subtitle
        const subtitleBitmap = await createBitmapFromAscii([
            projects[i].subtitle,
        ]);
        asciiBlockBitmaps.set(projects[i].id + "_subtitle", subtitleBitmap);
    }
}

export async function createAsciiTeamNames() {
    for (let i = 0; i < people.length; i++) {
        const name = people[i].name;
        const splitName = name.split(" ");

        const bitmap = await createBitmapFromAscii(splitName);
        asciiBlockBitmaps.set(people[i].id, bitmap);
    }
}
