import type { TooltipProps } from "recharts";

export default function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
}: TooltipProps<number, string> & {
  labelFormatter?: (label: string, payload: any[]) => string;
  formatter?: (value: number, name: string) => [string, string];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const heading = labelFormatter ? labelFormatter(String(label), payload) : String(label ?? "");

  return (
    <div className="bg-background border border-foreground/20 rounded-sm px-3 py-2 shadow-sm">
      {heading && (
        <p className="font-['DM_Mono'] text-xs text-foreground mb-1">{heading}</p>
      )}
      {payload.map((entry) => {
        const [value, name] = formatter
          ? formatter(entry.value as number, entry.name as string)
          : [String(entry.value), entry.name as string];
        return (
          <div key={`${entry.name}`} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-[1px]"
              style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
            />
            <span className="font-['DM_Sans'] text-xs text-muted-foreground">{name}</span>
            <span className="font-['DM_Mono'] text-xs text-foreground ml-auto pl-3">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
