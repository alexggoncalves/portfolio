// import { useEffect, useRef, useState, type ComponentRef } from "react";
// import { Container } from "@react-three/uikit";
// import { useFrame } from "@react-three/fiber";
// import Button from "../../../general/Button";
// import Icon from "../../../general/Icon";

// function volumeRatioFromEvent(e: any): number | null {
//     const uv = e?.uv ?? e?.intersections?.[0]?.uv;
//     if (!uv || typeof uv.x !== "number") return null;
//     return Math.min(1, Math.max(0, uv.x));
// }

// function VolumeControls({ video }: { video: HTMLVideoElement }) {
//     const lastVolumeBeforeZero = useRef(
//         Number.isFinite(video.volume) && video.volume > 0 ? video.volume : 1,
//     );

//     const [isMuted, setIsMuted] = useState(
//         () => video.muted || video.volume === 0,
//     );

//     const fillRef = useRef<ComponentRef<typeof Container>>(null);
//     const dragging = useRef(false);
//     const preview = useRef<number | null>(null);

//     useEffect(() => {
//         function onVolumeChange() {
//             setIsMuted(video.muted || video.volume === 0);
//             if (video.volume > 0) lastVolumeBeforeZero.current = video.volume;
//         }
//         video.addEventListener("volumechange", onVolumeChange);
//         return () => video.removeEventListener("volumechange", onVolumeChange);
//     }, [video]);

//     useFrame(() => {
//         if (!fillRef.current) return;
//         const p = preview.current;
//         const v = Number.isFinite(video.volume) ? video.volume : 0;
//         const level = dragging.current && p !== null ? p : v;

//         fillRef.current.setProperties({
//             width: `${Math.min(1, Math.max(0, level)) * 100}%`,
//         });
//     });

//     function commitSlider() {
//         const ratio = preview.current;
//         preview.current = null;
//         dragging.current = false;
//         if (ratio === null) return;

//         video.volume = ratio;
//         if (ratio > 0) video.muted = false;
//         setIsMuted(video.muted || video.volume === 0);
//     }

//     function onTrackDown(e: any) {
//         if (e.nativeEvent.button !== 0) return;
//         e.stopPropagation();
//         dragging.current = true;
//         const r = volumeRatioFromEvent(e);
//         if (r !== null) preview.current = r;
//     }

//     function onTrackMove(e: any) {
//         if (!dragging.current) return;
//         const ne = e.nativeEvent;
//         if (ne.pointerType === "mouse" && (ne.buttons & 1) === 0) {
//             commitSlider();
//             return;
//         }
//         e.stopPropagation();
//         const r = volumeRatioFromEvent(e);
//         if (r !== null) preview.current = r;
//     }

//     function onTrackUp(e: any) {
//         e.stopPropagation();
//         commitSlider();
//     }

//     function toggleMute() {
//         const audible = !video.muted && video.volume > 0;
//         if (!audible) {
//             video.muted = false;
//             if (video.volume <= 0) {
//                 const v = lastVolumeBeforeZero.current;
//                 video.volume = v > 0 ? v : 1;
//             }
//         } else {
//             lastVolumeBeforeZero.current = video.volume;
//             video.volume = 0;
//         }
//         setIsMuted(video.muted || video.volume === 0);
//     }

//     return (
//         <Container
//             positionType={"relative"}
//             marginLeft={4}
//             flexDirection={"row"}
//             height={"100%"}
//             alignItems={"center"}
//             flexShrink={0}
//         >
//             <Button
//                 callBack={(e: any) => {
//                     e?.stopPropagation?.();
//                     toggleMute();
//                 }}
//                 marginLeft={8}
//                 marginRight={2}
//                 alignItems={"center"}
//                 justifyContent={"center"}
//             >
//                 <Icon
//                     id={isMuted ? "pause" : "play"}
//                     cursor={"pointer"}
//                     size={22}
//                 />
//             </Button>

//             <Container
//                 marginLeft={4}
//                 width={80}
//                 height={20}
//                 alignItems={"center"}
//                 justifyContent={"center"}
//                 cursor={"pointer"}
//                 onPointerDown={onTrackDown}
//                 onPointerMove={onTrackMove}
//                 onPointerUp={onTrackUp}
//                 onPointerCancel={onTrackUp}
//             >
//                 <Container
//                     width={"100%"}
//                     height={6}
//                     opacity={0.6}
//                     borderRadius={10}
//                     borderColor={"white"}
//                     borderWidth={2}
//                 >
//                     <Container
//                         ref={fillRef}
//                         opacity={1}
//                         borderRadius={10}
//                         backgroundColor={"white"}
//                         height={"100%"}
//                         width={"0%"}
//                         pointerEvents={"none"}
//                     />
//                 </Container>
//             </Container>
//         </Container>
//     );
// }

// export default VolumeControls;
