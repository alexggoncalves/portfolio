import type { ComponentProps, ReactNode } from "react";
import { Container } from "@react-three/uikit";

type ButtonProps = Omit<ComponentProps<typeof Container>, "src"> & {
    children: ReactNode;
    callBack: (e?: unknown) => void;
};

function Button({ children, callBack, ...props }: ButtonProps) {
    return (
        <Container
            transformOriginX="center"
            transformOriginY="center"
            transformScaleX={1}
            transformScaleY={1}
            hover={{ transformScaleX: 1.2, transformScaleY: 1.2 }}
            active={{ transformScaleX: 1, transformScaleY: 1 }}
            onClick={callBack}
            cursor={"pointer"}
            {...props}
        >
            {children}
        </Container>
    );
}

export default Button;
