import type { ReactNode } from "react";

type PanelToggle = {
    icon: ReactNode;
    label: string;
    count?: number;
    active?: boolean;
    onClick?: () => void;
}

export const PanelToggle = ({icon, label, count, active = false, onClick  }: PanelToggle) => {
    return (
         <button
            type="button"
            className={`button--pill ${active ? "active" : ""}`}
            onClick={onClick}
            aria-expanded={active}
        >
            {icon}
            <span>{label}</span>
            {count !== undefined && (
                <>
                    <span aria-hidden="true">•</span>
                    <span>{count}</span>
                </>
            )}
        </button>
    );
}

type ExternalLinkProps = {
    children: ReactNode
    href?: string;
    label: string;
};

export const ExternalLink = ({ children, href, label }: ExternalLinkProps) => {
    if (!href) return null;

    return (
        <a
            className="button--icon"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
            title={label}
        >
            {children}
        </a>
    );
}
