import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AUTH_KEY } from "./loginPage";

const documents = [
  { title: "वंशावली", src: "/vansavali.jpeg", type: "image" },
  { title: "Dadi Samsudin Maulana", src: "/Samsudin -dadi.png", type: "image" },
  { title: "Rajpur Bagha", src: "/rajpur bagha (1).jpg", type: "image" },
  { title: "Tamkuhi Road – Avinash", src: "/tamkuhi road avinash (2).png", type: "image" },
  { title: "Bihar – Dhobi Wala", src: "/Bihar dhobi wala.pdf", type: "pdf" },
  { title: "Bihar Jamin", src: "/bihar jamin .pdf", type: "pdf" },
  { title: "Bihar Jamin (1)", src: "/bihar jamin (1).pdf", type: "pdf" },
  { title: "Bihar Jamin Dadi (1)", src: "/bihar jamin dadi (1).pdf", type: "pdf" },
  { title: "Bihar Jamin Dadi (2)", src: "/bihar jamin dadi (2).pdf", type: "pdf" },
  { title: "Sheet No. 9", src: "/sheet no. 9.pdf", type: "pdf", isMap: true },
  { title: "Sheet No. 9 – Dada Jamin", src: "/sheet no. 9 dada jamin.pdf", type: "pdf", isMap: true },
  { title: "Sheet No. 9 – Dadi Jamin", src: "/sheet no. 9 Dadi jamin.pdf", type: "pdf", isMap: true },
  { title: "Tamkuhi Road Map", src: "/tamkuhi road map.png", type: "image", isMap: true },
  { title: "Abhinash Singh – Tamkuhi Road", src: "/abhinash Singh tamkuhi road .pdf", type: "pdf" },
  { title: "Samsuddin Maulana – Tamkuhi Road", src: "/Samsuddin maulana tamkuhi road .pdf", type: "pdf" },
  { title: "Dadi – School ke Piche", src: "/dadi =- school k piche.pdf", type: "pdf" },
  { title: "Jamin No. in Dada Handwriting", src: "/jamin no. in Dada handwriting .pdf", type: "pdf" },
  { title: "Jamin Rasid and Doc 2916", src: "/jamin_rasid and doc  2916.pdf", type: "pdf" },
  { title: "Tabasum Fuffi Wala – Bihar", src: "/tabasum fuffi wala bihar .pdf", type: "pdf" },
];

export default function DadiHomePage() {
  const navigate = useNavigate();
  const [openDoc, setOpenDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const visibleDocs = activeTab === "map" ? documents.filter((doc) => doc.isMap) : documents;

  if (localStorage.getItem(AUTH_KEY) !== "true") {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    navigate("/", { replace: true });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {[
          ["all", "All"],
          ["map", "Map"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === key
                ? "bg-primary text-white"
                : "border border-border bg-card text-text hover:bg-background"
            }`}
          >
            {label}
          </button>
        ))}
       
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDocs.map((doc) => (
          <button
            key={doc.src}
            type="button"
            onClick={() => setOpenDoc(doc)}
            className="block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm hover:shadow-md"
          >
            {doc.type === "image" ? (
              <img src={encodeURI(doc.src)} alt={doc.title} className="h-56 w-full object-cover object-top" />
            ) : (
              <div className="flex h-56 w-full flex-col items-center justify-center gap-2 bg-red-50 text-red-600">
                <span className="text-5xl">📄</span>
                <span className="text-sm font-semibold">PDF</span>
              </div>
            )}
            <div className="truncate px-4 py-3 font-semibold">{doc.title}</div>
          </button>
        ))}
      </div>

      {openDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenDoc(null)}
        >
          <button
            type="button"
            onClick={() => setOpenDoc(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 px-3 py-1 text-xl text-white hover:bg-white/30"
            aria-label="Close"
          >
            ×
          </button>
          {openDoc.type === "image" ? (
            <img
              src={encodeURI(openDoc.src)}
              alt={openDoc.title}
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <iframe
              src={encodeURI(openDoc.src)}
              title={openDoc.title}
              className="h-full w-full max-w-5xl rounded-lg bg-white"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}
