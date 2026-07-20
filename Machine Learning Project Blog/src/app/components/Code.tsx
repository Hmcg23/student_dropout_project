import type { ReactNode } from "react";

export default function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-['DM_Mono'] text-[0.85em] bg-foreground/[0.06] text-foreground px-1.5 py-0.5 rounded-[3px] whitespace-nowrap">
      {children}
    </code>
  );
}
