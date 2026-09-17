export default function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[11px] text-text/60 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-primary sm:text-xl">{value}</p>
      {hint ? <p className="text-[11px] text-text/45">{hint}</p> : null}
    </div>
  );
}
