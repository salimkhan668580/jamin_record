export const EXCEL_URL = "/jamin_record.xlsx";
export const MK_KHAN_SHEET = "M.k.khan Details";
export const MK_KHAN_BROTHER_ID = "mk-khan";

function cell(value) {
  if (value == null) return "";
  return String(value).trim();
}

function isDispute(status) {
  return cell(status).toLowerCase() === "dispute";
}

function isValidRow(row) {
  const khata = cell(row["खाता"]);
  const khesra = cell(row["खेसरा"]);
  if (!khata || !khesra) return false;
  // Skip broken/total rows Excel sometimes appends
  if (khesra === "0" || khata.length > 8) return false;
  return true;
}

export function parseMkKhanSheet(workbook, XLSX) {
  const sheet = workbook.Sheets[MK_KHAN_SHEET];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rows.filter(isValidRow).map((row, index) => {
    const status = cell(row["Status"]) || "Correct";
    return {
      id: `mk-${index + 1}`,
      brotherId: MK_KHAN_BROTHER_ID,
      khata: cell(row["खाता"]),
      khesra: cell(row["खेसरा"]),
      rakwa: cell(row["रकवा"]),
      yeDi: cell(row["ए0 डी0"]),
      status,
      message: cell(row["Message"]),
      isDispute: isDispute(status),
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
