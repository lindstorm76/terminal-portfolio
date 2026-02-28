import { useEffect, useRef } from "react";
import {
  useHistory,
  type LinePart,
  type LineStyle,
} from "../providers/HistoryContext";

type BootLine = {
  time: number;
  text: string;
  timestamp?: boolean;
  style?: LineStyle;
};

const BOOT_SEQUENCE: BootLine[] = [
  { time: 0.0, text: "Initializing system kernel...", timestamp: true },
  {
    time: 0.013,
    text: "Loading modules: crypt0, rootkit, shadow",
    timestamp: true,
  },
  { time: 0.066, text: "Mounting /dev/anonymous", timestamp: true },
  { time: 0.101, text: "Injecting entropy into pool...", timestamp: true },
  { time: 0.404, text: "Establishing secure tunnel...", timestamp: true },
  { time: 0.733, text: "Bypassing firewall...", timestamp: true },
  { time: 1.337, text: "Access granted.", timestamp: true },
  { time: 2.2, text: "\u00A0", timestamp: false },
  {
    time: 2.3,
    text: "-----------------------------------------",
    timestamp: false,
  },
  {
    time: 2.4,
    text: "        WELCOME TO FSOCIETY NODE",
    timestamp: false,
  },
  {
    time: 2.5,
    text: "-----------------------------------------",
    timestamp: false,
  },
];

function formatTimestamp(time: number): string {
  return `[${time.toFixed(4).padStart(7, " ")}]`;
}

export function useBootSequence(onComplete?: () => void) {
  const { addLine, clear } = useHistory();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    clear();

    const lastTime = Math.max(...BOOT_SEQUENCE.map((l) => l.time));

    BOOT_SEQUENCE.forEach((line) => {
      const timer = setTimeout(() => {
        const parts: LinePart[] = [];

        if (line.timestamp) {
          parts.push({
            text: `${formatTimestamp(line.time)} `,
            style: "system" as LineStyle,
          });
        }

        parts.push({ text: line.text });

        addLine(parts);
      }, line.time * 1000);

      timers.current.push(timer);
    });

    const doneTimer = setTimeout(() => {
      onComplete?.();
    }, lastTime * 1000);
    timers.current.push(doneTimer);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);
}
