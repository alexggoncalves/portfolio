import { Container } from "@react-three/uikit";
import type { ModelRecord } from "../../../../app/assets/assetLoaders";


function ModelView({ asset }: { asset: ModelRecord }) {
    const a = asset;
    a.id;

    
    return (
        <Container
            width={"100%"}
            height={"100%"}
            backgroundColor={"#1a1a1a"}
            justifyContent={"center"}
            alignItems={"center"}
        ></Container>
    );
}

export default ModelView;
