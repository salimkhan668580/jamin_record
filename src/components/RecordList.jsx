import { useState } from "react";
import { sumRakwa, sumYeDi } from "../lib/rakwa";

const LOCAL_NAME_PASSWORD = "1974";
const MASKED_LOCAL_NAME = "*******";

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

function displayValue(record, columnKey, localNameUnlocked) {
  if (columnKey === "localName") {
    if (!localNameUnlocked) return MASKED_LOCAL_NAME;
    return show(record.localName);
  }
  return show(record[columnKey]);
}

export default function RecordList({ records }) {
  const [password, setPassword] = useState("");
  const [localNameUnlocked, setLocalNameUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleUnlock(event) {
    event.preventDefault();
    if (password.trim() === LOCAL_NAME_PASSWORD) {
      setLocalNameUnlocked(true);
      setPasswordError("");
      setPassword("");
      return;
    }
    setPasswordError("गलत पासवर्ड");
    setLocalNameUnlocked(false);
  }

  function handleLock() {
    setLocalNameUnlocked(false);
    setPassword("");
    setPasswordError("");
  }

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
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
        {localNameUnlocked ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-primary">Local Name खुला है</p>
            <button
              type="button"
              onClick={handleLock}
              className="min-h-10 rounded-xl border border-border px-4 text-sm font-medium text-text/70 transition hover:bg-background"
            >
              फिर से छिपाएं
            </button>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1">
              <span className="text-xs font-medium text-text/60">
                Local Name देखने के लिए पासवर्ड डालें
              </span>
              <input
                type="password"
                inputMode="numeric"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                placeholder="पासवर्ड"
                className="mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              दिखाएं
            </button>
          </form>
        )}
        {passwordError ? (
          <p className="mt-2 text-xs font-medium text-red-600">{passwordError}</p>
        ) : null}
      </div>

      {/* Mobile: stacked cards */}
      <ul className="mt-3 space-y-3 md:hidden">
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
                    {displayValue(record, column.key, localNameUnlocked)}
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
      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
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
                    {displayValue(record, column.key, localNameUnlocked)}
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
