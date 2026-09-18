export const EXCEL_URL = "/jamin_record.xlsx";

/** Brothers that load from Excel (sheet name must match exactly). */
export const EXCEL_BROTHER_SHEETS = {
  "mk-khan": { sheetName: "M.k.khan Details", idPrefix: "mk" },
  "md-ali": { sheetName: "Md_Ali_details", idPrefix: "ali" },
};

export const MK_KHAN_BROTHER_ID = "mk-khan";
export const MD_ALI_BROTHER_ID = "md-ali";

export function hasExcelSheet(brotherId) {
  return Boolean(EXCEL_BROTHER_SHEETS[brotherId]);
}

export function getExcelSheetName(brotherId) {
  return EXCEL_BROTHER_SHEETS[brotherId]?.sheetName ?? null;
}

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

export function parseBrotherSheet(workbook, XLSX, brotherId) {
  const config = EXCEL_BROTHER_SHEETS[brotherId];
  if (!config) return [];

  const sheet = workbook.Sheets[config.sheetName];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rows.filter(isValidRow).map((row, index) => {
    const status = cell(row["Status"]) || "Correct";
    const message = cell(row["Message"]);
    return {
      id: `${config.idPrefix}-${index + 1}`,
      brotherId,
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

export function parseAllExcelRecords(workbook, XLSX) {
  return Object.keys(EXCEL_BROTHER_SHEETS).flatMap((brotherId) =>
    parseBrotherSheet(workbook, XLSX, brotherId),
  );
}

/** @deprecated use parseBrotherSheet / parseAllExcelRecords */
export function parseMkKhanSheet(workbook, XLSX) {
  return parseBrotherSheet(workbook, XLSX, MK_KHAN_BROTHER_ID);
}

export async function loadLandRecordsFromExcel(url = EXCEL_URL) {
  const XLSX = await import("xlsx");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Excel file not found (${response.status})`);
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  return parseAllExcelRecords(workbook, XLSX);
}
