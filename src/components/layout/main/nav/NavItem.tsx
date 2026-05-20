import { Text } from "@react-three/uikit";
import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router";

function NavItem({ children, route }: { children: ReactNode; route: string }) {
    const navigate = useNavigate();

    const navigateTo = useCallback(() => {
        navigate(route);
    }, [navigate]);

    return (
        <Text
            color="white"
            fontSize={14}
            letterSpacing={2}
            opacity={1}
            cursor="pointer"
            onClick={navigateTo}
        >
            {children}
        </Text>
    );
}

export default NavItem;
