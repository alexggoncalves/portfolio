import { useEffect, useState } from "react";

import Window from "../../ui/Window";
import { ClockIcon } from "../../ui/Icons";

const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
});

const longFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
});

const getLisbonParts = (date: Date) => {
    const parts = formatter.formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";

    return {
        time: `${get("hour")}:${get("minute")}`,
        weekday: get("weekday"),
        day: get("day"),
        month: get("month"),
    };
}

const TimeWindow = () => {
    const [date, setDate] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { time, weekday, day, month } = getLisbonParts(date);

    return (
        <Window
            title="Local time"
            headerLeft={<span>Local time</span>}
            headerRight={<ClockIcon className='window-header__icon'/>}
            className="time__window"
        >
            <time dateTime={date.toISOString()} aria-label={`Lisbon time: ${longFormatter.format(date)}`}>
                <div className="time__clock" aria-hidden="true">{time}</div>

                <div className="time__date" aria-hidden="true">
                    <span>{weekday}</span>
                    <span>•</span>
                    <span>{day}</span>
                    <span>{month}</span>
                </div>
            </time>
        </Window>

    );
};

export default TimeWindow;