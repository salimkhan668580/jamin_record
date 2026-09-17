export const BROTHERS = [
  { id: "mk-khan", name: "M. K. Khan", nameHi: "एम. के. खान", initials: "MK" },
  { id: "md-ali", name: "Md. Ali", nameHi: "मो. अली", initials: "MA" },
  { id: "junaid-khan", name: "Junaid Khan", nameHi: "जुनैद खान", initials: "JK" },
  { id: "md-islam-khan", name: "Md. Islam Khan", nameHi: "मो. इस्लाम खान", initials: "IK" },
  { id: "md-aslam-khan", name: "Md. Aslam Khan", nameHi: "मो. असलम खान", initials: "AK" },
];

export function getBrother(id) {
  return BROTHERS.find((brother) => brother.id === id);
}
