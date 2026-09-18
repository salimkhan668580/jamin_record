export const EXCEL_URL = "/jamin_record.xlsx";
export const MK_KHAN_SHEET = "M.k.khan Details";
export const MK_KHAN_BROTHER_ID = "mk-khan";

function cell(value) {
  if (value == null) return "";
  return String(value).trim();
}

function isFlaggedStatus(status) {
  const value = cell(status).toLowerCase();
  return value === "dispute" || value === "info";
}

function isValidRow(row) {
  const khesra = cell(row["खेसरा"]);
  const rakwa = cell(row["रकवा"]);
  // Keep rows that have a real खेसरा + रकवा (खाता can be 0, e.g. घर)
  if (!khesra || khesra === "0") return false;
  if (!rakwa) return false;
  return true;
}

export function parseMkKhanSheet(workbook, XLSX) {
  const sheet = workbook.Sheets[MK_KHAN_SHEET];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rows.filter(isValidRow).map((row, index) => {
    const status = cell(row["Status"]) || "Correct";
    const message = cell(row["Message"]);
    return {
      id: `mk-${index + 1}`,
      brotherId: MK_KHAN_BROTHER_ID,
      khata: cell(row["खाता"]),
      khesra: cell(row["खेसरा"]),
      rakwa: cell(row["रकवा"]),
      yeDi: cell(row["ए0 डी0"]),
      localName: cell(row["localName"]),
      status,
      message,
      // Excel "Dispute" / "Info" status OR any Message → Info
      isInfo: isFlaggedStatus(status) || Boolean(message),
    };
  });
}

export async function loadLandRecordsFromExcel(url = EXCEL_URL) {
  const XLSX = await import("xlsx");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Excel file not found (${response.status})`);
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  return parseMkKhanSheet(workbook, XLSX);
}
