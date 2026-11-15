import { useEffect, useLayoutEffect, useRef } from "react"

// Scroll to top when the page changes (and offset the stars so they don't jump)
const useScrollReset = (...deps: unknown[]) => {
    const lastScrollY = useRef(0)

    useEffect(() => {
        const onScroll = () => { lastScrollY.current = window.scrollY }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useLayoutEffect(() => {
        const y = lastScrollY.current
        if (y) {
            const root = document.documentElement.style
            const prev = parseFloat(root.getPropertyValue("--star-shift")) || 0
            root.setProperty("--star-shift", `${prev - y}px`)
        }
        window.scrollTo({ top: 0, behavior: "instant" })
        lastScrollY.current = 0
    }, deps) 
}

export default useScrollReset;