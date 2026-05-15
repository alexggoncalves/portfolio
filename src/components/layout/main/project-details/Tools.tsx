import { Container, Text } from "@react-three/uikit";
import Icon from "../general/Icon";

function Tools({ tools }: { tools: string[] }) {
    if (tools.length === 0) return null;

    return (
        <Container marginTop={20} flexDirection={"column"}>
            <Text color={"white"} fontSize={16} marginBottom={8}>
                TOOLS:
            </Text>
            <Container flexDirection={"row"} gap={10} alignItems={"center"}>
                {tools.map((toolId, index) => (
                    <Icon
                        key={`${index}-${toolId}`}
                        id={toolId}
                        height={40}
                    />
                ))}
            </Container>
        </Container>
    );
}

export default Tools;
