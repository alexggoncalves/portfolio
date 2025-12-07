import { Vector2 } from "three"; 
import { useState, useEffect } from "react";

function useGridCanvasSize(
    charSize: Vector2
) {
    const [size, setSize] = useState({ width: 0, height: 0, left: 0, top: 0 });

    useEffect(() => {
        function updateSize() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

             // Calculate grid dimensions that cover the viewport
            const gridCols = Math.floor(viewportWidth / charSize.x) + Math.floor(4 / devicePixelRatio);
            const gridRows = Math.floor(viewportHeight / charSize.y) +  Math.floor(4 / devicePixelRatio);

            const canvasWidth = gridCols * charSize.x;
            const canvasHeight = gridRows * charSize.y;

            const left = Math.floor((canvasWidth - viewportWidth) / 2);
            const top = Math.floor((canvasHeight - viewportHeight) / 2);

            setSize({
                width: canvasWidth,
                height: canvasHeight,
                left,
                top,
            });
        }
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [charSize.x, charSize.y]);

    return size;
}

export default useGridCanvasSize;