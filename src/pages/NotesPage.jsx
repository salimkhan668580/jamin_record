import { useState } from "react";
import { Link } from "react-router-dom";
import { LAND_SHARE_NOTES, TRANSFER_OPTION_TABLES } from "../data/landNotes";

function PersonBlock({ title, rows }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-sm font-semibold text-text">{title}</p>
      <dl className="mt-2 space-y-2">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-text/60">{label}</dt>
            <dd className={highlight ? "font-bold text-primary" : "font-semibold text-text"}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TransferOptionTable({ table, index }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="text-base font-semibold text-text sm:text-lg">
        {index + 1}. {table.title}
      </h3>
      <p className="mt-1 text-sm text-text/60">{table.subtitle}</p>

      {/* Mobile: cards */}
      <ul className="mt-4 space-y-2 md:hidden">
        {table.rows.map((row) => (
          <li
            key={`${table.id}-${row.khesra}`}
            className="rounded-xl border border-border bg-background p-3"
          >
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>
                <span className="text-text/55">खाता </span>
                <span className="font-semibold">{row.khata}</span>
              </span>
              <span>
                <span className="text-text/55">खेसरा </span>
                <span className="font-bold text-primary">{row.khesra}</span>
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-[11px] text-text/55">{table.giverCol}</p>
                <p className="font-semibold">{row.giverRakwa}</p>
              </div>
              <div>
                <p className="text-[11px] text-text/55">{table.receiverCol}</p>
                <p className="font-semibold">{row.receiverRakwa}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-primary/5 text-xs uppercase text-text/60">
            <tr>
              <th className="px-3 py-2.5 font-medium">खाता</th>
              <th className="px-3 py-2.5 font-medium">खेसरा</th>
              <th className="px-3 py-2.5 font-medium">{table.giverCol}</th>
              <th className="px-3 py-2.5 font-medium">{table.receiverCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {table.rows.map((row) => (
              <tr key={`${table.id}-${row.khesra}`} className="hover:bg-background">
                <td className="px-3 py-2.5 font-medium text-text">{row.khata}</td>
                <td className="px-3 py-2.5 font-bold text-primary">{row.khesra}</td>
                <td className="px-3 py-2.5 font-semibold text-text">{row.giverRakwa}</td>
                <td className="px-3 py-2.5 font-semibold text-text">{row.receiverRakwa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function NotesPage() {
  const [showTransferOptions, setShowTransferOptions] = useState(false);

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        <span aria-hidden>‹</span> Back
      </Link>

      <section className="rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4">
        <h2 className="text-lg font-semibold text-amber-950">Land Share Notes</h2>
        <p className="mt-1 text-sm text-amber-900/70">
          Md.Aslam Khan, Md.Islam Khan and Junaid Khan — M.K. Khan transfer (pehle → dega/milega →
          baad mein)
        </p>
        <button
          type="button"
          onClick={() => setShowTransferOptions((open) => !open)}
          className="mt-3 min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 sm:w-auto"
        >
          {showTransferOptions ? "Transfer Options छिपाएं" : "Transfer Options"}
        </button>
      </section>

      {showTransferOptions ? (
        <div className="space-y-4">
          {TRANSFER_OPTION_TABLES.map((table, index) => (
            <TransferOptionTable key={table.id} table={table} index={index} />
          ))}
        </div>
      ) : null}

      <ul className="space-y-4">
        {LAND_SHARE_NOTES.map((note, index) => (
          <li key={note.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="text-xs font-medium text-text/50">#{index + 1}</p>
                <p className="text-base font-semibold text-text">
                  {note.from} → {note.to}
                </p>
                <p className="mt-0.5 text-sm text-text/60">{note.share}</p>
              </div>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                खेसरा {note.khesra}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PersonBlock
                title={note.giver.name}
                rows={[
                  { label: "Pehle", value: note.giver.before },
                  { label: "Dega", value: note.giver.gives, highlight: true },
                  { label: "Baad mein", value: note.giver.after },
                ]}
              />
              <PersonBlock
                title={note.receiver.name}
                rows={[
                  { label: "Pehle", value: note.receiver.before },
                  { label: "Ko milega", value: note.receiver.receives, highlight: true },
                  { label: "Baad mein", value: note.receiver.after },
                ]}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
