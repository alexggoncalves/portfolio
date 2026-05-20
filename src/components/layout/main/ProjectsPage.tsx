function ProjectsPage() {
    return (
        <group position={[0, 0, 0]}>
            <pointLight position={[-1, 0, 3]} intensity={10} />
            <mesh position={[0, 1, 0]} rotation={[-0.3, 0.3, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={"blue"} />
            </mesh>
        </group>
    );
}

export default ProjectsPage;
