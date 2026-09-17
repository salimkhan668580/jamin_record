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
