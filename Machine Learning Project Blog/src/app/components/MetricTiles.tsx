const METRICS = [
  { label: "Dropout flag accuracy", value: "87%", delta: "binary yes/no early-warning flag" },
  { label: "3-class accuracy", value: "77.7%", delta: "Random Forest, best of 7 models" },
  { label: "AUC · Dropout", value: "0.91", delta: "one-vs-rest ROC" },
  { label: "Enrolled recall", value: "+13 pts", delta: "38.4% → 51.6% via SMOTE" },
];

export default function MetricTiles() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 border-b border-border">
      <h2 className="font-['DM_Mono'] text-xs tracking-widest uppercase text-muted-foreground mb-8">
        Key Results
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-background p-6">
            <p className="font-['Lora'] text-3xl font-semibold text-foreground mb-1">
              {m.value}
            </p>
            <p className="font-['DM_Mono'] text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p className="font-['DM_Sans'] text-xs text-muted-foreground">{m.delta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
