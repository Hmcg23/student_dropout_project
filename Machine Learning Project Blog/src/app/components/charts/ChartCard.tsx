import type { ReactNode } from "react";

export default function ChartCard({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="border border-border rounded-sm p-5 my-8">
      <figcaption className="mb-4">
        <p className="font-['DM_Mono'] text-xs tracking-widest uppercase text-muted-foreground">
          {title}
        </p>
        {caption && (
          <p className="font-['DM_Sans'] text-xs text-muted-foreground mt-1 font-light">
            {caption}
          </p>
        )}
      </figcaption>
      {children}
    </figure>
  );
}
