import { Link, type LinkProps } from "react-router";
import type { MouseEvent } from "react";
import usePageNavigate from "../../hooks/usePageNavigate";

type PageLinkProps = Omit<LinkProps, "to"> & { to: string };

function PageLink({ to, onClick, ...props }: PageLinkProps) {
    const pageNavigate = usePageNavigate();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // let ctrl/cmd/shift/middle clicks open a new tab as usual
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        e.preventDefault();
        pageNavigate(to);
    };

    return <Link {...props} to={to} onClick={handleClick} />;
}

export default PageLink;