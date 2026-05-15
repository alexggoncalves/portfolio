import { Container, Text } from "@react-three/uikit";
import { useMemo, useRef } from "react";
import { getTagById } from "../../../app/assets/contentAssets";
import { useFrame } from "@react-three/fiber";

function CardTag({ tagId, isActive }: { tagId: string; isActive: boolean }) {
    const tag = useMemo(() => getTagById(tagId), [tagId]);

    const containerRef = useRef<any>(null);
    const opacity = useRef(0);

    useFrame((_, _delta) => {
        const container = containerRef.current;
        if (!container) return;

        const target = isActive ? 1 : 0;

        opacity.current += (target - opacity.current) * 0.15;

        container.setProperties({
            opacity: opacity.current,
        });
    });

    if (!tag) return null;

    return (
        <Container>
            <Container
                height={"100%"}
                opacity={1}
                positionType={"absolute"}
                positionRight={-3}
                positionTop={-2}
                alignSelf={"center"}
            >
                <Text
                    fontSize={34}
                    color={isActive ? "#ffffff" : tag.color}
                    transformRotateZ={45}
                    textAlign={"center"}
                    fontWeight={isActive ? 100 : 500}
                >
                    +
                </Text>
            </Container>

            <Container
                ref={containerRef}
                paddingY={2}
                paddingLeft={8}
                paddingRight={24}
                flexShrink={0}
                alignSelf="flex-end"
                backgroundColor={tag.color}
                borderRadius={10}
                positionRight={-4}
            >
                <Text
                    wordBreak="keep-all"
                    fontSize={12}
                    color={tag.textColor}
                    fontWeight={500}
                >
                    {tag.name.toUpperCase()}
                </Text>
            </Container>
        </Container>
    );
}

export default CardTag;
