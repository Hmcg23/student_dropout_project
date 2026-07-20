import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK, GRID, SERIES_PRIMARY } from "./palette";

const FRIENDLY_NAMES: Record<string, string> = {
  overall_approval_rate: "Overall approval rate",
  failures_2nd_sem: "2nd-sem failures",
  "Curricular units 2nd sem (approved)": "2nd-sem units passed",
  second_sem_pass_rate: "2nd-sem pass rate",
  "Curricular units 2nd sem (grade)": "2nd-sem grade",
};

const data = chartData.featureImportance.map((f) => ({
  ...f,
  name: FRIENDLY_NAMES[f.feature] ?? f.feature,
}));

export default function FeatureImportance() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 40, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ ...AXIS_TICK, fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          content={
            <ChartTooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.feature ?? ""}
              formatter={(v) => [v.toFixed(4), "Importance"]}
            />
          }
        />
        <Bar dataKey="importance" name="Importance" fill={SERIES_PRIMARY} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
