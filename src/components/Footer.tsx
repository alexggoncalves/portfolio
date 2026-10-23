import { ExternalLink } from "./general/Buttons";
import { GithubIcon } from "./general/Icons";

function Footer() {
    return (
        <footer>
            <div className="footer__left">
                <span>2026</span>
                <span aria-hidden={true}> • </span>
                <span>Alexandre Gonçalves</span>
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
