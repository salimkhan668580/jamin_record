import BrotherCard from "../components/BrotherCard";
import NoteCard from "../components/NoteCard";
import { BROTHERS } from "../data/brothers";
import { hasExcelSheet } from "../lib/loadExcelRecords";

export default function HomePage({ records }) {
  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-semibold text-text sm:text-xl">Summary Land Record</h2>
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

        <NoteCard/>
      </section>
    </div>
  );
}
