import { useState } from "react";
import { CopyIcon, GithubIcon, LinkedInIcon } from "../general/Icons";
import "./contact.scss";

function ContactPage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText("contact@alexgg.com");

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1200);
    };

    return (
        <>
            <section className="contact-page">
                <div className="contact-page__email-section">
                    <span>EMAIL ME AT:</span>
                    <div className="contact-page__email-container">
                        <span>contact@alexgg.com</span>
                        <div
                            onClick={handleCopy}
                            className="button button--icon-sm"
                        >
                            <CopyIcon />
                            <span
                                className={`copy-msg ${copied ? "show" : ""}`}
                            >
                                Copied to clipboard!
                            </span>
                        </div>
                    </div>
                </div>

                <div className="contact-page__links-container">
                    <a
                        href="https://www.linkedin.com/in/alexggoncalves/"
                        target="_blank"
                        className="button button--icon-text"
                    >
                        <LinkedInIcon></LinkedInIcon>
                        <span>/alexggoncalves</span>
                    </a>
                    <a
                        href="https://github.com/alexggoncalves"
                        target="_blank"
                        className="button button--icon-text"
                    >
                        <GithubIcon></GithubIcon>
                        <span>/alexggoncalves</span>
                    </a>
                </div>

                <div className="contact-page__text-container">
                    <h1>OPEN FOR FULL TIME OPPORTUNITIES</h1>
                    <p>Feel free to reach out!</p>
                </div>
            </section>
        </>
    );
}

export default ContactPage;
