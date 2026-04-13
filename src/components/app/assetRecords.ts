type VideoRecord = {
    type: "video";
    element: HTMLVideoElement;
    loaded: boolean;
};

type ImageRecord = {
    type: "image";
    element: HTMLImageElement;
    loaded: boolean;
};

export const videos = new Map<string, VideoRecord>();
export const images = new Map<string, ImageRecord>();

export function loadVideo(src: string): Promise<VideoRecord> {
    const existing = videos.get(src);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve) => {
        const video = document.createElement("video");

        video.src = src;
        video.crossOrigin = "anonymous";
        video.loop = false;
        video.muted = true;
        video.playsInline = true;

        const record: VideoRecord = {
            type: "video",
            element: video,
            loaded: false,
        };

        video.onloadeddata = () => {
            record.loaded = true;
            resolve(record);
        };

        videos.set(src, record);
    });
}

export function loadImage(src: string): Promise<ImageRecord> {
    const existing = images.get(src);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        const record: ImageRecord = {
            type: "image",
            element: img,
            loaded: false,
        };

        img.onload = () => {
            record.loaded = true;
            resolve(record);
        };

        images.set(src, record);
    });
}
