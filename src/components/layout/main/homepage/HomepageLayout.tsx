import ProjectsRow from "./ProjectsRow";

function HomepageLayout() {
    return (
        <>
            <pointLight position={[-1, 0, 3]} intensity={10} />
            <mesh position={[0, 1, 0]} rotation={[-0.3, 0.3, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={"red"} />
            </mesh>
            <ProjectsRow height={2.5}></ProjectsRow>
        </>
    );
}

export default HomepageLayout;
