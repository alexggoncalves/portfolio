// import { Content } from "@react-three/uikit";
// import { createSquircleGeometry } from "../../../../utils/createSquircle";
// import { useMemo, useState } from "react";
// import { Text, useCursor, useMatcapTexture } from "@react-three/drei";

// function Button3D({
//     width,
//     height,
//     depth,
//     callBack,
// }: {
//     width: number;
//     height: number;
//     depth: number;
//     callBack: () => void;
// }) {
//     const [hovered, setHovered] = useState(false);

//     const [matcapIdle] = useMatcapTexture("7A7A7A_D0D0D0_BCBCBC_B4B4B4");
//     const [matcapHover] = useMatcapTexture("80CA23_B7EE37_D5FA4C_A3E434");

//     const squircle = useMemo(
//         () => createSquircleGeometry(width, height, height / 2, depth),
//         [width, height, depth],
//     );

//     useCursor(hovered);

//     return (
//         <Content>
//             {squircle && (
//                 <group>
//                     <mesh
//                         geometry={squircle}
//                         position={[0, 0, depth / 2]}
//                         onPointerOver={() => setHovered(true)}
//                         onPointerOut={() => setHovered(false)}
//                         onClick={callBack}
//                     >
//                         <meshMatcapMaterial
//                             matcap={hovered ? matcapHover : matcapIdle}
//                         />
//                     </mesh>
//                     <Text
//                         position={[0.2, 0, 1.5 * depth + 0.01]}
//                         fontWeight={800}
//                         color={hovered ? "green" : "black"}
//                     >
//                         {"SEE ALL  >"}
//                     </Text>
//                 </group>
//             )}
//         </Content>
//     );
// }

// export default Button3D;
