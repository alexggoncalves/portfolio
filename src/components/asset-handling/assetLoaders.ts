export type VideoRecord = {
    id: string;
    type: "video";
    element: HTMLVideoElement | null;
    isLoaded: boolean;
};

export type ImageRecord = {
    id: string;
    type: "image" | "icon";
    element: HTMLImageElement | null;
    isLoaded: boolean;
};

export type ModelRecord = {
    id: string;
    type: "model";
    element: unknown | null;
    isLoaded: boolean;
};

export type AssetRecord = VideoRecord | ImageRecord | ModelRecord;

export function loadVideo(src: string, id: string): Promise<VideoRecord> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = src;
        video.crossOrigin = "anonymous";
        video.loop = false;
        video.muted = true;
        video.playsInline = true;

        video.onloadeddata = () => {
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            resolve({
                id,
                type: "video",
                element: video,
                isLoaded: true,
            });
        };

        video.onerror = () => {
            reject(new Error(`Failed to load video: ${src}`));
        };
    });
}

export function loadImage(
    src: string,
    id: string,
    type: "image" | "icon" = "image",
): Promise<ImageRecord> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
            resolve({
                id,
                type,
                element: img,
                isLoaded: true,
            });
        };

        img.onerror = () => {
            reject(new Error(`Failed to load image: ${src}`));
        };
    });
}

export function loadModel(src: string, id: string): Promise<ModelRecord> {
    return new Promise((resolve) => {
        // TODO: Implement model loading

        resolve({
            id,
            type: "model",
            element: { src },
            isLoaded: true,
        });
    });
}