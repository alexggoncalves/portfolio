// import { useEffect } from "react";

// import WORKS from "../../data/projects.json";
// import PEOPLE from "../../data/people.json";
// import TAGS from "../../data/tags.json";
// import ICONS from "../../data/icons.json";

// import useContentStore from "../../stores/assetStore"; // your Zustand store

// import type { Work, Person, Tag, Icon } from "../../stores/assetStore";
// // import { useLoader } from "@react-three/fiber";
// // import { ImageLoader } from "three";
// import { useTexture } from "@react-three/drei";
// // import { useProgress } from "@react-three/drei";

// const defaultAvatarSrc = "/images/avatars/default_avatar.jpg";
// const defaultProjectThumbnail = "/images/default/default_avatar.jpg";

// const works = WORKS as Work[];
// const people = PEOPLE as Person[];
// const tags = TAGS as Tag[];
// const icons = ICONS as Icon[];

// // Load thumbnails, 3d models and team pictures
// function AssetLoader() {
//     // const { progress, item } = useProgress();

//     // const { setProgress, set}

//     useEffect(() => {
//         if (useContentStore.getState().loaded) return;

//         function preloadGlobalAssets() {
//             // Gather all asset sources to preload
//             const thumbnailSources = works.map((work) => work.thumbnailSrc);
//             const avatarSources = people.map((person) => person.avatarSrc);
//             const iconSources = icons.map((icon) => icon.src);

//             // Array of all images to load
//             const imagesToLoad = [
//                 defaultAvatarSrc,
//                 defaultProjectThumbnail,
//                 ...thumbnailSources,
//                 ...avatarSources,
//                 ...iconSources,
//             ] as string[]

//             // Preload all primary assets
//             imagesToLoad.forEach((src) => useTexture.preload(src));

//             useContentStore.setState({
//                 works,
//                 people,
//                 tags,
//                 icons,
//                 loaded: true,
//             });
//         }

//         preloadGlobalAssets();
//     }, []);

//     // return (
//     //     <div
//     //         style={{
//     //             position: "absolute",
//     //             bottom: "50px",
//     //             left: "50px",
//     //             zIndex: "2",
//     //         }}
//     //     >
//     //         {/* {progress} : {item} */}
//     //     </div>
//     // );
//     return null
// }

// export default AssetLoader;
