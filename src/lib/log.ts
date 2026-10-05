// Structured logging: one JSON object per line, which Vercel's log viewer can search and filter.
// No dependencies; swap in a logging service later by changing this file only.

export type LogLevel = "info" | "warn" | "error";
export type LogFields = Record<string, unknown>;
export type Logger = (level: LogLevel, event: string, fields?: LogFields) => void;

export function createLogger(scope: string, base: LogFields = {}): Logger {
  return (level, event, fields = {}) => {
    const line = JSON.stringify({ level, scope, event, ...base, ...fields, time: new Date().toISOString() });
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  };
}

export const silentLogger: Logger = () => {};
