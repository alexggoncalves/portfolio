import { Container, Text } from "@react-three/uikit";
import { type TeamMember } from "../../../app/assets/contentAssets";

function Team({ team }: { team: TeamMember[] }) {
    return (
        <>
            {/* Tools */}
            <Container marginTop={20}>
                <Text color={"white"} fontSize={16} marginBottom={10}>
                    TEAM:
                </Text>
                <Container>
                    {team.map(() => (
                        <></>
                    ))}
                </Container>
            </Container>
        </>
    );
}

export default Team;
