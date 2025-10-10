import { CanvasTexture, Color, NearestFilter, Texture, Vector2 } from "three";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import useAsciiStore from "../stores/asciiStore";

// import elements from "./../assets/asciiElements.json";
import { ASCIIBlock, type ASCIIElement } from "./ASCIIElement";
import Color4 from "three/src/renderers/common/Color4.js";
import { premultiplyAlpha } from "three/tsl";

type AsciiGlyphFieldProps = {
    charSize: Vector2;
};

function AsciiGlyphField({ charSize }: AsciiGlyphFieldProps) {
    const { viewport, size } = useThree();
    const { uiTexture, backgroundTexture, setUI, setBackground } =
        useAsciiStore();
        
    const uiTexRef = useRef<Texture>(null);
    const uiContextRef = useRef<CanvasRenderingContext2D>(null);
    const backgroundTexRef = useRef<Texture>(null);
    const backgroundContextRef = useRef<CanvasRenderingContext2D>(null);

    const elements = useRef<ASCIIElement[]>([]);

    function createTexture(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = width * viewport.dpr;
        canvas.height = height * viewport.dpr;

        const ctx = canvas.getContext("2d", { alpha: true})!;
        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const texture = new CanvasTexture(canvas);

        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        return { texture, ctx };
    }

    useFrame(() => {
        if (!uiTexture || !backgroundTexture) return;

        if (uiContextRef.current && backgroundContextRef.current) {
            uiContextRef.current.clearRect(0, 0, size.width / charSize.x, size.height / charSize.y);
            backgroundContextRef.current.clearRect(0, 0, size.width, size.height);

            elements.current.forEach((element) => {
                element.draw(uiContextRef.current!,backgroundContextRef.current!);
            });
        }

        uiTexture.needsUpdate = true;
        backgroundTexture.needsUpdate = true;
    });

    useEffect(() => {
        const uiTex = createTexture(size.width / charSize.x, size.height / charSize.y);
        const backgroundTex = createTexture(size.width, size.height);

        setUI(uiTex.texture, uiTex.ctx);
        setBackground(backgroundTex.texture, backgroundTex.ctx);

        uiTexRef.current = uiTex.texture;
        uiContextRef.current = uiTex.ctx;
        backgroundTexRef.current = backgroundTex.texture;
        backgroundContextRef.current = backgroundTex.ctx;

        const test = `
    :::     :::        :::::::::: :::    ::: 
  :+: :+:   :+:        :+:        :+:    :+: 
 +:+   +:+  +:+        +:+         +:+  +:+  
+#++:++#++: +#+        +#++:++#     +#++:+   
+#+     +#+ +#+        +#+         +#+  +#+  
#+#     #+# #+#        #+#        #+#    #+# 
###     ### ########## ########## ###    ### `;

const test2 = ` Ola, sou a patricia `;

        elements.current.push(
            new ASCIIBlock(
                test,
                new Vector2(5, 5),
                new Vector2(0, 0),
                new Color("white"),
                new Color4(0,0.4,0.4,1)
            )
        );

        elements.current.push(
            new ASCIIBlock(
                test2,
                new Vector2(5, 20),
                new Vector2(0, 0),
                new Color("white"),
                new Color4(1,0.3,0.4,1)
            )
        );
        
    }, [size, charSize]);

    return null;
}

export default AsciiGlyphField;
