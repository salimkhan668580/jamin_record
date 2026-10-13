import { Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import DadiHomePage from "./components/dadi/HomePage";
import LoginPage from "./components/dadi/loginPage";
import useExcelRecords from "./hooks/useExcelRecords";
import BrotherPage from "./pages/BrotherPage";
import CalculatorPage from "./pages/CalculatorPage";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";

export default function App() {
  const { records, loading, error } = useExcelRecords();

  return (
    <div className="min-h-dvh bg-background text-text">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 py-4 pb-12 sm:px-6 sm:py-6">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-sm text-text/60">
            Loading...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700">
            Excel लोड नहीं हुआ: {error}
            <p className="mt-2 text-xs text-red-600/80">
              सुनिश्चित करें कि <code>public/jamin_record.xlsx</code> मौजूद है।
            </p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage records={records} />} />
            <Route path="/brother/:brotherId" element={<BrotherPage records={records} />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dadi" element={<DadiHomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}
