import "./Footer.scss"

import { ExternalLink } from "../ui/Buttons";
import { GithubIcon } from "../ui/Icons";

function Footer() {
    return (
        <footer>
            <div className="footer__left">
                <span>Alexandre Gonçalves</span>
                <span aria-hidden={true}> • </span>
                <span>2026</span>
            </div>

            <div className="footer__right">
                <span>Built with React and R3F</span>

                <span aria-hidden={true}>•</span>

                <ExternalLink href={"https://github.com/alexggoncalves/portfolio"} label="Source code on Github">
                    <GithubIcon />
                </ExternalLink>

            </div>

        </footer>
    );
}

export default Footer;
