import BrotherCard from "../components/BrotherCard";
import StatTile from "../components/StatTile";
import { BROTHERS } from "../data/brothers";
import { hasExcelSheet } from "../lib/loadExcelRecords";
import { sumRakwa, sumYeDi } from "../lib/rakwa";

export default function HomePage({ records }) {
  const infoCount = records.filter((record) => record.isInfo).length;

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-semibold text-text sm:text-xl">Summary Land Record</h2>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="कुल रिकॉर्ड" value={records.length} />
        <StatTile label="कुल रकवा" value={sumRakwa(records)} hint="बीघा.कट्ठा.धुर" />
        <StatTile label="कुल ए0 डी0" value={sumYeDi(records)} />
        <StatTile label="Info" value={infoCount} />
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
      </section>
    </div>
  );
}
