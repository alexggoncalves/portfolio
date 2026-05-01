// extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

import { useThree } from "@react-three/fiber";
import ProjectsRow from "./ProjectsRow";

function HomepageLayout() {
    const { viewport } = useThree();
    return (
        <>
            <ProjectsRow height={2.5}></ProjectsRow>
        </>
        // Projects Row
    );
}

export default HomepageLayout;
