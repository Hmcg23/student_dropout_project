import { useState } from "react";
import chartData from "../../data/chartData.json";
import { HEAT_TEXT_FLIP, INK, heatFill } from "./palette";

const { labels, matrix } = chartData.confusionMatrix;
const max = Math.max(...matrix.flat());
const rowTotals = matrix.map((row) => row.reduce((s, v) => s + v, 0));

export default function ConfusionMatrix() {
  const [hover, setHover] = useState<[number, number] | null>(null);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="grid" style={{ gridTemplateColumns: "90px repeat(3, 1fr)" }}>
          <div />
          {labels.map((l) => (
            <div
              key={l}
              className="font-['DM_Mono'] text-[11px] text-muted-foreground text-center pb-2"
            >
              {l}
            </div>
          ))}

          {matrix.map((row, i) => (
            <div key={labels[i]} className="contents">
              <div className="font-['DM_Mono'] text-[11px] text-muted-foreground flex items-center pr-3 justify-end">
                {labels[i]}
              </div>
              {row.map((value, j) => {
                const intensity = value / max;
                const dark = intensity > HEAT_TEXT_FLIP;
                const isHovered = hover?.[0] === i && hover?.[1] === j;
                return (
                  <div
                    key={`${i}-${j}`}
                    onMouseEnter={() => setHover([i, j])}
                    onMouseLeave={() => setHover(null)}
                    className="relative m-[1px] rounded-[2px] flex items-center justify-center h-16 cursor-default transition-transform"
                    style={{
                      backgroundColor: heatFill(intensity),
                      outline: isHovered ? `2px solid ${INK}` : "none",
                      outlineOffset: "-1px",
                    }}
                  >
                    <span
                      className="font-['DM_Mono'] text-sm"
                      style={{ color: dark ? "#ffffff" : "#1a1a1a" }}
                    >
                      {value}
                    </span>
                    {isHovered && (
                      <div
                        className={`absolute z-10 ${
                          i === 0 ? "top-full mt-2" : "bottom-full mb-2"
                        } ${
                          j === 0
                            ? "left-0"
                            : j === row.length - 1
                              ? "right-0"
                              : "left-1/2 -translate-x-1/2"
                        }`}
                      >
                        <div
                          className={`whitespace-nowrap bg-background border border-foreground/20 rounded-sm px-3 py-2 shadow-sm motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:ease-out motion-safe:duration-200 ${
                            i === 0
                              ? "motion-safe:slide-in-from-top-1"
                              : "motion-safe:slide-in-from-bottom-1"
                          }`}
                        >
                          <p className="font-['DM_Mono'] text-xs text-foreground">
                            True {labels[i]} → predicted {labels[j]}
                          </p>
                          <p className="font-['DM_Sans'] text-xs text-muted-foreground">
                            {value} students ({((value / rowTotals[i]) * 100).toFixed(1)}% of {labels[i]})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 pl-[90px]">
          <p className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-muted-foreground">
            Predicted label →
          </p>
          <p className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-muted-foreground">
            Rows: true label
          </p>
        </div>
      </div>
    </div>
  );
}
