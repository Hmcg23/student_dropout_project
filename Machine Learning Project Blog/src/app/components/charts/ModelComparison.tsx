import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK, GRID, SERIES_PRIMARY, SERIES_SECONDARY } from "./palette";

const SHORT_NAMES: Record<string, string> = {
  "Logistic Regression": "LogReg",
  "Random Forest": "RF",
  XGBoost: "XGBoost",
  "Neural Network (MLP)": "MLP",
  SVC: "SVC",
  "K-Nearest Neighbors": "KNN",
  "Gradient Boosting": "GradBoost",
};

const data = chartData.modelComparison.map((m) => ({
  ...m,
  short: SHORT_NAMES[m.model] ?? m.model,
}));

export default function ModelComparison() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 4 }} barGap={2}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="short" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
        <YAxis domain={[0, 1]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          content={
            <ChartTooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.model ?? ""}
              formatter={(v, name) => [`${(v * 100).toFixed(1)}%`, name]}
            />
          }
        />
        <Legend
          wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
          iconType="square"
          iconSize={8}
        />
        <Bar dataKey="accuracy" name="Accuracy" fill={SERIES_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar dataKey="f1Weighted" name="Weighted F1" fill={SERIES_SECONDARY} radius={[4, 4, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
