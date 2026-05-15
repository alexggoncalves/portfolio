import { Container } from "@react-three/uikit";
import useAssetStore from "../../../../app/assets/assetStore";
import MediaContainer from "./MediaContainer";
import MediaNavigator from "./MediaNavigator";
import { useState } from "react";

function ProjectMediaViewer({ projectId }: { projectId: string }) {
    const projectAssets = useAssetStore((s) => s.projectAssets[projectId]);
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <>
            {/* Media Container */}
            <Container
                width="100%"
                aspectRatio={16 / 9}
            >
                <Container width={"100%"} height={"100%"}>
                    <MediaContainer
                        media={projectAssets}
                        currentIndex={currentIndex}
                    ></MediaContainer>
                </Container>
                <MediaNavigator
                    assets={projectAssets}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                ></MediaNavigator>
            </Container>

            {/* Media Navigator */}
        </>
    );
}

export default ProjectMediaViewer;
