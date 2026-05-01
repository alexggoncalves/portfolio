import { HomePage } from "../components/OLD/pages/HomePage";
import { ProjectPage } from "../components/OLD/elements/projects/ProjectsPage";
import { ContactsPage } from "../components/OLD/pages/ContactsPage";
import { ProjectDetailsPage } from "../components/OLD/elements/projects/ProjectDetailsPage";
import { Page } from "../components/OLD/elements/core/Page";

import { getProjectById, projects } from "../components/app/assets/contentAssets";
import { buildPageAssets, requestAssets } from "../components/app/assets/assetStream";

//------------------------------------------------------------------------
// Create ASCII page: Initilializes an instance of the page to load
//-----------------------------------------------------------------------
function createPage(
    scene: string,
    goTo: (path: string) => void,
): Page {
    let page;

    if (scene == "") {
        // Homepage
        page = new HomePage(projects, goTo);
    } else if (scene == "contacts") {
        // Contacts page
        page = new ContactsPage(goTo);
    } else if (scene.startsWith("projects")) {
        // Projects  (".../projects" and ".../projects/:workId")
        const parts = scene.split("/");

        if (parts[1]) {
            // If there is a workID open work details, else open works page
            const project = getProjectById(parts[1]);
            if (project) {
                requestAssets(buildPageAssets(project.id));
                page = new ProjectDetailsPage(project, goTo);
            } else {
                // NOT FOUND !! (Not implemented)
                page = new HomePage(projects, goTo); // TEMP
            }
        } else {
            page = new ProjectPage(projects, goTo);
        }
    } else {
        // NOT FOUND PAGE!! (Not implemented)
        page = new HomePage(projects, goTo);
    }

    // Initialize opacity for fade transition
    // page.opacity = 0;
    // page.targetOpacity = 1;
    // page.fadeSpeed = 5;

    return page as Page;
}

export default createPage;
