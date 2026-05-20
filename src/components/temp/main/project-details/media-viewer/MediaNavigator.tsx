// import { Container, Text } from "@react-three/uikit";

// import Icon from "../../general/Icon";
// import type { AssetRecord } from "../../../../app/assets/assetLoaders";
// import Button from "../../general/Button";

// function MediaNavigator({
//     assets,
//     currentIndex,
//     setCurrentIndex,
// }: {
//     assets: AssetRecord[];
//     currentIndex: number;
//     setCurrentIndex: (index: number) => void;
// }) {
//     const next = () => {
//         let newIndex = currentIndex + 1;

//         if (newIndex >= assets.length) newIndex = 0;

//         setCurrentIndex(newIndex);
//     };

//     const previous = () => {
//         let newIndex = currentIndex - 1;
//         if (newIndex < 0) newIndex = assets.length - 1;
//         setCurrentIndex(newIndex);
//     };

//     const setIndex = (index: number) => {
//         setCurrentIndex(index);
//     };

//     return (
//         <>
//             {/* Media Navigator */}
//             <Container
//                 positionType={"absolute"}
//                 justifyContent={"center"}
//                 alignItems={"center"}
//                 positionBottom={-35}
//                 width={ "100%"}
//             >
//                 <Button callBack={previous} marginRight={10} padding={2}>
//                     {/* <Icon id={"play"} transformRotateZ={180} /> */}
//                     <Text color={"white"}>{"<"}</Text>
//                 </Button>

//                 <Container
//                     backgroundColor={"white"}
//                     opacity={0.1}
//                     gap={10}
//                     justifyContent={"center"}
//                     alignItems={"center"}
//                     paddingX={15}
//                     paddingY={4}
//                     borderRadius={20}
//                 >
//                     {assets?.map((asset, index) => {
//                         return (
//                             <Button
//                                 callBack={() => {
//                                     setIndex(index);
//                                 }}
//                                 padding={2}
//                                 key={index}
//                             >
//                                 {asset.type === "video" ? (
//                                     <Icon
//                                         id={"play"}
//                                         size={12}
//                                         opacity={
//                                             currentIndex === index ? 0.7 : 0.2
//                                         }
//                                     ></Icon>
//                                 ) : asset.type === "image" ? (
//                                     <Container
                                        
//                                         backgroundColor={"white"}
//                                         borderRadius={4}
//                                         width={8}
//                                         height={8}
//                                         opacity={
//                                             currentIndex === index ? 0.7 : 0.2
//                                         }
//                                     ></Container>
//                                 ) : (
//                                     <Container
//                                         backgroundColor={"blue"}
//                                         width={10}
//                                         height={10}
//                                         opacity={
//                                             currentIndex === index ? 0.7 : 0.2
//                                         }
//                                     ></Container>
//                                 )}
//                             </Button>
//                         );
//                     })}
//                 </Container>

//                 <Button callBack={next} marginLeft={10} padding={2}>
//                     {/* <Icon id={"play"} /> */}
//                     <Text color={"white"}>{">"}</Text>
//                 </Button>
//             </Container>
//         </>
//     );
// }

// export default MediaNavigator;
