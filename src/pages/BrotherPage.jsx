import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RecordList from "../components/RecordList";
import StatTile from "../components/StatTile";
import { getBrother } from "../data/brothers";
import { MK_KHAN_BROTHER_ID } from "../lib/loadExcelRecords";
import { sumRakwa, sumYeDi } from "../lib/rakwa";

export default function BrotherPage({ records }) {
  const { brotherId } = useParams();
  const brother = getBrother(brotherId);
  const [query, setQuery] = useState("");

  const brotherRecords = useMemo(() => {
    if (brotherId !== MK_KHAN_BROTHER_ID) return [];
    return records;
  }, [brotherId, records]);

  const visibleRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return brotherRecords;

    return brotherRecords.filter((record) =>
      [record.khata, record.khesra, record.rakwa, record.yeDi, record.status, record.message]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [brotherRecords, query]);

  if (!brother) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="font-semibold text-text">यह नाम नहीं मिला</p>
        <Link to="/" className="mt-3 inline-block text-sm font-medium text-primary underline">
          सभी भाइयों की सूची देखें
        </Link>
      </div>
    );
  }

  const infoCount = brotherRecords.filter((record) => record.isInfo).length;
  const hasExcelData = brotherId === MK_KHAN_BROTHER_ID;

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        <span aria-hidden>‹</span> Back
      </Link>

      <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {brother.initials}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-text">{brother.name}</h2>
          <p className=" truncate text-xs text-text/55">{brother.nameHi}</p>
          {hasExcelData ? (
            <p className="mt-1 text-[11px] text-secondary">M.k.khan Details</p>
          ) : (
            <p className="mt-1 text-[11px] text-text/45">Data not available yet</p>
          )}
        </div>
      </section>

    

      {!hasExcelData ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="font-medium text-text">इस भाई का Excel डेटा अभी नहीं है</p>
          <p className="mt-1 text-sm text-text/55">अभी सिर्फ M. K. Khan का sheet जुड़ा है।</p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <StatTile label="रिकॉर्ड" value={brotherRecords.length} />
            <StatTile label="कुल रकवा" value={sumRakwa(brotherRecords)} hint="बीघा.कट्ठा.धुर" />
            <StatTile label="कुल ए0 डी0" value={sumYeDi(brotherRecords)} />
            <StatTile label="Info" value={infoCount} />
          </section>

          {brotherRecords.length > 0 ? (
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="खाता या खेसरा खोजें"
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          ) : null}

          <RecordList records={visibleRecords} />
        </>
      )}
    </div>
  );
}
