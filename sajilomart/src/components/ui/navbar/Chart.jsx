"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  {
    month: "January",
    mobile: 80,
    monitor: 120,
    laptop: 160,
    desktop: 100,
    camera: 90,
    Ram: 70,
    speaker: 60,
    headphone: 50,
    mouse: 40,
    keyboard: 30,
  },
  {
    month: "February",
    mobile: 200,
    monitor: 140,
    laptop: 220,
    desktop: 150,
    camera: 130,
    Ram: 110,
    speaker: 90,
    headphone: 80,
    mouse: 70,
    keyboard: 60,
  },
  {
    month: "March",
    mobile: 120,
    monitor: 110,
    laptop: 190,
    desktop: 120,
    camera: 100,
    Ram: 80,
    speaker: 70,
    headphone: 60,
    mouse: 50,
    keyboard: 40,
  },
  {
    month: "April",
    mobile: 190,
    monitor: 90,
    laptop: 170,
    desktop: 130,
    camera: 110,
    Ram: 90,
    speaker: 80,
    headphone: 70,
    mouse: 60,
    keyboard: 50,
  },
  {
    month: "May",
    mobile: 130,
    monitor: 150,
    laptop: 200,
    desktop: 140,
    camera: 120,
    Ram: 100,
    speaker: 90,
    headphone: 80,
    mouse: 70,
    keyboard: 60,
  },
  {
    month: "June",
    mobile: 140,
    monitor: 300,
    laptop: 210,
    desktop: 160,
    camera: 140,
    Ram: 120,
    speaker: 100,
    headphone: 90,
    mouse: 80,
    keyboard: 70,
  },
];

const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "#f97316",
  },
  monitor: {
    label: "Monitor",
    color: "#22c55e",
  },
  laptop: {
    label: "Laptop",
    color: "#0ea5e9",
  },
  desktop: {
    label: "Desktop",
    color: "#64748b",
  },
  camera: {
    label: "Camera",
    color: "#8b5cf6",
  },
  Ram: {
    label: "Ram",
    color: "#ec4899",
  },
  speaker: {
    label: "Speaker",
    color: "#f59e0b",
  },
  headphone: {
    label: "Headphone",
    color: "#10b981",
  },
  mouse: {
    label: "Mouse",
    color: "#ef4444",
  },
  keyboard: {
    label: "Keyboard",
    color: "#06b6d4",
  },
};

const seriesKeys = Object.keys(chartConfig);
const highlightedSeries = ["mobile", "monitor", "laptop"];

const getTrendPercent = (key) => {
  const firstValue = chartData[0]?.[key] ?? 0;
  const lastValue = chartData[chartData.length - 1]?.[key] ?? 0;

  if (!firstValue) return 0;

  return Math.round(((lastValue - firstValue) / firstValue) * 100);
};

export function Chart() {
  return (
    <section className="w-full rounded-3xl border border-slate-200/60 dark:border-gray-800 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 dark:from-gray-500 dark:via-gray-900 dark:to-gray-950 p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Analytics
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Insight
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Six-month product movement overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {highlightedSeries.map((key) => {
            const trend = getTrendPercent(key);
            const colorClassMap = {
              mobile:
                "border-orange-200/60 dark:border-orange-500/30 bg-orange-50/70 dark:bg-gray-900/80 text-orange-600 dark:text-orange-300",
              monitor:
                "border-emerald-200/60 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-gray-900/80 text-emerald-600 dark:text-emerald-300",
              laptop:
                "border-sky-200/60 dark:border-sky-500/30 bg-sky-50/70 dark:bg-gray-900/80 text-sky-600 dark:text-sky-300",
            };

            return (
              <span
                key={key}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${colorClassMap[key]}`}
              >
                {chartConfig[key].label} {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
            );
          })}
          <span className="rounded-full border border-slate-200/60 dark:border-gray-700 bg-slate-50/70 dark:bg-gray-900/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Last 6 months
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mt-6 min-h-[320px] w-full rounded-2xl bg-white/95 dark:bg-gray-950/80 border border-slate-200/70 dark:border-gray-800 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -4, right: 12, top: 12, bottom: 0 }}
        >
          <defs>
            {seriesKeys.map((key) => (
              <linearGradient
                key={key}
                id={`${key}Gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.04}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="2 6" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`var(--color-${key})`}
              fill={`url(#${key}Gradient)`}
              strokeWidth={2.5}
              dot={{ r: 2, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </section>
  );
}

export default Chart;
