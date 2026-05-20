// import type { AssetRecord } from "../../../../app/assets/assetLoaders";
// import ImageView from "./ImageView";
// import ModelView from "./ModelView";
// import Placeholder from "./Placeholder";
// import VideoView from "./video/VideoView";


// function MediaContainer({
//     media,
//     currentIndex,
// }: {
//     media: AssetRecord[] | undefined;
//     currentIndex: number;
// }) {
    
//     if (!media || media?.length === 0) return <Placeholder label={"No media"} />;

//     const asset = media[currentIndex];
//     if (!asset) return <Placeholder label={"Asset not found"} />;

//     // Place placeholder if asset is still loading
//     if (!asset.isLoaded || !asset.element) {
//         const label =
//             asset.type === "video"
//                 ? "Loading video…"
//                 : asset.type === "model"
//                   ? "Loading 3D model…"
//                   : "Loading image…";

//         return <Placeholder label={label} />;
//     }

//     // When asset is ready, render it based on the type
//     if (asset.type === "image" || asset.type === "icon") {
//         return <ImageView asset={asset} />;
//     } else if (asset.type === "video") {
//         return <VideoView asset={asset} />;
//     } else if (asset.type === "model") {
//         return <ModelView asset={asset} />;
//     } else return null;
// }

// export default MediaContainer;
