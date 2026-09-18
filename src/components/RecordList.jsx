import { sumRakwa, sumYeDi } from "../lib/rakwa";

const COLUMNS = [
  { key: "khata", label: "खाता" },
  { key: "khesra", label: "खेसरा" },
  { key: "localName", label: "Local Name" },
  { key: "rakwa", label: "रकवा" },
  { key: "yeDi", label: "ए0 डी0" },
];

function show(value) {
  return value?.toString().trim() ? value : "—";
}

function StatusBadge({ status, isDispute }) {
  if (isDispute) {
    return (
      <span className="inline-flex rounded-lg bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
        {status || "Dispute"}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
      {status || "Correct"}
    </span>
  );
}

export default function RecordList({ records }) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
        <p className="text-3xl">📄</p>
        <p className="mt-2 font-medium text-text">कोई रिकॉर्ड नहीं मिला</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="space-y-3 md:hidden">
        {records.map((record, index) => (
          <li
            key={record.id}
            className={
              record.isDispute
                ? "rounded-2xl border border-red-300 bg-red-50 p-4"
                : "rounded-2xl border border-border bg-card p-4"
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={
                  record.isDispute
                    ? "rounded-lg bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700"
                    : "rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                }
              >
                #{index + 1}
              </span>
              <StatusBadge status={record.status} isDispute={record.isDispute} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
              {COLUMNS.map((column) => (
                <div
                  key={column.key}
                  className={column.key === "localName" ? "col-span-2" : undefined}
                >
                  <dt className="text-[11px] text-text/55">{column.label}</dt>
                  <dd
                    className={
                      record.isDispute
                        ? "text-base font-semibold text-red-800"
                        : "text-base font-semibold text-text"
                    }
                  >
                    {show(record[column.key])}
                  </dd>
                </div>
              ))}
            </dl>

            {record.isDispute && record.message ? (
              <p className="mt-3 rounded-xl border border-red-200 bg-white/70 px-3 py-2 text-sm text-red-700">
                <span className="font-semibold">Message: </span>
                {record.message}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase text-text/60">
            <tr>
              <th className="px-4 py-3 font-medium">क्रम</th>
              {COLUMNS.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record, index) => (
              <tr
                key={record.id}
                className={
                  record.isDispute
                    ? "bg-red-50 text-red-800"
                    : "transition hover:bg-background"
                }
              >
                <td className="px-4 py-3 text-text/50">{index + 1}</td>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={
                      record.isDispute
                        ? "px-4 py-3 font-semibold text-red-800"
                        : "px-4 py-3 font-medium text-text"
                    }
                  >
                    {show(record[column.key])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} isDispute={record.isDispute} />
                </td>
                <td
                  className={
                    record.isDispute
                      ? "max-w-xs px-4 py-3 text-sm font-medium text-red-700"
                      : "px-4 py-3 text-sm text-text/40"
                  }
                >
                  {record.isDispute ? show(record.message) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-background text-sm font-semibold text-text">
            <tr>
              <td className="px-4 py-3" colSpan={4}>
                कुल ({records.length})
              </td>
              <td className="px-4 py-3 text-primary">{sumRakwa(records)}</td>
              <td className="px-4 py-3 text-primary">{sumYeDi(records)}</td>
              <td className="px-4 py-3 text-red-600">
                Dispute: {records.filter((r) => r.isDispute).length}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
