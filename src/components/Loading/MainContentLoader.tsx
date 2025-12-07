import { useEffect } from "react";

import useContentStore from "../../stores/contentStore"; // your Zustand store
import worksData from "../../data/works.json";
import peopleData from "../../data/people.json";
import type { Work, Person, Asset } from "../../stores/contentStore";
import { useLoader } from "@react-three/fiber";
import { ImageLoader } from "three";
import { useProgress, useTexture } from "@react-three/drei";

const defaultAvatarSrc = "/images/default/default_avatar.jpg";
const defaultProjectThumbnail = "/images/default/default_avatar.jpg";

const works = worksData as Work[];
const people = peopleData as Person[];

// Load thumbnails, 3d models and team pictures
function MainContentLoader() {
    // const { progress, item, loaded } = useProgress();

    // const { setProgress, set}

    useEffect(() => {
        async function preloadContent() {
            // useTexture.preload(defaultProjectThumbnail);

            const workThumbnails = worksData.map((work) =>
                work.assets.find((asset) => asset.type === "thumbnail" || asset.type==="video")
            );

            const teamAvatars = people.map((person) => person.avatar);
            // console.log(teamAvatars);

            const assetsToLoad = [
                defaultAvatarSrc,
                defaultProjectThumbnail,
                ...workThumbnails,
                ...teamAvatars,
            ] as Asset[];

            // Preload all textures
            await Promise.all(
                assetsToLoad.map(async (asset) => {
                    try {
                        if (!asset.src) {
                            console.warn("Asset missing src:", asset);
                            return;
                        }

                        if (
                            asset.type == "image" ||
                            asset.type == "thumbnail"
                        ) {
                            return await new Promise<void>((resolve) => {
                                useTexture.preload(asset.src);
                                resolve();
                            });
                            
                        } else if (asset.type === "video") {
                            return new Promise<void>((resolve, reject) => {
                                useTexture.preload(asset.src);
                                resolve();
                            });
                            // video
                        } else if (asset.type === "model") {
                            // 3d model
                        }
                    } catch (err) {
                        console.log(`failed to load: ${asset.src}`, err);
                    }
                })
            );

            // console.log(works);

            useContentStore.setState({
                works,
                people,
                loaded: true,
            });
        }

        preloadContent();
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                bottom: "50px",
                left: "50px",
                zIndex: "2",
            }}
        >
            {/* {progress} : {item} */}
        </div>
    );
}

export default MainContentLoader;
