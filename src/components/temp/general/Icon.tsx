// import type { ComponentProps } from "react";
// import useAssetStore from "../../../app/assets/assetStore";
// import { getIconById } from "../../../app/assets/contentAssets";
// import { Container, Content } from "@react-three/uikit";

// type IconProps = Omit<ComponentProps<typeof Content>, "src"> & {
//     id: string;
//     size?: number;
//     width?: number | `${number}%`;
//     height?: number | `${number}%`;
// };

// function Icon({ id, size, width, height, ...props }: IconProps) {
//     const resolvedWidth = width ?? size ?? 16;
//     const resolvedHeight = height ?? size ?? 16;

//     const asset = useAssetStore((s) => s.globalAssets[id]);
//     const icon = getIconById(id);

//     const textureAspect = icon?.aspect ?? 1;

//     if (!asset || asset.type !== "icon" || !asset.texture)
//         return (
//             <Container width={resolvedWidth} height={resolvedHeight}></Container>
//         );

//     return (
//         <Content width={resolvedWidth} height={resolvedHeight} {...props}>
//             <mesh>
//                 <planeGeometry args={[textureAspect, 1]} />
//                 <meshBasicMaterial map={asset.texture} transparent />
//             </mesh>
//         </Content>
//     );
// }

// export default Icon;
