"use client";

import { useEffect, useState } from "react";

function parseTargetDate(eventDate: string, eventTime: string | null): Date {
  let hours = 0;
  let minutes = 0;

  const match = eventTime?.match(/(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toLowerCase().replace(/\./g, "");
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  }

  const target = new Date(`${eventDate}T00:00:00`);
  target.setHours(hours, minutes, 0, 0);
  return target;
}

function getRemaining(target: Date) {
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return null;
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown({
  eventDate,
  eventTime,
  size = "sm",
}: {
  eventDate: string;
  eventTime: string | null;
  size?: "sm" | "lg";
}) {
  const target = parseTargetDate(eventDate, eventTime);
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.getTime()]);

  if (!remaining) return null;

  const units = [
    { label: "días", value: remaining.days },
    { label: "hrs", value: remaining.hours },
    { label: "min", value: remaining.minutes },
    { label: "seg", value: remaining.seconds },
  ];

  if (size === "lg") {
    return (
      <div className="flex justify-center divide-x divide-gold/30">
        {units.map(({ label, value }) => (
          <div key={label} className="px-4 text-center sm:px-8 lg:px-10">
            <p className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ivory/60 sm:text-xs">
              {label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="min-w-14 rounded-xl border border-gold/30 bg-ivory px-2 py-2 text-center"
        >
          <p className="font-display text-xl text-gold-deep">{value}</p>
          <p className="text-[10px] uppercase tracking-wide text-olive-light">{label}</p>
        </div>
      ))}
    </div>
  );
}
