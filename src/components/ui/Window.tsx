import "./Window.scss";
import type { ReactNode } from "react";

type WindowProps = {
    title: string;
    children: ReactNode;
    headerLeft: ReactNode;
    headerRight?: ReactNode;
    className?: string;
}

function Window({ title, headerLeft, headerRight, children, className = "" }: WindowProps) {
    return (
        <section className={`window ${className}`} aria-label={title}>
            <div className="window__header">

                <div className="window__header-left">{headerLeft}</div>
                {headerRight && <div className="window__header-right">{headerRight}</div>}
            </div>

            <div className="window__content">
                {children}
            </div>
        </section>
    );
}

export default Window;
