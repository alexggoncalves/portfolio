import { PerspectiveCamera, View } from "@react-three/drei";

function HeroScene() {
    return (
        <View className="hero__scene">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial />
            </mesh>
        </View>
    );
}

export default HeroScene;
