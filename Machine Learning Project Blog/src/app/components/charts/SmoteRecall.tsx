import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK, CRIMSON, CRIMSON_LIGHT, GRID } from "./palette";

const { before, after } = chartData.smoteRecall;
const data = [
  { label: "Before SMOTE", recall: before, fill: CRIMSON_LIGHT },
  { label: "After SMOTE", recall: after, fill: CRIMSON },
];

export default function SmoteRecall() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 24, right: 4, left: -16, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tick={{ ...AXIS_TICK, fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis
          domain={[0, 0.6]}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          content={
            <ChartTooltip formatter={(v) => [`${(v * 100).toFixed(1)}%`, "Enrolled recall"]} />
          }
        />
        <Bar dataKey="recall" name="Enrolled recall" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.fill} />
          ))}
          <LabelList
            dataKey="recall"
            position="top"
            formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fill: "#1a1a1a" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
