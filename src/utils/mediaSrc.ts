const withSuffix = (src: string, suffix: string) => src.replace(/\.[^./]+$/, `${suffix}.webp`);

export const toMobileSrc = (src: string) => withSuffix(src, "-mobile");
export const toThumbSrc = (src: string) => withSuffix(src, "-thumbnail");
export const toPosterSrc = (src: string) => withSuffix(src, "-poster");
export const imageSrcSet = (src: string) => `${toMobileSrc(src)} 1280w, ${src} 2560w`;