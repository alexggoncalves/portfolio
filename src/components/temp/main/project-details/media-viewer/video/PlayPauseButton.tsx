// import { useEffect, useState } from "react";
// import Button from "../../../general/Button";
// import Icon from "../../../general/Icon";

// function PlayPauseButton({
//     video,
//     togglePlay,
// }: {
//     video: HTMLVideoElement;
//     togglePlay: (e: any) => void;
// }) {
//     const [isPlaying, setIsPlaying] = useState(!video.paused);

//     useEffect(() => {
//         const onPlay = () => setIsPlaying(true);
//         const onPause = () => setIsPlaying(false);

//         video.addEventListener("play", onPlay);
//         video.addEventListener("pause", onPause);
//         return () => {
//             video.removeEventListener("play", onPlay);
//             video.removeEventListener("pause", onPause);
//         };
//     }, [video]);

//     return (
//         <Button callBack={togglePlay} marginLeft={8} alignItems={"center"} justifyContent={"center"} flexShrink={0}>
//             <Icon  id={isPlaying ? "pause" : "play"} width={20} height={20}></Icon>
//         </Button>
//     );
// }

// export default PlayPauseButton;
