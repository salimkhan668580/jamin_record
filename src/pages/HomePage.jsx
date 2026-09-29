import BrotherCard from "../components/BrotherCard";
import NoteCard from "../components/NoteCard";
import { BROTHERS } from "../data/brothers";
import { hasExcelSheet } from "../lib/loadExcelRecords";
import { dhurToRakwa, rakwaToDhur } from "../lib/rakwa";

function SummaryCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border-2 border-primary/25 bg-primary/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-[11px] text-primary/60">{hint}</p>
    </div>
  );
}

export default function HomePage({ records }) {
  const totalDhur = records.reduce((sum, record) => sum + rakwaToDhur(record.rakwa), 0);
  const shareDhur = Math.floor(totalDhur / BROTHERS.length);
  const remainderDhur = totalDhur % BROTHERS.length;

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-semibold text-text sm:text-xl">Summary Land Record</h2>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="Total Land" value={dhurToRakwa(totalDhur)} hint="बीघा · कट्ठा · धुर" />
        <SummaryCard
          label={`Total / ${BROTHERS.length}`}
          value={dhurToRakwa(shareDhur)}
          hint={remainderDhur ? `हर भाई का हिस्सा · ${remainderDhur} धुर शेष` : "हर भाई का हिस्सा"}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BROTHERS.map((brother) => {
          const brotherRecords = records.filter((record) => record.brotherId === brother.id);
          const enabled = hasExcelSheet(brother.id);

          return (
            <BrotherCard
              key={brother.id}
              brother={brother}
              records={brotherRecords}
              disabled={!enabled}
            />
          );
        })}

        <NoteCard />
      </section>
    </div>
  );
}
