import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "../../data/chartData.json";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK, GRID, SERIES_PRIMARY, SERIES_SECONDARY } from "./palette";

const CLASSES = ["Dropout", "Enrolled", "Graduate"] as const;

type Point = { fpr: number; tpr: number };

function interpolate(points: Point[], fpr: number): number {
  if (fpr <= points[0].fpr) return points[0].tpr;
  for (let i = 1; i < points.length; i++) {
    if (points[i].fpr >= fpr) {
      const a = points[i - 1];
      const b = points[i];
      if (b.fpr === a.fpr) return b.tpr;
      return a.tpr + ((b.tpr - a.tpr) * (fpr - a.fpr)) / (b.fpr - a.fpr);
    }
  }
  return points[points.length - 1].tpr;
}

function mergeCurves(cls: string) {
  const rf = chartData.roc["Random Forest"].find((r) => r.class === cls)!;
  const xgb = chartData.roc["XGBoost"].find((r) => r.class === cls)!;
  const grid = Array.from(
    new Set([...rf.points, ...xgb.points].map((p) => p.fpr))
  ).sort((a, b) => a - b);
  const merged = grid.map((fpr) => ({
    fpr,
    rf: interpolate(rf.points, fpr),
    xgb: interpolate(xgb.points, fpr),
  }));
  return { rfAuc: rf.auc, xgbAuc: xgb.auc, merged };
}

function SingleRoc({ cls }: { cls: string }) {
  const { rfAuc, xgbAuc, merged } = mergeCurves(cls);

  return (
    <div>
      <p className="font-['DM_Mono'] text-xs text-foreground mb-1">{cls}</p>
      <p className="font-['DM_Sans'] text-[11px] text-muted-foreground mb-2 font-light">
        RF AUC {rfAuc.toFixed(2)} · XGB AUC {xgbAuc.toFixed(2)}
      </p>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={merged} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke={GRID} />
          <XAxis
            type="number"
            dataKey="fpr"
            domain={[0, 1]}
            ticks={[0, 0.5, 1]}
            tick={{ ...AXIS_TICK, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.5, 1]}
            tick={{ ...AXIS_TICK, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={
              <ChartTooltip
                labelFormatter={(l) => `FPR ${Number(l).toFixed(2)}`}
                formatter={(v, name) => [Number(v).toFixed(2), `${name} TPR`]}
              />
            }
          />
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 1, y: 1 },
            ]}
            stroke={GRID}
            strokeDasharray="4 4"
          />
          <Line
            dataKey="rf"
            name="Random Forest"
            stroke={SERIES_PRIMARY}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: SERIES_PRIMARY, stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            dataKey="xgb"
            name="XGBoost"
            stroke={SERIES_SECONDARY}
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: SERIES_SECONDARY, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function RocCurves() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {CLASSES.map((cls) => (
          <SingleRoc key={cls} cls={cls} />
        ))}
      </div>
      <div className="flex items-center gap-5 mt-4">
        <span className="flex items-center gap-2 font-['DM_Sans'] text-xs text-muted-foreground">
          <span className="inline-block w-4 h-0.5" style={{ backgroundColor: SERIES_PRIMARY }} />
          Random Forest
        </span>
        <span className="flex items-center gap-2 font-['DM_Sans'] text-xs text-muted-foreground">
          <svg width="16" height="2">
            <line x1="0" y1="1" x2="16" y2="1" stroke={SERIES_SECONDARY} strokeWidth="2" strokeDasharray="4 3" />
          </svg>
          XGBoost
        </span>
        <span className="flex items-center gap-2 font-['DM_Sans'] text-xs text-muted-foreground">
          <svg width="16" height="2">
            <line x1="0" y1="1" x2="16" y2="1" stroke={GRID} strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          Chance
        </span>
      </div>
    </div>
  );
}
