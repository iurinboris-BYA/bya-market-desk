import type { ChartPeriod, PortfolioPoint } from "./types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function makeSeries(
  start: number,
  count: number,
  stepMs: number,
  base: number,
  trend: number,
  wave: number,
  dip = 0,
): PortfolioPoint[] {
  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(count - 1, 1);
    const cycle = Math.sin(progress * Math.PI * 3.2) * wave;
    const micro = Math.sin(index * 0.73) * wave * 0.22;
    const midDip = dip * Math.exp(-Math.pow((progress - 0.54) / 0.12, 2));

    return {
      timestamp: start + index * stepMs,
      value: Math.round(base + trend * progress + cycle + micro - midDip),
    };
  });
}

const now = new Date(2026, 4, 25, 16, 0, 0).getTime();
const dayStart = new Date(2026, 4, 25, 0, 0, 0).getTime();
const yearStart = new Date(2026, 0, 1, 0, 0, 0).getTime();

export const portfolioMockData: Record<ChartPeriod, PortfolioPoint[]> = {
  "1D": makeSeries(dayStart, 96, 15 * 60 * 1000, 1_366_500, 10_500, 5_800, 23_500),
  "3Y": makeSeries(now - 3 * 365 * DAY, 156, 7 * DAY, 820_000, 520_000, 48_000, 86_000),
  YTD: makeSeries(yearStart, 120, Math.round((now - yearStart) / 119), 1_115_000, 250_000, 32_000, 48_000),
  ALL: makeSeries(now - 5 * 365 * DAY, 180, 10 * DAY, 440_000, 930_000, 62_000, 105_000),
};
