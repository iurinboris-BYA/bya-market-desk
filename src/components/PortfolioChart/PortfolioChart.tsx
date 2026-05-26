import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./PortfolioChart.css";
import { portfolioMockData } from "./mockData";
import type { ChartPeriod, PortfolioChartProps, PortfolioPoint } from "./types";

const PERIODS: Array<{ label: string; value: ChartPeriod }> = [
  { label: "1 Day", value: "1D" },
  { label: "3 Year", value: "3Y" },
  { label: "Year To Date", value: "YTD" },
  { label: "All", value: "ALL" },
];

const PERIOD_TITLES: Record<ChartPeriod, string> = {
  "1D": "Portfolio 1 Day Chart",
  "3Y": "Portfolio 3 Year Chart",
  YTD: "Portfolio Year To Date Chart",
  ALL: "Portfolio All Time Chart",
};

interface ChartDatum extends PortfolioPoint {
  periodPL: number;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return formatCurrency(value);
}

export function formatDateLabel(timestamp: number, period: ChartPeriod): string {
  const date = new Date(timestamp);
  if (period === "1D") {
    return date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  if (period === "3Y" || period === "ALL") {
    return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
  }
  return date.toLocaleString("en-US", { day: "2-digit", month: "short" });
}

function formatTooltipDate(timestamp: number, period: ChartPeriod): string {
  const date = new Date(timestamp);
  if (period === "1D") {
    return date.toLocaleString("en-US", { day: "2-digit", hour: "2-digit", minute: "2-digit", month: "short" });
  }
  return date.toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function toChartData(points: PortfolioPoint[]): ChartDatum[] {
  const startValue = points[0]?.value ?? 0;
  return points.map((point) => ({
    ...point,
    periodPL: point.value - startValue,
  }));
}

function PortfolioTooltip({ active, label, payload, period }: any & { period: ChartPeriod }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload as ChartDatum;
  const periodPL = point.periodPL;

  return (
    <div className="cc-portfolio-chart-tooltip">
      <div>
        <span>Date</span>
        <strong>{formatTooltipDate(Number(label), period)}</strong>
      </div>
      <div>
        <span>Portfolio Value</span>
        <strong>{formatCurrency(point.value)}</strong>
      </div>
      <div>
        <span>Period P/L</span>
        <strong className={periodPL >= 0 ? "cc-positive" : "cc-negative"}>
          {periodPL >= 0 ? "+" : ""}
          {formatCurrency(periodPL)}
        </strong>
      </div>
    </div>
  );
}

export default function PortfolioChart({
  initialPeriod = "1D",
  currency = "USD",
  onAdvancedChart,
  onOpenPositions,
  onPeriodPL,
}: PortfolioChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>(initialPeriod);
  const rawPoints = portfolioMockData[period];

  const { chartData, currentValue, maxPoint, minPoint, periodPL } = useMemo(() => {
    const data = toChartData(rawPoints);
    const min = data.reduce((lowest, point) => (point.value < lowest.value ? point : lowest), data[0]);
    const max = data.reduce((highest, point) => (point.value > highest.value ? point : highest), data[0]);
    const current = data.at(-1)?.value ?? 0;
    const start = data[0]?.value ?? current;

    return {
      chartData: data,
      currentValue: current,
      maxPoint: max,
      minPoint: min,
      periodPL: current - start,
    };
  }, [rawPoints]);

  return (
    <section className="cc-portfolio-chart-card" aria-label={PERIOD_TITLES[period]}>
      <header className="cc-portfolio-chart-topbar">
        <div>
          <h2>{PERIOD_TITLES[period]}</h2>
          <p>
            Current value {formatCurrency(currentValue)} {currency} · Period P/L{" "}
            <span className={periodPL >= 0 ? "cc-positive" : "cc-negative"}>
              {periodPL >= 0 ? "+" : ""}
              {formatCurrency(periodPL)}
            </span>
          </p>
        </div>
        <div className="cc-portfolio-chart-actions" aria-label="Portfolio actions">
          <button type="button" onClick={onOpenPositions}>
            Open Positions
          </button>
          <button type="button" onClick={onPeriodPL}>
            Period P/L
          </button>
          <button type="button" onClick={onAdvancedChart}>
            Advanced Chart
          </button>
        </div>
      </header>

      <div className="cc-portfolio-chart-plot">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ bottom: 12, left: 4, right: 82, top: 18 }}>
            <defs>
              <linearGradient id="portfolioChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-fill)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--chart-fill)" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8f0f8" vertical={false} />
            <XAxis
              dataKey="timestamp"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => formatDateLabel(Number(value), period)}
              tickLine={false}
              type="number"
            />
            <YAxis
              domain={["dataMin - 4000", "dataMax + 4000"]}
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
              tickLine={false}
              width={74}
            />
            <Tooltip content={<PortfolioTooltip period={period} />} />
            <ReferenceLine y={maxPoint.value} stroke="var(--green)" strokeDasharray="4 4" />
            <ReferenceLine y={minPoint.value} stroke="var(--red)" strokeDasharray="4 4" />
            <Area
              activeDot={{ fill: "#ffffff", r: 5, stroke: "var(--chart-line)", strokeWidth: 3 }}
              dataKey="value"
              dot={false}
              fill="url(#portfolioChartFill)"
              isAnimationActive={false}
              stroke="var(--chart-line)"
              strokeWidth={2.5}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
        <span className="cc-portfolio-chart-badge max">{formatCompactCurrency(maxPoint.value)}</span>
        <span className="cc-portfolio-chart-badge min">{formatCompactCurrency(minPoint.value)}</span>
      </div>

      <footer className="cc-portfolio-chart-periods" aria-label="Chart period">
        {PERIODS.map((item) => (
          <button
            className={item.value === period ? "active" : ""}
            key={item.value}
            onClick={() => setPeriod(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </footer>
    </section>
  );
}
