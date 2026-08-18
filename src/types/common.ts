/** ISO date string, day precision: "YYYY-MM-DD". Always local calendar day. */
export type DateKey = string;

/** ISO datetime string produced by `new Date().toISOString()`. */
export type Timestamp = string;

export type ThemeMode = 'light' | 'dark' | 'system';

export type UnitSystem = 'metric' | 'imperial';

export type Intensity = 'low' | 'medium' | 'high';
