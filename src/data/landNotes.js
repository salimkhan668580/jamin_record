export const LAND_SHARE_NOTES = [
  {
    id: "aslam-mk",
    from: "Md.Aslam Khan",
    to: "M.K. Khan",
    share: "2 कट्ठा",
    khesra: "9882",
    giver: {
      name: "Md.Aslam Khan",
      before: "0.4.19",
      gives: "0.2.0",
      after: "0.2.19",
    },
    receiver: {
      name: "M.K. Khan",
      before: "0.4.19",
      receives: "0.2.0",
      after: "0.6.19",
    },
  },
  {
    id: "islam-mk",
    from: "Md.Islam Khan",
    to: "M.K. Khan",
    share: "1 कट्ठा",
    khesra: "9759",
    giver: {
      name: "Islam",
      before: "0.1.9",
      gives: "0.1.0",
      after: "0.0.9",
    },
    receiver: {
      name: "M.K. Khan",
      before: "0.3.3",
      receives: "0.1.0",
      after: "0.4.3",
    },
  },
  {
    id: "junaid-mk",
    from: "Junaid Khan",
    to: "M.K. Khan",
    share: "1 कट्ठा",
    khesra: "9838",
    giver: {
      name: "Junaid Khan",
      before: "0.3.7",
      gives: "0.1.0",
      after: "0.2.7",
    },
    receiver: {
      name: "M.K. Khan",
      before: "0.3.7",
      receives: "0.1.0",
      after: "0.4.7",
    },
  },
];

/** Common खेसरा — transfer option tables (Aslam / Islam / Junaid → M.K. Khan) */
export const TRANSFER_OPTION_TABLES = [
  {
    id: "aslam-mk",
    title: " Md.Aslam Khan → M.K. Khan",
    subtitle: "There are 8 valid common khesara:",
    giverCol: "Md.Aslam Khan ke paas",
    receiverCol: "M.K. Khan ke paas",
    rows: [
      { khata: "1451", khesra: "9466", giverRakwa: "0.3.9", receiverRakwa: "0.3.8" },
      { khata: "1451", khesra: "9467", giverRakwa: "0.3.5", receiverRakwa: "0.3.6" },
      { khata: "2007", khesra: "9746", giverRakwa: "0.6.10", receiverRakwa: "0.4.0" },
      { khata: "1452", khesra: "9759", giverRakwa: "0.3.3", receiverRakwa: "0.3.3" },
      { khata: "1452", khesra: "9766", giverRakwa: "0.2.5", receiverRakwa: "0.1.14" },
      { khata: "1452", khesra: "9781", giverRakwa: "0.2.1", receiverRakwa: "0.3.12" },
      { khata: "1452", khesra: "9835", giverRakwa: "0.2.8", receiverRakwa: "0.2.8" },
      { khata: "1047", khesra: "9882", giverRakwa: "0.4.19", receiverRakwa: "0.4.19" },
    ],
  },
  {
    id: "islam-mk",
    title: "Md.Islam Khan → M.K. Khan",
    subtitle: "There are 5 common khesara:",
    giverCol: "Md.Islam Khan ke paas",
    receiverCol: "M.K. Khan ke paas",
    rows: [
      { khata: "1173", khesra: "9578", giverRakwa: "0.6.9", receiverRakwa: "0.4.13" },
      { khata: "2007", khesra: "9746", giverRakwa: "0.5.10", receiverRakwa: "0.4.0" },
      { khata: "1452", khesra: "9759", giverRakwa: "0.1.9", receiverRakwa: "0.3.3" },
      { khata: "1452", khesra: "9766", giverRakwa: "0.2.5", receiverRakwa: "0.1.14" },
      { khata: "1452", khesra: "9835", giverRakwa: "0.2.4", receiverRakwa: "0.2.8" },
    ],
  },
  {
    id: "junaid-mk",
    title: "Junaid Khan → M.K. Khan",
    subtitle: "There are 4 common khesara:",
    giverCol: "Junaid Khan ke paas",
    receiverCol: "M.K. Khan ke paas",
    rows: [
      { khata: "2007", khesra: "9746", giverRakwa: "0.10.0", receiverRakwa: "0.4.0" },
      { khata: "1452", khesra: "9766", giverRakwa: "0.2.5", receiverRakwa: "0.1.14" },
      { khata: "1452", khesra: "9835", giverRakwa: "0.2.8", receiverRakwa: "0.2.8" },
      { khata: "1450", khesra: "9838", giverRakwa: "0.3.7", receiverRakwa: "0.3.7" },
    ],
  },
];
