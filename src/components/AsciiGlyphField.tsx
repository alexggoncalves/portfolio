import { CanvasTexture, Color, NearestFilter, Texture, Vector2 } from "three";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import useAsciiStore from "../stores/asciiStore";

// import elements from "./../assets/asciiElements.json";
import {
    ASCIIBlock,
    ASCIIButton,
    ASCIIImage,
    ASCIIScreenFrame,
} from "./ASCIIElement";
import { ASCIILayer } from "./ASCIILayer";
import Color4 from "three/src/renderers/common/Color4.js";

type AsciiGlyphFieldProps = {
    charSize: Vector2;
};

function AsciiGlyphField({ charSize }: AsciiGlyphFieldProps) {
    const { viewport, size } = useThree();
    const { uiTexture, backgroundTexture, setUI, setBackground, canvasOffset } =
        useAsciiStore();

    const uiTexRef = useRef<Texture>(null);
    const uiContextRef = useRef<CanvasRenderingContext2D>(null);
    const backgroundTexRef = useRef<Texture>(null);
    const backgroundContextRef = useRef<CanvasRenderingContext2D>(null);

    const layers = useRef<ASCIILayer[]>([]);

    // Create context to draw in and use on the the GPU
    function createTexture(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = width * viewport.dpr;
        canvas.height = height * viewport.dpr;

        const ctx = canvas.getContext("2d", { alpha: true })!;
        ctx.imageSmoothingEnabled = false;

        const texture = new CanvasTexture(canvas);

        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        return { texture, ctx };
    }

    useFrame((state, delta) => {
        if (!uiTexture || !backgroundTexture) return;

        if (uiContextRef.current && backgroundContextRef.current) {
            // Clear ui and background textures
            uiContextRef.current.clearRect(
                0,
                0,
                uiTexture.width,
                uiTexture.height
            );
            backgroundContextRef.current.clearRect(
                0,
                0,
                backgroundTexture.width,
                backgroundTexture.height
            );

            // Draw and update each layer
            layers.current.forEach((layer: ASCIILayer) => {
                // layer.update();
                layer.draw(
                    uiContextRef.current!,
                    backgroundContextRef.current!
                );
                layer.update(delta)
            });
        }

        uiTexture.needsUpdate = true;
        backgroundTexture.needsUpdate = true;
    });

    useEffect(() => {
        // Create a texture to draw the UI as ASCII and the background on the GPU
        const uiTex = createTexture(
            size.width / charSize.x,
            size.height / charSize.y
        );
        const backgroundTex = createTexture(size.width, size.height);

        // Store the texture and the context for both canvas created on the asciiStore
        setUI(uiTex.texture, uiTex.ctx);
        setBackground(backgroundTex.texture, backgroundTex.ctx);

        // Save references for the created objects
        uiTexRef.current = uiTex.texture;
        uiContextRef.current = uiTex.ctx;
        backgroundTexRef.current = backgroundTex.texture;
        backgroundContextRef.current = backgroundTex.ctx;
    }, [size, charSize, canvasOffset]);

    // Set Scene
    useEffect(() => {
        const test = `
    :::     :::        :::::::::: :::    ::: 
  :+: :+:   :+:        :+:        :+:    :+: 
 +:+   +:+  +:+        +:+         +:+  +:+  
+#++:++#++: +#+        +#++:++#     +#++:+   
+#+     +#+ +#+        +#+         +#+  +#+  
#+#     #+# #+#        #+#        #+#    #+# 
###     ### ########## ########## ###    ### `;

        const frameLayer = new ASCIILayer("frame", []);

        frameLayer.addElement(
            new ASCIIScreenFrame(new Color(1, 1, 1), new Color4("transparent"))
        );

        const homeLayer = new ASCIILayer("home", []);
        homeLayer.addElement(
            new ASCIIBlock(
                test,
                new Vector2(5, 5),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0)
            )
        );

        const img = new Image();
        img.src = "/images/endlesspurrs_cover.png";
        const testImage = new ASCIIImage(
            new Vector2(10, 26),
            img,
            16 * 2,
            16 / 9
        );

        const toggleImage = () => {
            if(testImage.currentOpacity >.5) testImage.fadeOut();
            else testImage.fadeIn();
            
        };

        homeLayer.addElement(
            new ASCIIButton(
                "click here",
                new Vector2(24, 24),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                toggleImage
            )
        );

        homeLayer.addElement(testImage);

        layers.current.push(frameLayer, homeLayer);

        return () => {
            layers.current.forEach((layer: ASCIILayer) => {
                layer.destroy();
            });
            layers.current = [];
        };
    }, [size]);

    return null;
}

export default AsciiGlyphField;
