// import { Container, Text } from "@react-three/uikit";

// import { useRef, type ComponentRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import useAsciiRenderStore from "../../../../../../stores/asciiRenderStore";
// import PlayPauseButton from "./PlayPauseButton";
// import VolumeControls from "./VolumeControls";
// import Button from "../../../general/Button";
// import Icon from "../../../general/Icon";


// function formatTime(seconds: number) {
//     if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
//     const m = Math.floor(seconds / 60);
//     const s = Math.floor(seconds % 60);
//     return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
// }

// function scrubRatioFromEvent(e: any): number | null {
//     const uv = e?.uv ?? e?.intersections?.[0]?.uv;
//     if (!uv || typeof uv.x !== "number") return null;
//     return Math.min(1, Math.max(0, uv.x));
// }

// function VideoControlsBar({ video }: { video: HTMLVideoElement }) {
//     const bgColor = useAsciiRenderStore((s) => s.bgColor);

//     const timeTextRef = useRef<ComponentRef<typeof Text>>(null);
//     const progressRef = useRef<ComponentRef<typeof Container>>(null);
//     const dragging = useRef(false);

//     const previewRatio = useRef<number | null>(null);

//     useFrame(() => {
//         if (!progressRef.current || !timeTextRef.current) return;

//         const duration = video.duration;
//         const ok = Number.isFinite(duration) && duration > 0;

//         const r = previewRatio.current;
//         const displayTime =
//             dragging.current && r !== null && ok ? r * duration : video.currentTime;

//         const pct = ok
//             ? Math.min(100, Math.max(0, (displayTime / duration) * 100))
//             : 0;
//         progressRef.current.setProperties({ width: `${pct}%` });

//         const label = `${formatTime(displayTime)}/${formatTime(ok ? duration : 0)}`;
//         timeTextRef.current.setProperties({ text: label });
//     });

//     function updatePreview(e: any) {
//         const ratio = scrubRatioFromEvent(e);
//         if (ratio !== null) previewRatio.current = ratio;
//     }

//     function commitScrub() {
//         const ratio = previewRatio.current;
//         previewRatio.current = null;
//         dragging.current = false;
//         if (ratio === null) return;
//         const d = video.duration;
//         if (Number.isFinite(d) && d > 0) video.currentTime = ratio * d;
//     }

//     function onTrackDown(e: any) {
//         if (e.nativeEvent.button !== 0) return;
//         e.stopPropagation();
//         dragging.current = true;
//         updatePreview(e);
//     }

//     function onTrackMove(e: any) {
//         if (!dragging.current) return;
//         const ne = e.nativeEvent;
//         if (ne.pointerType === "mouse" && (ne.buttons & 1) === 0) {
//             commitScrub();
//             return;
//         }
//         e.stopPropagation();
//         updatePreview(e);
//     }

//     function onTrackUp() {
//         commitScrub();
//     }

//     const togglePlay = (e: any) => {
//         e.stopPropagation();
//         if (video.paused) void video.play();
//         else video.pause();
//     };

//     async function toggleFullScreen(e: any) {
//         e?.stopPropagation?.();

//         if (document.fullscreenElement) {
//             await document.exitFullscreen();
//             return;
//         }

//         if (!video.parentElement) {
//             video.style.position = "fixed";
//             video.style.top = "-9999px";
//             video.style.left = "-9999px";
//             document.body.appendChild(video);
//         }

//         video.controls = true;
//         await video.requestFullscreen();
//     }

//     return (
//         <>
//             <Container
//                 width={"100%"}
//                 height={35}
//                 backgroundColor={bgColor}
//                 opacity={0.8}
//                 borderWidth={1}
//                 positionBottom={0}
//                 zIndex={80}
//                 positionType={"absolute"}
//                 onClick={(e: any) => e.stopPropagation()}
//             />

//             <Container
//                 width={"100%"}
//                 height={35}
//                 positionBottom={0}
//                 zIndex={100}
//                 positionType={"absolute"}
//                 alignItems={"center"}
//             >
//                 <PlayPauseButton video={video} togglePlay={togglePlay} />

//                 <Container
//                     flexGrow={1}
//                     minWidth={72}
//                     height={22}
//                     marginX={8}
//                     alignItems={"center"}
//                     justifyContent={"center"}
//                     cursor={"pointer"}
//                     onPointerDown={onTrackDown}
//                     onPointerMove={onTrackMove}
//                     onPointerUp={onTrackUp}
//                     onPointerCancel={onTrackUp}
//                 >
//                     <Container
//                         height={6}
//                         width={"100%"}
//                         borderWidth={1}
//                         borderColor={"white"}
//                         borderRadius={10}
//                     >
//                         <Container
//                             ref={progressRef}
//                             opacity={1}
//                             borderRadius={10}
//                             backgroundColor={"white"}
//                             height={"100%"}
//                             pointerEvents={"none"}
//                         />
//                     </Container>
//                 </Container>

//                 <Container
//                     marginLeft={2}
//                     width={80}
//                     flexShrink={0}
//                     justifyContent={"center"}
//                     alignItems={"center"}
//                 >
//                     <Text width={"100%"} ref={timeTextRef} color={"white"} />
//                 </Container>

//                 <VolumeControls video={video} />

//                 <Button
//                     callBack={toggleFullScreen}
//                     alignItems={"center"}
//                     justifyContent={"center"}
//                     marginX={8}
//                     flexShrink={0}
//                 >
//                     <Icon id={"pause"} size={22} />
//                 </Button>
//             </Container>
//         </>
//     );
// }

// export default VideoControlsBar;
