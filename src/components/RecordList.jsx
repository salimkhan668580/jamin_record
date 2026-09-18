import { useEffect, useMemo, useState } from "react";
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

function hasMessage(record) {
  return Boolean(record.message?.toString().trim());
}

/** Info rows = blue (Excel Dispute/Info status or any Message) */
function getRowTone(record) {
  if (record.isInfo || hasMessage(record)) return "info";
  return "normal";
}

const TONE = {
  info: {
    card: "rounded-2xl border border-sky-300 bg-sky-50 p-4 relative z-0",
    index: "rounded-lg bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700",
    value: "text-base font-semibold text-sky-900",
    row: "bg-sky-50 text-sky-900",
    cell: "px-4 py-3 font-semibold text-sky-900",
    messageBox: "mt-3 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-sky-800",
    messageCell: "max-w-xs px-4 py-3 text-sm font-medium text-sky-800",
  },
  normal: {
    card: "rounded-2xl border border-border bg-white p-4 relative z-0",
    index: "rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary",
    value: "text-base font-semibold text-text",
    row: "transition hover:bg-background",
    cell: "px-4 py-3 font-medium text-text",
    messageBox: "",
    messageCell: "px-4 py-3 text-sm text-text/40",
  },
};

function StatusBadge({ status, tone }) {
  if (tone === "info") {
    return (
      <span className="inline-flex rounded-lg bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
        Info
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

export default function RecordList({ records, searchQuery = "", onSearchChange }) {
  const [password, setPassword] = useState("");
  const [localNameUnlocked, setLocalNameUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const recordIds = useMemo(() => records.map((record) => record.id), [records]);

  // Drop selections that are no longer in the visible list (e.g. after search)
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set([...prev].filter((id) => recordIds.includes(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [recordIds]);

  const selectedRecords = useMemo(
    () => records.filter((record) => selectedIds.has(record.id)),
    [records, selectedIds],
  );

  const allSelected = records.length > 0 && selectedIds.size === records.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleRow(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(recordIds));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleUnlock(event) {
    event.preventDefault();
    if (password.trim() === LOCAL_NAME_PASSWORD) {
      setLocalNameUnlocked(true);
      setPasswordError("");
      setPassword("");
      return;
    }
    setPasswordError("Wrong password");
    setLocalNameUnlocked(false);
  }

  function handleLock() {
    setLocalNameUnlocked(false);
    setPassword("");
    setPasswordError("");
    setShowPasswordPanel(false);
  }

  function openSearchPanel() {
    setShowSearchPanel(true);
    setShowPasswordPanel(false);
  }

  function openPasswordPanel() {
    setShowPasswordPanel(true);
    setShowSearchPanel(false);
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
        <p className="text-3xl">📄</p>
        <p className="mt-2 font-medium text-text">No record found</p>
      </div>
    );
  }

  const infoCount = records.filter((r) => r.isInfo).length;

  return (
    <>
      <div className="space-y-3">
        {/* Two buttons — input fields show only after click */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openSearchPanel}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
              showSearchPanel
                ? "border-primary bg-primary text-white"
                : "border-border bg-card text-text hover:border-primary/40"
            }`}
          >
            खाता खोजें
          </button>
          <button
            type="button"
            onClick={openPasswordPanel}
            disabled={localNameUnlocked}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition disabled:opacity-60 ${
              localNameUnlocked || showPasswordPanel
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-text hover:border-primary/40"
            }`}
          >
            {localNameUnlocked ? "Local Name खुला" : "Local Name"}
          </button>
        </div>

        {showSearchPanel && onSearchChange ? (
          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-text/60">खाता या खेसरा खोजें</span>
              <button
                type="button"
                onClick={() => {
                  setShowSearchPanel(false);
                  onSearchChange("");
                }}
                className="text-xs font-medium text-text/50 hover:text-text"
              >
                Close
              </button>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="खाता या खेसरा खोजें"
              autoFocus
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ) : null}

        {(showPasswordPanel || localNameUnlocked) && (
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
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:hidden">
                  <span className="text-xs font-medium text-text/60">
                    Local Name to view
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordPanel(false);
                      setPassword("");
                      setPasswordError("");
                    }}
                    className="text-xs font-medium text-text/50"
                  >
                    बंद
                  </button>
                </div>
                <label className="min-w-0 flex-1">
                  <span className="hidden text-xs font-medium text-text/60 sm:block">
                    Local Name to view
                  </span>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Password"
                    autoFocus
                    className="mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:mt-1"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="min-h-11 flex-1 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 sm:flex-none"
                  >
                    Show
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordPanel(false);
                      setPassword("");
                      setPasswordError("");
                    }}
                    className="hidden justify-center items-center min-h-11 rounded-xl border border-border px-4 text-sm font-medium text-text/70 sm:inline-flex"
                  >
                    Close
                  </button>
                </div>
              </form>
            )}
            {passwordError ? (
              <p className="mt-2 text-xs font-medium text-red-600">{passwordError}</p>
            ) : null}
          </div>
        )}
      </div>

      {/* Selected रकवा summary — solid bg so cards don't show through on scroll */}
      <div className="mt-3 sticky top-16 z-10 rounded-2xl border border-border bg-card p-3 shadow-md sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-text/60">Selected रकवा</p>
            <p className="text-lg font-semibold text-primary sm:text-xl">
              {selectedIds.size > 0 ? sumRakwa(selectedRecords) : "0.0.0"}
            </p>
            <p className="text-[11px] text-text/50">
              {selectedIds.size} row selected · ए0 डी0{" "}
              {selectedIds.size > 0 ? sumYeDi(selectedRecords) : 0}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleAll}
              className="min-h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-text/70"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            {selectedIds.size > 0 ? (
              <button
                type="button"
                onClick={clearSelection}
                className="min-h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-text/70"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="mt-3 space-y-3 md:hidden">
        {records.map((record, index) => {
          const tone = getRowTone(record);
          const styles = TONE[tone];
          const checked = selectedIds.has(record.id);

          return (
            <li
              key={record.id}
              className={`${styles.card} ${checked ? "ring-2 ring-primary/40" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <label className="flex min-h-10 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRow(record.id)}
                    className="size-4 accent-primary"
                  />
                  <span className={styles.index}>#{index + 1}</span>
                </label>
                <StatusBadge status={record.status} tone={tone} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
                {COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    className={column.key === "localName" ? "col-span-2" : undefined}
                  >
                    <dt className="text-[11px] text-text/55">{column.label}</dt>
                    <dd className={styles.value}>
                      {displayValue(record, column.key, localNameUnlocked)}
                    </dd>
                  </div>
                ))}
              </dl>

              {hasMessage(record) ? (
                <p className={styles.messageBox}>
                  <span className="font-semibold">Message: </span>
                  {record.message}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Desktop: table */}
      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase text-text/60">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="size-4 accent-primary"
                  aria-label="Select all rows"
                />
              </th>
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
            {records.map((record, index) => {
              const tone = getRowTone(record);
              const styles = TONE[tone];
              const checked = selectedIds.has(record.id);

              return (
                <tr
                  key={record.id}
                  className={`${styles.row} ${checked ? "outline outline-1 outline-primary/25" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRow(record.id)}
                      className="size-4 accent-primary"
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-text/50">{index + 1}</td>
                  {COLUMNS.map((column) => (
                    <td key={column.key} className={styles.cell}>
                      {displayValue(record, column.key, localNameUnlocked)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <StatusBadge status={record.status} tone={tone} />
                  </td>
                  <td className={styles.messageCell}>
                    {hasMessage(record) ? show(record.message) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-background text-sm font-semibold text-text">
            <tr>
              <td className="px-4 py-3" colSpan={5}>
                कुल ({records.length})
                {selectedIds.size > 0 ? (
                  <span className="ml-2 font-medium text-primary">
                    · Selected रकवा {sumRakwa(selectedRecords)}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-primary">{sumRakwa(records)}</td>
              <td className="px-4 py-3 text-primary">{sumYeDi(records)}</td>
              <td className="px-4 py-3 text-sky-700">Info: {infoCount}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
