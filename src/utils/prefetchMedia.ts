import { projects, type Media, type Project } from "../data/content";
import { imageSrcSet, toPosterSrc } from "./mediaSrc";

const started = new Map<string, Promise<void>>();

// Load the same file the viewer will ask for, so it comes straight from the cache
function warm(media: Media, priority: "high" | "low"): Promise<void> {
    if (media.type === "model") return Promise.resolve();
    const existing = started.get(media.src);
    if (existing) return existing;

    const img = new Image();
    img.fetchPriority = priority;
    if (media.type === "image") {
        img.sizes = "100vw"; // same srcset + sizes as MediaItem → the browser picks the same file
        img.srcset = imageSrcSet(media.src);
    }
    const done = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
    });
    img.src = media.type === "image" ? media.src : toPosterSrc(media.src);

    started.set(media.src, done);
    return done;
}

const firstSlide = (project: Project): Media[] => {
    const slide = project.media[0];
    if (!slide) return [];
    return slide.type === "single" ? [slide.media] : slide.items;
};

export const prefetchProject = (project: Project, priority: "high" | "low" = "high") =>
    Promise.all(firstSlide(project).map((m) => warm(m, priority)));

let backgroundStarted = false;

// One project at a time, low priority, so it never competes with what's on screen
export async function prefetchAllProjects() {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (backgroundStarted || saveData) return;
    backgroundStarted = true;

    for (const project of projects) {
        await new Promise((r) => setTimeout(r, 150));
        await prefetchProject(project, "low");
    }
}