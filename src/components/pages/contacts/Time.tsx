import { useEffect, useState } from "react";

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

const Time = () => {
    const [date, setDate] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { time, weekday, day, month } = getLisbonParts(date);

    return (
        <time dateTime={date.toISOString()} aria-label={`Lisbon time: ${longFormatter.format(date)}`}>
            <div className="time__clock" aria-hidden="true">{time}</div>

            <div className="time__date" aria-hidden="true">
                <span>{weekday}</span>
                <span>•</span>
                <span>{day}</span>
                <span>{month}</span>
            </div>
        </time>
    );
};

export default Time;