import { useEffect, useMemo } from "react";
import useAsciiRenderStore from "../../stores/asciiRenderStore";
import { Scene, TextureLoader } from "three";
import { createPortal } from "@react-three/fiber";
import AsciiScene from "./AsciiScene";
import GridCanvas from "./GridCanvas";
import AsciiRenderPipeline from "./AsciiRenderPipeline";

function AsciiStage() {
    // ---- STATES ----
    const gridSize = useAsciiRenderStore((state) => state.gridSize);
    const atlasGridSize = useAsciiRenderStore((state) => state.atlasGridSize);
    const charSize = useAsciiRenderStore((state) => state.charSize);
    const glyphSoftness = useAsciiRenderStore((state) => state.glyphSoftness);
    const glyphThreshold = useAsciiRenderStore((state) => state.glyphThreshold);
    const asciiAtlasSrc = useAsciiRenderStore((state) => state.asciiAtlasSrc);
    const asciiAtlas = useAsciiRenderStore((s) => s.asciiAtlas);
    const isAtlasReady = useAsciiRenderStore((s) => s.isAtlasReady);

    // ---- LOAD ATLAS ----
    useEffect(() => {
        const load = async () => {
            const loader = new TextureLoader();

            const atlas = await loader.loadAsync(asciiAtlasSrc);

            useAsciiRenderStore.getState().setAtlas(atlas);
            useAsciiRenderStore.getState().setAtlasReady(true);
        };

        load();
    }, []);

    // ---- SCENE ----
    const asciiScene = useMemo(() => new Scene(), []);

    if (!isAtlasReady || !asciiAtlas) return null;

    return (
        <>
            <GridCanvas cellWidth={charSize.w} cellHeight={charSize.h}>
                <>
                    {createPortal(<AsciiScene />, asciiScene)}
                    <AsciiRenderPipeline
                        scene={asciiScene}
                        atlas={asciiAtlas}
                        gridSize={gridSize}
                        atlasGridSize={atlasGridSize}
                        charSize={charSize}
                        glyphSoftness={glyphSoftness}
                        glyphThreshold={glyphThreshold}
                    />
                </>
            </GridCanvas>
        </>
    );
}

export default AsciiStage;
