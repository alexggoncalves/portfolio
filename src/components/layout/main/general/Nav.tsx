import { Container, Fullscreen, Text } from "@react-three/uikit";

function Nav({}: {}) {
    return (
        <Fullscreen alignItems={"flex-start"} justifyContent={"flex-end"}>
            <Container
                gap={20}
                positionTop={50}
                positionRight={50}
                renderOrder={100}
            >
                <Text color={"white"}>HOME</Text>
                <Text color={"white"}>PROJECTS</Text>
                <Text color={"white"}>CONTACTS</Text>
            </Container>
        </Fullscreen>
    );
}

export default Nav;
