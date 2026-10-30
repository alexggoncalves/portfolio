import { useState } from "react";

import Window from "../../ui/Window";
import { ArrowUpRightIcon, CopyIcon, CurriculumIcon, DownloadIcon, GithubIcon, LinkedInIcon } from "../../ui/Icons";

const ContactsWindow = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText("contact@alexgg.com");

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1200);
    };

    return (
        <Window
            title="Contacts"
            headerLeft={<span>Contact</span>}
            headerRight={<div className="contacts__status">
                ONLINE
                <span className="contacts__status-dot" />
            </div>
            }
            className="contacts__window"
        >
            <div className="contact-page__text-container">
                <h1>Open for full-time opportunities.</h1>
                <p>Feel free to reach out!</p>
            </div>


            <div className="contact-page__email-section">
                <span>EMAIL ME AT:</span>
                <div className="contact-page__email">
                    <span >contact@alexgg.com</span>
                    <button
                        onClick={handleCopy}
                        className="button--pill"
                    >
                        <CopyIcon />
                        <span>Copy</span>
                        <span
                            className={`copy-msg ${copied ? "show" : ""}`}
                        >
                            Copied to clipboard!
                        </span>
                    </button>

                </div>

            </div>

            <div className="contact-page__links">
                <a
                    href="https://www.linkedin.com/in/alexggoncalves/"
                    target="_blank"
                    className="button button--icon-text"
                >
                    <div className="link__label">
                        <LinkedInIcon></LinkedInIcon>
                        <span>LinkedIn</span>
                    </div>

                    <ArrowUpRightIcon />
                </a>
                <a
                    href="https://github.com/alexggoncalves"
                    target="_blank"
                    className="button button--icon-text"
                >
                    <div className="link__label">
                        <GithubIcon></GithubIcon>
                        <span>Github</span>
                    </div>

                    <ArrowUpRightIcon />
                </a>

                <a
                    href="/download_test.pdf"
                    download="Alex_Goncalves_CV.pdf"
                    className="button button--icon-text"
                >
                    <div className="link__label">
                        <CurriculumIcon></CurriculumIcon>
                        <span>Download CV</span>
                    </div>

                    <DownloadIcon />
                </a>
            </div>
        </Window>
    )
}

export default ContactsWindow;