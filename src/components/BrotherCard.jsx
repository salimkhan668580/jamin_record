import { Link } from "react-router-dom";
import { sumRakwa } from "../lib/rakwa";

export default function BrotherCard({ brother, records, disabled = false }) {
  const totalRakwa = sumRakwa(records);
  const infoCount = records.filter((r) => r.isInfo).length;

  const content = (
    <>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {brother.initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text">{brother.name}</p>
        <p className="truncate text-xs text-text/55">{brother.nameHi}</p>

        {disabled ? (
          <p className="mt-2 text-xs text-text/45">Data will be added soon</p>
        ) : (
          <>
            <div className="mt-3 rounded-xl border-2 border-primary/25 bg-primary/10 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/70">
                कुल रकवा
              </p>
              <p className="text-xl font-bold leading-tight text-primary sm:text-2xl">
                {totalRakwa}
              </p>
              <p className="text-[10px] text-primary/60">बीघा · कट्ठा · धुर</p>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text/60">
              <span>{records.length} records</span>
              {infoCount > 0 ? (
                <span className="font-medium text-sky-700">{infoCount} info</span>
              ) : null}
            </div>
          </>
        )}
      </div>

      <span aria-hidden className="self-center text-xl text-text/30">
        {disabled ? "·" : "›"}
      </span>
    </>
  );

  if (disabled) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-card/70 p-4 opacity-70">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/brother/${brother.id}`}
      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
    >
      {content}
    </Link>
  );
}
