import { HomePage } from "../components/pages/HomePage";
import { WorkPage } from "../components/pages/WorksPage";
import { ContactsPage } from "../components/pages/ContactsPage";
import { WorkDetailsPage } from "../components/pages/WorkDetailsPage";
import type { Work } from "../stores/assetStore";
import { Page } from "../components/pages/layout/Page";

//------------------------------------------------------------------------
// Create ASCII page: Initilializes an instance of the page to load
//-----------------------------------------------------------------------
function createPage(
    scene: string,
    isMobile: boolean,
    goTo: (path: string) => void,
    works: Work[],
): Page {
    let page;

    if (scene == "") {
        // Homepage
        page = new HomePage(works,isMobile,goTo);
    } else if (scene == "contacts") {
        // Contacts page
        page = new ContactsPage(isMobile,goTo);

    } else if (scene.startsWith("work")) {
        // Work  (".../work" and ".../work/:workId")
        const parts = scene.split("/");

        if (parts[1]) {
            // If there is a workID open work details, else open works page
            const work = works.find((work) => work.id == parts[1]);
            if (work) {
                page = new WorkDetailsPage(work, goTo, isMobile);                
            } else {
                // NOT FOUND !! (Not implemented)
                page = new HomePage(works,isMobile,goTo); // TEMP
            }
        } else {
            page = new WorkPage(works,isMobile,goTo);
        }
    } else {
        // NOT FOUND PAGE!! (Not implemented)
        page = new HomePage(works,isMobile,goTo);
    }

    // Initialize opacity for fade transition
    page.opacity = 0;
    page.targetOpacity = 1;
    page.fadeSpeed = 5;

    return page;
}

export default createPage;
