// रकवा is written as बीघा.कट्ठा.धुर (e.g. "0.3.7"), so totals need base-20 math.
const DHUR_PER_KATHA = 20;
const KATHA_PER_BIGHA = 20;
const DHUR_PER_BIGHA = KATHA_PER_BIGHA * DHUR_PER_KATHA;

export function rakwaToDhur(value) {
  const parts = String(value ?? "").match(/\d+/g);
  if (!parts) return 0;

  const [bigha = 0, katha = 0, dhur = 0] = parts.slice(0, 3).map(Number);
  return bigha * DHUR_PER_BIGHA + katha * DHUR_PER_KATHA + dhur;
}

export function dhurToRakwa(totalDhur) {
  const bigha = Math.floor(totalDhur / DHUR_PER_BIGHA);
  const katha = Math.floor((totalDhur % DHUR_PER_BIGHA) / DHUR_PER_KATHA);
  const dhur = totalDhur % DHUR_PER_KATHA;
  return `${bigha}.${katha}.${dhur}`;
}

// Calculator input may also carry a 4th part, धुरकी (20 धुरकी = 1 धुर).
const DHURKI_PER_DHUR = 20;
export const RAKWA_UNITS = ["बीघा", "कट्ठा", "धुर", "धुरकी"];

export function parseRakwa(value) {
  const text = String(value ?? "").trim();
  if (!text) return { parts: [], dhurki: 0, valid: true };
  if (!/^\d+(\.\d+){0,3}$/.test(text)) return { parts: [], dhurki: 0, valid: false };

  const parts = text.split(".").map(Number);
  const [bigha = 0, katha = 0, dhur = 0, dhurki = 0] = parts;
  const totalDhurki =
    ((bigha * KATHA_PER_BIGHA + katha) * DHUR_PER_KATHA + dhur) * DHURKI_PER_DHUR + dhurki;
  return { parts, dhurki: totalDhurki, valid: true };
}

export function dhurkiToRakwa(totalDhurki) {
  const sign = totalDhurki < 0 ? "-" : "";
  const value = Math.abs(totalDhurki);
  const dhurki = value % DHURKI_PER_DHUR;
  const totalDhur = Math.floor(value / DHURKI_PER_DHUR);
  const base = dhurToRakwa(totalDhur);
  return `${sign}${base}${dhurki ? `.${dhurki}` : ""}`;
}

export function sumRakwa(records) {
  const totalDhur = records.reduce((total, record) => total + rakwaToDhur(record.rakwa), 0);
  return dhurToRakwa(totalDhur);
}

export function sumYeDi(records) {
  const total = records.reduce(
    (sum, record) => sum + (Number.parseFloat(record.yeDi) || 0),
    0,
  );
  return Math.round(total * 1000) / 1000;
}
