import { create } from "zustand";
import { CanvasTexture, Vector2 } from "three";

type ASCIIState = {
    charSize: Vector2
    atlasGridSize: Vector2
    asciiSequence: string
    fontAtlas: string

    uiTexture: CanvasTexture | null
    uiContext: CanvasRenderingContext2D | null
    backgroundTexture: CanvasTexture | null
    backgroundContext: CanvasRenderingContext2D | null

    setUI:(uiTexture: CanvasTexture, uiContext: CanvasRenderingContext2D ) => void
    setBackground:(backgroundTexture: CanvasTexture, backgroundContext: CanvasRenderingContext2D ) => void
}

const useAsciiStore = create<ASCIIState>((set) => ({
    charSize: new Vector2(16,16),
    atlasGridSize: new Vector2(10,10),
    fontAtlas: "/fontAtlas-10x10-128px_aa.png",
    asciiSequence: '       .`,:’;_”-!il^Ir1v\\jft*~|LJc/?xT+()7Y<>nuz=y{}oFskVahe[]4CX23AbdpqUZwKPESHG5O0gD69mNQR8B&%MW#$',
    
    uiTexture: null,
    uiContext: null,
    backgroundTexture: null,
    backgroundContext: null,

    setUI:(uiTexture: CanvasTexture, uiContext: CanvasRenderingContext2D ) => set({uiTexture: uiTexture,uiContext: uiContext }),
    setBackground:(backgroundTexture: CanvasTexture, backgroundContext: CanvasRenderingContext2D ) => set({backgroundTexture: backgroundTexture, backgroundContext: backgroundContext })

    
}));

export default useAsciiStore