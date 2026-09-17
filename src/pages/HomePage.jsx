import BrotherCard from "../components/BrotherCard";
import StatTile from "../components/StatTile";
import { BROTHERS } from "../data/brothers";
import { MK_KHAN_BROTHER_ID } from "../lib/loadExcelRecords";
import { sumRakwa, sumYeDi } from "../lib/rakwa";

export default function HomePage({ records }) {
  const disputeCount = records.filter((record) => record.isDispute).length;

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-semibold text-text sm:text-xl">पाँच भाइयों का ब्यौरा</h2>
        <p className="mt-1 text-sm text-text/60">
          अभी M. K. Khan का डेटा Excel से आ रहा है। बाकी भाइयों का डेटा जल्द जोड़ा जाएगा।
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="कुल रिकॉर्ड" value={records.length} />
        <StatTile label="कुल रकवा" value={sumRakwa(records)} hint="बीघा.कट्ठा.धुर" />
        <StatTile label="कुल ए0 डी0" value={sumYeDi(records)} />
        <StatTile label="Dispute" value={disputeCount} />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BROTHERS.map((brother) => {
          const brotherRecords =
            brother.id === MK_KHAN_BROTHER_ID
              ? records
              : [];

          return (
            <BrotherCard
              key={brother.id}
              brother={brother}
              records={brotherRecords}
              disabled={brother.id !== MK_KHAN_BROTHER_ID}
            />
          );
        })}
      </section>
    </div>
  );
}
