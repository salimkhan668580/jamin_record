import { Link } from "react-router-dom";
import { LAND_SHARE_NOTES } from "../data/landNotes";

export default function NoteCard() {
  return (
    <Link
      to="/notes"
      className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 transition hover:border-amber-400 hover:shadow-md active:scale-[0.99]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-lg">
        📝
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-amber-950">Land Share Notes</p>
        <p className="text-xs text-amber-900/60">Md.Aslam Khan · Md.Islam Khan · Junaid Khan → M.K. Khan</p>

        <div className="mt-3 space-y-1.5 rounded-xl border border-amber-300/50 bg-white/70 px-3 py-2">
          {LAND_SHARE_NOTES.map((note) => (
            <p key={note.id} className="text-xs leading-relaxed text-amber-950">
              <span className="font-semibold">{note.from}</span> ➡️
              <span className="font-bold text-primary">{note.giver.gives}</span>
             
            </p>
          ))}
          <p className="border-t border-amber-200/80 pt-1.5 text-[10px] text-amber-800/60">
            M.K. Khan will get 0.2.0 + 0.1.0 + 0.1.0
          </p>
        </div>
      </div>

      <span aria-hidden className="self-center text-xl text-amber-900/30">
        ›
      </span>
    </Link>
  );
}
