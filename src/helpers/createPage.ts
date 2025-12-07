import { HomePage } from "../components/Pages/HomePage";
import { WorkPage } from "../components/Pages/WorkPage";
import { ContactsPage } from "../components/Pages/ContactsPage";
import { WorkDetailsPage } from "../components/Pages/WorkDetailsPage";
import type { Work } from "../stores/contentStore";
import { Page } from "../components/PageRenderer/Page";

//------------------------------------------------------------------------
// Create ASCII page: Initilializes an instance of the page to load
//-----------------------------------------------------------------------
function createPage(
    scene: string,
    isMobile: boolean,
    goTo: (path: string) => void,
    works: Work[]
): Page {
    let page;

    if (scene == "") {
        // Homepage
        page = new HomePage();
        page.init(isMobile);
    } else if (scene == "contacts") {
        // Contacts page
        page = new ContactsPage();
        page.init(isMobile);
    } else if (scene.startsWith("work")) {
        // Work
        //[".../work"] and [".../work/:workId]"
        const parts = scene.split("/");

        if (parts[1]) {
            // If there is a workID open work details, else open works page
            const work = works.find((work) => work.id == parts[1]);
            if (work) {
                const workDetailsPage = new WorkDetailsPage(work, goTo);
                workDetailsPage.init(isMobile);
                page = workDetailsPage;
            } else {
                // NOT FOUND !! (Not implemented)
                page = new HomePage();
                page.init(isMobile);
            }
        } else {
            const workPage = new WorkPage(works, goTo);
            workPage.init();
            page = workPage;
        }
    } else {
        // NOT FOUND PAGE!! (Not implemented)
        page = new HomePage();
        page.init(isMobile);
    }

    // Initialize opacity for fade transition
    page.opacity = 0;
    page.targetOpacity = 1;
    page.fadeSpeed = 5;

    return page;
}

export default createPage;