import { Container, Text } from "@react-three/uikit";

function Placeholder({ label }: { label: string }) {
    return (
        <Container
            width={"100%"}
            height={"100%"}
            backgroundColor={"#1a1a1a"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Text fontSize={12} color={"grey"}>
                {label}
            </Text>
        </Container>
    );
}

export default Placeholder;
