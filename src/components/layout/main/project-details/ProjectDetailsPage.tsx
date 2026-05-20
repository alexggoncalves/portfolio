import { Container, Fullscreen } from "@react-three/uikit";
import { getProjectById } from "../../../app/assets/contentAssets";
import ProjectMediaViewer from "./media-viewer/ProjectMediaViewer";
import { useEffect, useMemo } from "react";
import useAssetStore from "../../../app/assets/assetStore";
import useAsciiRenderStore from "../../../../stores/asciiRenderStore";
import ProjectDetails from "./ProjectDetails";

// const projectId = "endless-purrs"; // ! TEMP

function ProjectDetailsPage({ projectId }: { projectId: string }) {
    const loadProjectAssets = useAssetStore((s) => s.loadProjectAssets);

    const charSize = useAsciiRenderStore((s) => s.charSize);

    // Get project
    const project = useMemo(() => {
        return getProjectById(projectId);
    }, [projectId]);

    // Load project assets
    useEffect(() => {
        loadProjectAssets(projectId);
    }, [projectId, loadProjectAssets]);

    if (!project) return;

    return (
        <group>
            <Fullscreen
                paddingTop={charSize.h * 8}
                paddingX={charSize.w * 4}
                paddingBottom={charSize.h * 4}
            >
                <Container
                    width={"100%"}
                    height={"100%"}
                    alignItems={"flex-end"}
                >
                    {/* Left panel - Project Details */}
                    <Container
                        flexDirection={"column"}
                        width={"40%"}
                        justifyContent={"center"}
                        paddingRight={35}
                    >
                        {/* Details */}
                        <ProjectDetails project={project} />
                    </Container>

                    {/* Right panel - Media Gallery */}
                    <Container
                        borderColor={"white"}
                        borderRadius={1}
                        width={"60%"}
                        alignItems={"center"}
                        positionType={"relative"}
                        alignSelf={"center"}
                    >
                        <ProjectMediaViewer
                            projectId={project.id}
                        ></ProjectMediaViewer>
                    </Container>
                </Container>
            </Fullscreen>
        </group>
    );
}

export default ProjectDetailsPage;
