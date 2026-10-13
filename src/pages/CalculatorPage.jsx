import { useState } from "react";
import { Link } from "react-router-dom";
import { dhurkiToRakwa, parseRakwa } from "../lib/rakwa";

const RAKWA_UNITS = ["Bigha", "Katha", "Dhur", "Dhurki"];

// Decimal values are summed as integer thousandths to avoid floating-point drift.
const DECIMAL_SCALE = 1000;
const DECIMAL_PER_ACRE = 100;
// Bihar standard; some districts use a different Bigha size.
const DECIMAL_PER_BIGHA = 62.5;
const DHURKI_PER_BIGHA = 20 * 20 * 20;

function formatDecimal(units) {
  return `${Number((units / DECIMAL_SCALE).toFixed(3))} dismil`;
}

function decimalToRakwa(units) {
  const dhurki = Math.round((units * DHURKI_PER_BIGHA) / (DECIMAL_PER_BIGHA * DECIMAL_SCALE));
  return dhurkiToRakwa(dhurki);
}

const MODES = {
  rakwa: {
    label: "Rakwa",
    placeholder: "6.7.5.3",
    help: (
      <>
        Enter as <span className="font-semibold">Bigha.Katha.Dhur.Dhurki</span> — e.g.{" "}
        <span className="font-semibold">6.7.5.3</span> or <span className="font-semibold">0.3.7</span>
      </>
    ),
    error: "Invalid format — e.g. 6.7.5.3",
    parse(value) {
      const { parts, dhurki, valid } = parseRakwa(value);
      return {
        valid,
        units: dhurki,
        description: parts.map((part, index) => `${part} ${RAKWA_UNITS[index]}`).join(" · "),
      };
    },
    format: dhurkiToRakwa,
    totalHint: () => "Bigha · Katha · Dhur · Dhurki",
    remainderLabel: (units) => `${units} Dhurki left over`,
  },
  decimal: {
    label: "Dismil",
    placeholder: "40",
    help: (
      <>
        Enter dismil — e.g. <span className="font-semibold">40</span> or{" "}
        <span className="font-semibold">51.35</span>
      </>
    ),
    error: "Invalid number — e.g. 51.35 (max 3 digits after the point)",
    parse(value) {
      const text = value.trim();
      if (!text) return { valid: true, units: 0, description: "" };
      if (!/^(\d+\.?\d{0,3}|\.\d{1,3})$/.test(text)) return { valid: false, units: 0, description: "" };
      const units = Math.round(Number(text) * DECIMAL_SCALE);
      return {
        valid: true,
        units,
        description: `${Number(text)} dismil = ${decimalToRakwa(units)}`,
      };
    },
    format: (units) => (units < 0 ? `-${formatDecimal(-units)}` : formatDecimal(units)),
    secondary: decimalToRakwa,
    totalHint: (units) =>
      `Dismil · = ${Number((units / DECIMAL_SCALE / DECIMAL_PER_ACRE).toFixed(4))} acre`,
    remainderLabel: (units) => `${formatDecimal(units)} left over`,
  },
};

let nextRowId = 1;

function createRow() {
  return { id: nextRowId++, sign: "+", value: "" };
}

function Calculator({ mode }) {
  const [rows, setRows] = useState(() => [createRow(), createRow()]);
  const [shares, setShares] = useState("");

  const parsedRows = rows.map((row) => ({ ...row, parsed: mode.parse(row.value) }));
  const totalUnits = parsedRows.reduce(
    (sum, row) => sum + (row.sign === "-" ? -1 : 1) * row.parsed.units,
    0,
  );
  const hasInvalid = parsedRows.some((row) => !row.parsed.valid);

  const shareCount = Number(shares);
  const canDivide = Number.isInteger(shareCount) && shareCount > 0 && totalUnits > 0;
  const shareUnits = canDivide ? Math.floor(totalUnits / shareCount) : 0;
  const remainderUnits = canDivide ? totalUnits % shareCount : 0;

  function updateRow(id, changes) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...changes } : row)));
  }

  function removeRow(id) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function handleKeyDown(e, index) {
    if (e.key === "Enter" && index === rows.length - 1) {
      setRows((prev) => [...prev, createRow()]);
    }
  }

  function handleReset() {
    setRows([createRow(), createRow()]);
    setShares("");
  }

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="text-xs text-text/60">{mode.help}</p>

        {parsedRows.map((row, index) => (
          <div key={row.id} className="flex items-start gap-2">
            {index === 0 ? (
              <span className="w-12 shrink-0 py-2 text-center text-lg font-bold text-text/40">=</span>
            ) : (
              <button
                type="button"
                onClick={() => updateRow(row.id, { sign: row.sign === "+" ? "-" : "+" })}
                className={`w-12 shrink-0 rounded-xl py-2 text-lg font-bold ${
                  row.sign === "+" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
                title="Toggle add / subtract"
              >
                {row.sign === "+" ? "+" : "−"}
              </button>
            )}

            <div className="min-w-0 flex-1">
              <input
                type="text"
                inputMode="decimal"
                autoFocus={index === rows.length - 1 && index > 1}
                value={row.value}
                onChange={(e) => updateRow(row.id, { value: e.target.value.replace(/[^\d.]/g, "") })}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={mode.placeholder}
                className={`w-full rounded-xl border bg-white px-3 py-2 text-lg tracking-wide text-text outline-none ${
                  row.parsed.valid ? "border-border focus:border-primary" : "border-red-400"
                }`}
              />
              <p className={`mt-1 text-xs ${row.parsed.valid ? "text-text/50" : "text-red-600"}`}>
                {row.parsed.valid ? row.parsed.description || "\u00a0" : mode.error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              className="shrink-0 rounded-xl px-3 py-2 text-lg text-red-600 hover:bg-red-50 disabled:opacity-30"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, createRow()])}
          className="w-full rounded-xl border-2 border-dashed border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          + Add Land
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-primary/25 bg-primary/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
            Total Land ({rows.length})
          </p>
          <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
            {hasInvalid ? "—" : mode.format(totalUnits)}
          </p>
          {mode.secondary && !hasInvalid && (
            <p className="mt-1 text-lg font-semibold text-primary/80">{mode.secondary(totalUnits)}</p>
          )}
          <p className="mt-0.5 text-[11px] text-primary/60">{mode.totalHint(totalUnits)}</p>
        </div>

        <div className="rounded-2xl border-2 border-primary/25 bg-primary/10 p-4">
          <label className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-primary/70">
            Equal Shares
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="How many"
              className="w-20 rounded-lg border border-primary/30 bg-white px-2 py-1 text-sm text-text outline-none focus:border-primary"
            />
          </label>
          <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
            {canDivide && !hasInvalid ? mode.format(shareUnits) : "—"}
          </p>
          {mode.secondary && canDivide && !hasInvalid && (
            <p className="mt-1 text-lg font-semibold text-primary/80">{mode.secondary(shareUnits)}</p>
          )}
          <p className="mt-0.5 text-[11px] text-primary/60">
            {remainderUnits ? `Each share · ${mode.remainderLabel(remainderUnits)}` : "Each share"}
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={handleReset}
        className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-background"
      >
        Reset
      </button>
    </div>
  );
}

const UNIT_TABLE = [
  ["1 Bigha", "20 Katha", "62.5 dismil"],
  ["1 Katha", "20 Dhur", "3.125 dismil"],
  ["1 Dhur", "20 Dhurki", "0.15625 dismil"],
  ["1 Dhurki", "—", "0.0078125 dismil"],
];

const FORMULA_STEPS = [
  ["Bigha", "floor(D ÷ 62.5)", "floor(40 ÷ 62.5) = 0", "40 − 0 = 40"],
  ["Katha", "floor(remaining ÷ 3.125)", "floor(40 ÷ 3.125) = 12", "40 − 37.5 = 2.5"],
  ["Dhur", "floor(remaining ÷ 0.15625)", "floor(2.5 ÷ 0.15625) = 16", "2.5 − 2.5 = 0"],
  ["Dhurki", "round(remaining ÷ 0.0078125)", "round(0 ÷ 0.0078125) = 0", "—"],
];

function ConversionNote() {
  return (
    <section className="space-y-4 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm sm:p-6">
      <h3 className="font-semibold text-primary">Dismil → Bigha.Katha.Dhur.Dhurki</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-text/60">
            <tr>
              <th className="py-1 pr-4">Unit</th>
              <th className="py-1 pr-4">Equals</th>
              <th className="py-1">In dismil</th>
            </tr>
          </thead>
          <tbody>
            {UNIT_TABLE.map(([unit, equals, decimal]) => (
              <tr key={unit} className="border-t border-border">
                <td className="py-1 pr-4 font-medium">{unit}</td>
                <td className="py-1 pr-4">{equals}</td>
                <td className="py-1">{decimal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-medium">
          Formula (D = dismil) — example: <span className="text-primary">40 dismil</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-text/60">
              <tr>
                <th className="py-1 pr-4">Step</th>
                <th className="py-1 pr-4">Formula</th>
                <th className="py-1 pr-4">Example</th>
                <th className="py-1">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {FORMULA_STEPS.map(([step, formula, example, remaining]) => (
                <tr key={step} className="border-t border-border">
                  <td className="py-1 pr-4 font-medium">{step}</td>
                  <td className="py-1 pr-4 font-mono text-xs">{formula}</td>
                  <td className="py-1 pr-4 font-mono text-xs">{example}</td>
                  <td className="py-1 font-mono text-xs">{remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-semibold text-primary">Result: 40 dismil = 0.12.16</p>
      </div>

      <p className="text-xs text-text/60">
        Based on the Bihar standard 1 Bigha = 62.5 dismil. Bigha size can differ by district.
      </p>
    </section>
  );
}

const NOTE_PASSWORD = "668580";

function NotePasswordForm({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === NOTE_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm sm:p-6"
    >
      <label className="block font-medium">
        Enter password to view the note
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={`mt-1 w-full max-w-xs rounded-xl border bg-white px-3 py-2 text-text outline-none ${
            error ? "border-red-400" : "border-border focus:border-primary"
          }`}
        />
      </label>
      {error && <p className="text-red-600">Wrong password</p>}
      <button
        type="submit"
        className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
      >
        Unlock
      </button>
    </form>
  );
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("rakwa");
  const [showNote, setShowNote] = useState(false);
  const [noteUnlocked, setNoteUnlocked] = useState(false);

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text sm:text-xl">Land Calculator</h2>
       
       
        <Link
          to="/"
          className="shrink-0 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-background"
        >
          ← Back
        </Link>
      </section>

      <div className="flex justify-between gap-2">
        <div>

        {Object.entries(MODES).map(([key, mode]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-xl px-4 mx-2 py-2 text-sm font-semibold ${
              activeTab === key
                ? "bg-primary text-white"
                : "border border-border bg-card text-text hover:bg-background"
            }`}
          >
            {mode.label}
          </button>
        ))}

        </div>
        <button
          type="button"
          onClick={() => setShowNote((prev) => !prev)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            showNote
              ? "bg-primary text-white"
              : "border border-border bg-card text-text hover:bg-background"
          }`}
        >
          📝 Note
        </button>
      </div>

      {showNote && (noteUnlocked ? <ConversionNote /> : <NotePasswordForm onUnlock={() => setNoteUnlocked(true)} />)}

      {Object.entries(MODES).map(([key, mode]) => (
        <div key={key} hidden={activeTab !== key}>
          <Calculator mode={mode} />
        </div>
      ))}
    </div>
  );
}
