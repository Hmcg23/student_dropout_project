import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { CLASS_COLORS } from "./palette";

const total = chartData.classDistribution.reduce((s, d) => s + d.count, 0);
const data = chartData.classDistribution.map((d) => ({
  ...d,
  pct: d.count / total,
  fill: CLASS_COLORS[d.class],
}));

export default function ClassDonut() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="class"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="var(--background)"
          strokeWidth={2}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: "#8a8a8a", strokeWidth: 1 }}
          fontFamily="'DM Mono', monospace"
          fontSize={11}
        >
          {data.map((d) => (
            <Cell key={d.class} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltip
              formatter={(v, name) => [
                `${v.toLocaleString()} students (${((v / total) * 100).toFixed(1)}%)`,
                name,
              ]}
            />
          }
        />
        <Legend
          wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
          iconType="square"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
