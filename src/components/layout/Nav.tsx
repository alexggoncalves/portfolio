import { Link } from "react-router";

function Nav() {
    return (
        <>
            <nav>
                <Link to={"/"}>INDEX</Link>
                <Link to={"/projects"}>PROJECTS</Link>
                <Link to={"/contact"}>CONTACT</Link>
            </nav>
        </>
    );
}

export default Nav;
