// import { useEffect, useRef, type ComponentRef } from "react";
// import Icon from "../../../general/Icon";
// import { Container } from "@react-three/uikit";
// import { useFrame } from "@react-three/fiber";

// const fadeSpeed = 6;

// function BigPlayButton({ video }: { video: HTMLVideoElement }) {
//     const iconContainer = useRef<ComponentRef<typeof Container>>(null);

//     const fading = useRef(false);
//     const done = useRef(false);
//     const opacity = useRef(1);

//     useEffect(() => {
//         const onPlay = () => {
//             fading.current = true;
//         };

//         video.addEventListener("play", onPlay);
//         return () => {
//             video.removeEventListener("play", onPlay);
//         };
//     }, [video]);

//     useFrame((_state, delta) => {
//         const container = iconContainer.current;
//         if (!container || done.current || !fading.current) return;

//         opacity.current = Math.max(0, opacity.current - delta * fadeSpeed);
//         container?.setProperties({ opacity: opacity.current });

//         if (opacity.current < 0) {
//             done.current = true;
//             fading.current = false;

//             container.setProperties({ opacity: 0 });
//         }
//     });

//     return (
//         <Container width={"100%"} height={"100%"} positionType={"absolute"} justifyContent={"center"} alignItems={"center"}>
//             <Container
//                 ref={iconContainer}
//                 positionType={"absolute"}
//                 opacity={1}
//                 cursor={"pointer"}
//                 transformOriginX="center"
//                 transformOriginY="center"
//                 hover={{ transformScaleX: 1.2, transformScaleY: 1.2 }}
//                 active={{ transformScaleX: 1, transformScaleY: 1 }}
//             >
//                 <Icon id={"play"} size={100} />
//             </Container>
//         </Container>
//     );
// }

// export default BigPlayButton;
