import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK, GRID, INK, PROTECTIVE, RISK } from "./palette";

const FRIENDLY_NAMES: Record<string, string> = {
  "Curricular units 2nd sem (grade)": "2nd-sem grade",
  "Curricular units 2nd sem (approved)": "2nd-sem units passed",
  "Curricular units 1st sem (grade)": "1st-sem grade",
  "Curricular units 1st sem (approved)": "1st-sem units passed",
  "Tuition fees up to date": "Tuition up to date",
  "Scholarship holder": "Scholarship holder",
  "Curricular units 2nd sem (without evaluations)": "2nd-sem missed evals",
  "Marital status": "Marital status",
  "Application mode": "Application mode",
  Gender: "Gender",
  Debtor: "Debtor",
  "Age at enrollment": "Age at enrollment",
};

const data = [...chartData.correlations]
  .sort((a, b) => a.value - b.value)
  .map((c) => ({ ...c, name: FRIENDLY_NAMES[c.feature] ?? c.feature }));

export default function CorrelationBars() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 48, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis
          type="number"
          domain={[-0.6, 0.3]}
          ticks={[-0.6, -0.4, -0.2, 0, 0.2]}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ ...AXIS_TICK, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <ReferenceLine x={0} stroke={INK} strokeWidth={1} />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          content={
            <ChartTooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.feature ?? ""}
              formatter={(v) => [
                `${v > 0 ? "+" : ""}${v.toFixed(2)}`,
                "Correlation with dropout",
              ]}
            />
          }
        />
        <Bar dataKey="value" name="Correlation" maxBarSize={16} radius={2}>
          {data.map((d) => (
            <Cell key={d.feature} fill={d.value < 0 ? PROTECTIVE : RISK} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
