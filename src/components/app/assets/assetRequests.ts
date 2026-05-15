import { getProjectById, projects } from "./contentAssets";
import { icons } from "./contentAssets";

import {
    loadImage,
    loadModel,
    loadVideo,
    type AssetRecord,
} from "./assetLoaders";

export type AssetRequest = {
    id: string;
    src: string;
    type: "image" | "video" | "model" | "icon" | "atlas";
};

// Build the initial load asset requests array
export function buildGlobalAssetRequests(): AssetRequest[] {
    // * Thumbnail requests *
    const thumbnailsRequests: AssetRequest[] = projects.map((p) => ({
        id: p.id + "_thumbnail",
        src: p.thumbnailSrc,
        type: "image",
    }));

    // * Icon requests *
    const iconRequests: AssetRequest[] = icons.map((icon) => ({
        id: icon.id,
        src: icon.src,
        type: "icon",
    }));

    // * Global models requests
    //! IMPORT GLOBAL 3D MODELS HERE

    return [...thumbnailsRequests, ...iconRequests];
}

export function buildProjectAssets(projectId: string): AssetRequest[] {
    const project = getProjectById(projectId);

    let requests: AssetRequest[] = [];

    project?.media.forEach((asset, index) => {
        if (asset.type == "image") {
            requests.push({
                id: projectId + "_media_" + index,
                src: asset.src,
                type: "image",
            });
        } else if (asset.type == "video") {
            requests.push({
                id: projectId + "_media_" + index,
                src: asset.src,
                type: "video",
            });
        } else if (asset.type == "model") {
            requests.push({
                id: projectId + "_media_" + index,
                src: asset.src,
                type: "model",
            });
        }
    });

    return requests;
}

export async function requestAssets(
    requests: AssetRequest[],
    onProgress?: () => void,
) {
    const tasks = requests.map((req) => {
        let promise: Promise<AssetRecord>;

        if (req.type === "image" || req.type === "icon") {
            promise = loadImage(req.src, req.id, req.type);
        } else if (req.type === "video") {
            promise = loadVideo(req.src, req.id);
        } else if (req.type === "model") {
            promise = loadModel(req.src, req.id);
        } else {
            return Promise.reject(
                new Error(`Unsupported request type: ${req.type}`),
            );
        }

        return promise.finally(() => onProgress?.());
    });

    return Promise.all(tasks);
}
