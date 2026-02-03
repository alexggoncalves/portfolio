import { useEffect } from "react";

import worksData from "../../data/works.json";
import peopleData from "../../data/people.json";
import tagsData from "../../data/tags.json";

import useContentStore from "../../stores/contentStore"; // your Zustand store

import type { Work, Person, Tag } from "../../stores/contentStore";
// import { useLoader } from "@react-three/fiber";
// import { ImageLoader } from "three";
import { useProgress, useTexture } from "@react-three/drei";

const defaultAvatarSrc = "/images/avatars/default_avatar.jpg";
const defaultProjectThumbnail = "/images/default/default_avatar.jpg";

const works = worksData as Work[];
const people = peopleData as Person[];
const tags = tagsData as Tag[];

// Load thumbnails, 3d models and team pictures
function MainContentLoader() {
    const { progress, item } = useProgress();

    // const { setProgress, set}

    useEffect(() => {
        async function preloadGlobalAssets() {
            // Get all work thumbnail sources
            const workThumbnails = worksData.map((work) => work.thumbnailSrc);
            // Get all team avatars sources
            const teamAvatars = people.map((person) => person.avatarSrc);

            // Array of all images to load
            const imagesToLoad = [
                defaultAvatarSrc,
                defaultProjectThumbnail,
                ...workThumbnails,
                ...teamAvatars,
            ] as string[]

            // Preload all primary assets
            await Promise.all(
                imagesToLoad.map(async (assetSrc) => {
                    try {
                        if (!assetSrc) {
                            console.warn("Asset missing src");
                            return;
                        }

                        return await new Promise<void>((resolve) => {
                                useTexture.preload(assetSrc);
                                resolve();
                        });

                    } catch (err) {
                        console.log(`failed to load: ${assetSrc}`, err);
                    }
                }),
            );

            console.log(works);

            useContentStore.setState({
                works,
                people,
                tags,
                loaded: true,
            });
        }

        preloadGlobalAssets();
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
            {progress} : {item}
        </div>
    );
}

export default MainContentLoader;
