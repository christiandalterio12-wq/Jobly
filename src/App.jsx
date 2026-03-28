import React, { useState } from "react";
import {
  Briefcase,
  Send,
  Bell,
  User,
  MessageSquare,
  FileText
} from "lucide-react";

export default function App() {
  const [tab, setTab] = useState("offerte");

  const [autoApply, setAutoApply] = useState({
    enabled: true,
    match: 80,
    ral: 28000
  });

  const offerte = [
    {
      ruolo: "Back Office Commerciale",
      azienda: "Adecco",
      match: 91
    },
    {
      ruolo: "Customer Care Specialist",
      azienda: "Randstad",
      match: 84
    }
  ];

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>JOBLY</h1>
      </header>

      {/* HERO */}
      <section className="hero">
        <h2>
          Trova il lavoro giusto,
          <br />
          con un’interfaccia che ti fa tornare.
        </h2>
      </section>

      {/* TAB MENU */}
      <div className="tabs">
        <button onClick={() => setTab("offerte")}>
          <Briefcase size={16} /> Offerte
        </button>
        <button onClick={() => setTab("candidature")}>
          <Send size={16} /> Candidature
        </button>
        <button onClick={() => setTab("messaggi")}>
          <MessageSquare size={16} /> Messaggi
        </button>
        <button onClick={() => setTab("cv")}>
          <FileText size={16} /> CV Studio
        </button>
        <button onClick={() => setTab("profilo")}>
          <User size={16} /> Profilo
        </button>
      </div>

      {/* CONTENUTO */}
      <div className="content">

        {/* OFFERTE */}
        {tab === "offerte" && (
          <div>
            <h3>Offerte consigliate</h3>
            {offerte.map((o, i) => (
              <div key={i} className="card">
                <h4>{o.ruolo}</h4>
                <p>{o.azienda}</p>
                <span>Match {o.match}%</span>
              </div>
            ))}
          </div>
        )}

        {/* CANDIDATURE */}
        {tab === "candidature" && (
          <div>
            <h3>Candidature inviate</h3>
            <p>Nessuna candidatura recente</p>
          </div>
        )}

        {/* MESSAGGI */}
        {tab === "messaggi" && (
          <div>
            <h3>Chat recruiter</h3>
            <div className="card">
              <b>HR - Amazon</b>
              <p>Ciao, abbiamo visto il tuo profilo.</p>
            </div>
          </div>
        )}

        {/* CV STUDIO + AUTO APPLY */}
        {tab === "cv" && (
          <div>
            <h3>Auto Apply AI</h3>

            <div className="card">
              <label>Attivo</label>
              <select
                value={autoApply.enabled}
                onChange={(e) =>
                  setAutoApply({
                    ...autoApply,
                    enabled: e.target.value === "true"
                  })
                }
              >
                <option value="true">Sì</option>
                <option value="false">No</option>
              </select>

              <label>Match minimo</label>
              <input
                type="range"
                min="50"
                max="100"
                value={autoApply.match}
                onChange={(e) =>
                  setAutoApply({
                    ...autoApply,
                    match: e.target.value
                  })
                }
              />
              <span>{autoApply.match}%</span>

              <label>RAL minima</label>
              <input
                type="range"
                min="20000"
                max="50000"
                step="1000"
                value={autoApply.ral}
                onChange={(e) =>
                  setAutoApply({
                    ...autoApply,
                    ral: e.target.value
                  })
                }
              />
              <span>{autoApply.ral}€</span>
            </div>
          </div>
        )}

        {/* PROFILO */}
        {tab === "profilo" && (
          <div>
            <h3>Profilo</h3>

            <div className="card">
              <p>Christian B</p>
              <div className="file-box">
                <FileText size={16} color="#ef4444" />
                CV_Christian.pdf
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
