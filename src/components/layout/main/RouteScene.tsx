import { useMemo } from "react";
import { matchPath } from "react-router-dom";
import HomepageLayout from "./homepage/HomepageLayout";
import ProjectDetailsPage from "./project-details/ProjectDetailsPage";
import ProjectsPage from "./ProjectsPage";

interface RouteInfo {
    isHome: boolean;
    isProjectsRoot: boolean;
    isProjectDetail: boolean;
    projectId: string;
}

function parseRoute(path: string): RouteInfo {
    const projectMatch = matchPath({ path: "/projects/:projectId" }, path);
    const projectId = projectMatch?.params?.projectId ?? "";
    return {
        isHome: path === "/",
        isProjectsRoot: path === "/projects",
        isProjectDetail: !!projectId,
        projectId,
    };
}

function RouteScene({ path }: { path: string }) {
    const route = useMemo(() => parseRoute(path), [path]);
    const isFallback = !route.isHome && !route.isProjectsRoot && !route.isProjectDetail;

    return (
        <group>
            {route.isHome && <HomepageLayout />}
            {route.isProjectsRoot && <ProjectsPage />}
            {route.isProjectDetail && (
                <ProjectDetailsPage projectId={route.projectId} />
            )}
            {isFallback && <HomepageLayout />}
        </group>
    );
}

export default RouteScene;