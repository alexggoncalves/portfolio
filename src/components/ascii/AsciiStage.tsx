import { useMemo } from "react";
import useAsciiRenderStore from "../../stores/asciiRenderStore";
import { Scene, TextureLoader } from "three";
import { createPortal, useLoader } from "@react-three/fiber";
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

    // ---- LOAD ATLAS ----
    const asciiAtlas = useLoader(TextureLoader, asciiAtlasSrc);
    if (!asciiAtlas) return;

    // ---- SCENE ----
    const asciiScene = useMemo(() => new Scene(), []);

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
