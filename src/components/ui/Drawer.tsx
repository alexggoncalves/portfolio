import "./Drawer.scss"

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import useMediaQuery from "../../utils/useMediaQuery";

const DRAG_THRESHOLD = 6; // px a press has to move before it counts as a drag
const SNAP_DISTANCE = 60; // px dragged before letting go switches state

interface DragState {
    active: boolean;
    moved: boolean;
    startY: number;
    lastY: number;
    startOffset: number;
    maxOffset: number;
}

const initialDragState: DragState = {
    active: false,
    moved: false,
    startY: 0,
    lastY: 0,
    startOffset: 0,
    maxOffset: 0
}

type DrawerProps = {
    children: ReactNode;
    header: ReactNode;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    peek?: boolean;
}

const Drawer = ({ children, header, className = "", open, onOpenChange, peek = true }: DrawerProps) => {
    const isSide = useMediaQuery("(max-height: 500px)"); // Open from the side for short screens
    
    const [innerOpen, setInnerOpen] = useState(false);
    const expanded = open ?? innerOpen;

    const drawerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null)
    const drag = useRef<DragState>(initialDragState);

    // Buttons in the header are in control instead of closing/opening of the drawer
    const isControl = (target: EventTarget) =>
        (target as Element).closest("a, button:not(.drawer__handle)") !== null;


    const setOpen = (next: boolean) => {
        if (open === undefined) setInnerOpen(next);
        onOpenChange?.(next);

        // Scroll body to the top
        if (!next) bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isSide || isControl(e.target)) return;
        setOpen(!expanded);
    }

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        const drawer = drawerRef.current;
        if (!drawer || isSide || e.button !== 0 || isControl(e.target)) return;

        const maxOffset = peek
            ? drawer.offsetHeight - e.currentTarget.offsetHeight
            : drawer.offsetHeight;

        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = {
            active: true,
            moved: false,
            startY: e.clientY,
            lastY: e.clientY,
            startOffset: expanded ? 0 : maxOffset,
            maxOffset,
        };
        drawer.classList.add("drawer--dragging");
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        const drawer = drawerRef.current;
        if (!drawer || !d.active) return;

        d.lastY = e.clientY;
        const dy = e.clientY - d.startY;
        if (Math.abs(dy) > DRAG_THRESHOLD) d.moved = true;

        // follow the finger, clamped between open and collapsed
        const offset = Math.min(Math.max(d.startOffset + dy, 0), d.maxOffset);
        drawer.style.transform = `translateY(${offset}px)`;
    }

    const endDrag = () => {
        const d = drag.current;
        const drawer = drawerRef.current;
        if (!d.active || !drawer) return;

        d.active = false;
        drawer.classList.remove("drawer--dragging");
        drawer.style.transform = "";

        if (!d.moved) return;
        const dy = d.lastY - d.startY;
        if (!expanded && dy < -SNAP_DISTANCE) setOpen(true);
        if (expanded && dy > SNAP_DISTANCE) setOpen(false);
    };

    // Set header peek height so the media viewer can sit on top of it
    useEffect(() => {
        if (!peek) return;
        const header = headerRef.current;
        const parent = drawerRef.current?.parentElement;
        if (!header || !parent) return;

        const observer = new ResizeObserver(() => {
            parent.style.setProperty("--peek-height", `${header.offsetHeight}px`)
        })
        observer.observe(header);

        return () => {
            observer.disconnect();
            parent.style.removeProperty("--peek-height");
        };
    }, [peek])

    return (<>
        {!peek && (
            <div
                className={`drawer__backdrop ${expanded ? "drawer__backdrop--visible" : ""}`}
                onClick={() => setOpen(false)}
            />
        )}
        <div
            ref={drawerRef}
            className={`drawer ${peek ? "" : "drawer--hidden"} ${isSide ? "drawer--side" : ""} ${expanded ? "drawer--expanded" : ""} ${className}`}
            inert={!peek && !expanded} // hidden drawer can't be tabbed into
        >
            <div
                ref={headerRef}
                className="drawer__header"
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                <button
                    type="button"
                    className="drawer__handle"
                />
                {header}
            </div>
            <div
                ref={bodyRef}
                className="drawer__body"
            >
                {children}
            </div>
        </div>
    </>
    )
}

export default Drawer;