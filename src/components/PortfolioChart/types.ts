export type ChartPeriod = "1D" | "3Y" | "YTD" | "ALL";

export interface PortfolioPoint {
  timestamp: number;
  value: number;
}

export interface PortfolioChartProps {
  initialPeriod?: ChartPeriod;
  currency?: string;
  onOpenPositions?: () => void;
  onPeriodPL?: () => void;
  onAdvancedChart?: () => void;
}
