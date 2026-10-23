import { PerspectiveCamera, View } from "@react-three/drei";

function StarrySkyScene() {
    return (
        <View className="starry-sky__scene">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color={"grey"} />
            </mesh>
        </View>
    );
}

export default StarrySkyScene;