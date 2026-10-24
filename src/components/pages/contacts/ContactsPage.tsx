import "./contacts.scss";
import Window from "../../general/Window";
import Contacts from "./Contacts";
import Time from "./Time";
import Location from "./Location";
import { ClockIcon, PhoneIcon, PinIcon } from "../../general/Icons";

function ContactsPage() {
    return (
        <>
            <div className="contacts-page">
                <div className="contacts-page__windows">
                    <Window
                        title="Contacts"
                        headerLeft={<span>Contact</span>}
                        headerRight={<PhoneIcon className='window-header__icon' width={20} height={20}/>}
                        className="contacts__window"
                    >
                        <Contacts></Contacts>
                    </Window>

                    <div className="contact-page__column">
                        <Window
                            title="Local time"
                            headerLeft={<span>Local time</span>}
                            headerRight={<ClockIcon className='window-header__icon' width={20} height={20}/>}
                            className="time__window"
                        >
                            <Time />
                        </Window>
                        <Window
                            title="Location"
                            headerLeft={<span>Based in</span>}
                            headerRight={<PinIcon className='window-header__icon' width={20} height={20}/>}
                            className="location__window"
                        >
                            <Location />
                        </Window>
                    </div>
                </div>

            </div>
        </>
    );
}

export default ContactsPage;
