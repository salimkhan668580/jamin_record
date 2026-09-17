import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 bg-primary text-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg">
          🌾
        </span>
        <Link to="/" className="min-w-0">
          <h1 className="truncate text-base font-semibold sm:text-lg">जमीन रिकॉर्ड</h1>
          <p className="truncate text-xs text-white/75 sm:text-sm">
            खाता · खेसरा · रकवा · ए0 डी0
          </p>
        </Link>
      </div>
    </header>
  );
}
