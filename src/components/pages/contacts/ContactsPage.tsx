import "./ContactsPage.scss";

import ContactsWindow from "./ContactsWindow";
import TimeWindow from "./TimeWindow";
import LocationWindow from "./LocationWindow";

function ContactsPage() {
    return (
        <>
            <div className="contacts-page">
                <div className="contacts-page__windows">
                    <ContactsWindow />

                    <div className="contact-page__column">
                        <TimeWindow />
                        <LocationWindow />
                    </div>
                </div>

            </div>
        </>
    );
}

export default ContactsPage;
