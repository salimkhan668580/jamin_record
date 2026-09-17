import { useEffect, useState } from "react";
import { loadLandRecordsFromExcel } from "../lib/loadExcelRecords";

export default function useExcelRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadLandRecordsFromExcel();
        if (!cancelled) setRecords(data);
      } catch (err) {
        if (!cancelled) {
          setRecords([]);
          setError(err instanceof Error ? err.message : "Failed to load Excel");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { records, loading, error };
}
