// components/dashboard/OrdersChart.tsx
"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { OrdersChartData } from "@/lib/types";

interface OrdersBarChartProps {
  data: OrdersChartData[];
}

export function OrdersBarChart({ data }: OrdersBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.order_count));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
        barSize={28}
      >
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--color-text-tertiary, #888)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--color-text-tertiary, #888)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{
            background: "var(--color-background-primary, #fff)",
            border: "0.5px solid var(--color-border-secondary, #e5e7eb)",
            borderRadius: 8,
            fontSize: 12,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)",
          }}
          formatter={(value: number) => [`${value} orders`, ""]}
          labelStyle={{ fontWeight: 500, marginBottom: 2 }}
        />
        <Bar dataKey="order_count" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.order_count === maxCount
                  ? "#111827"            /* darkest bar = current peak */
                  : "#E5E7EB"           /* light gray for others */
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
