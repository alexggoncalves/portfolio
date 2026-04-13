import { getProjectById, projects } from "./contentAssets";
import { icons } from "./contentAssets";

import { loadImage, loadVideo } from "./assetRecords";

export type AssetPriority = "critical" | "lazy" | "idle";

export type AssetRequest = {
    src: string;
    type: "image" | "video" ;
    priority: AssetPriority;
};

// Load all global assets (thumbnails, icons, ...)
export function buildGlobalAssets(): AssetRequest[] {
    const thumbnailsRequests = projects.map((p) => ({
        src: p.thumbnailSrc,
        type: "image",
    }));

    const iconRequests = icons.map((i) => ({
        src: i.src,
        type: "image",
    }));

    return [...thumbnailsRequests, ...iconRequests] as AssetRequest[];
}

export function buildPageAssets(projectId: string): AssetRequest[] {
    const project = getProjectById(projectId);

    const requests = project?.media.map((asset) => {
        if (asset.type == "image") {
            return {
                src: asset.src,
                type: "image",
            };
        } else if (asset.type == "video") {
            return {
                src: asset.src,
                type: "video",
            };
        } else return;
    });

    return requests as AssetRequest[];
}

export async function requestAssets(requests: AssetRequest[]) {
    const tasks = requests.map((req) => {
        if (req.type === "image") {
            return loadImage(req.src);
        }

        if (req.type === "video") {
            return loadVideo(req.src);
        }

        return Promise.resolve(null);
    });

    await Promise.all(tasks);
}
