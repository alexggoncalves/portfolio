import { Container, Fullscreen} from "@react-three/uikit";
import NavItem from "./NavItem";

function Nav() {
    return (
        <Fullscreen alignItems={"flex-start"} justifyContent={"flex-end"}>
            <Container
                flexDirection="row"
                gap={14}
                padding={18}
                positionTop={40}
                positionRight={40}
                renderOrder={100}
            >
                <NavItem route={"/"}>HOME</NavItem>
                <NavItem route={"/projects"}>PROJECTS</NavItem>
                <NavItem route={"/contacts"}>CONTACT</NavItem>
            </Container>
        </Fullscreen>
    );
}

export default Nav;
