import Nav from "./Nav";
import Homepage from "./pages/homepage/Homepage";

function LayoutRoot() {
    return (
        <>
            <Nav />
            <main>
                <Homepage></Homepage>
            </main>
        </>
    );
}

export default LayoutRoot;
