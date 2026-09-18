import { Link } from "react-router-dom";
import { sumRakwa } from "../lib/rakwa";

export default function BrotherCard({ brother, records, disabled = false }) {
  const content = (
    <>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {brother.initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text">{brother.name}</p>
        <p className=" truncate text-xs text-text/55">{brother.nameHi}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text/70">
          {disabled ? (
            <span className="text-text/45">Data will be added soon</span>
          ) : (
            <>
              <span>{records.length} रिकॉर्ड</span>
              <span className="text-secondary">रकवा {sumRakwa(records)}</span>
              {records.some((r) => r.isDispute) ? (
                <span className="font-medium text-red-600">
                  {records.filter((r) => r.isDispute).length} dispute
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>

      <span aria-hidden className="text-xl text-text/30">
        {disabled ? "·" : "›"}
      </span>
    </>
  );

  if (disabled) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card/70 p-4 opacity-70">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/brother/${brother.id}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
    >
      {content}
    </Link>
  );
}
