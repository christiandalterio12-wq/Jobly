import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, MapPin, Sparkles, Send, FileText, Building2, Filter, Bookmark, ChevronRight } from "lucide-react";

const offersSeed = [
  { id: 1, title: "Back Office Commerciale", company: "Adecco", city: "Milano", zone: "Bovisa", distance: 6, contract: "Tempo indeterminato", salary: "28K-32K", remote: "Ibrido", category: "Amministrazione", match: 91, urgent: true },
  { id: 2, title: "Customer Care Specialist", company: "Randstad", city: "Milano", zone: "Porta Garibaldi", distance: 9, contract: "Tempo determinato", salary: "24K-27K", remote: "On-site", category: "Customer Service", match: 84, urgent: false },
  { id: 3, title: "Order Management Specialist", company: "DHL", city: "Segrate", zone: "Centro Direzionale", distance: 14, contract: "Tempo indeterminato", salary: "30K-34K", remote: "Ibrido", category: "Logistica", match: 96, urgent: true },
  { id: 4, title: "Magazziniere", company: "Amazon", city: "Pioltello", zone: "Hub Est", distance: 18, contract: "Somministrazione", salary: "22K-25K", remote: "On-site", category: "Logistica", match: 75, urgent: false },
  { id: 5, title: "Receptionist Aziendale", company: "Gi Group", city: "Milano", zone: "CityLife", distance: 7, contract: "Part-time", salary: "18K-20K", remote: "On-site", category: "Segreteria", match: 72, urgent: false },
  { id: 6, title: "Help Desk IT", company: "Sielte", city: "Segrate", zone: "Business Park", distance: 16, contract: "Tempo indeterminato", salary: "27K-31K", remote: "Ibrido", category: "IT", match: 88, urgent: false },
];

const notificationsSeed = [
  "Nuova offerta compatibile al 96% pubblicata da DHL.",
  "Un recruiter ha visualizzato il tuo profilo.",
  "La tua candidatura per Help Desk IT è in valutazione.",
];

const aiReply = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes("milano") && lower.includes("indeterminato")) {
    return "Ti suggerisco di filtrare Milano + Tempo indeterminato. In questo mock, le offerte più forti sono Order Management Specialist e Back Office Commerciale.";
  }
  if (lower.includes("cv")) {
    return "Suggerimento CV: evidenzia gestione ordini, SAP, customer support, precisione operativa e risultati misurabili. Tieni il profilo entro 5-6 righe.";
  }
  if (lower.includes("stipendio") || lower.includes("ral")) {
    return "Per ruoli impiegatizi junior-intermediate a Milano, mostrare una fascia RAL aumenta la qualità percepita dell’annuncio e migliora il tasso di candidatura.";
  }
  return "Posso aiutarti a filtrare offerte, migliorare il CV, leggere una job description o suggerire candidature coerenti con il tuo profilo.";
};

function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}
function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}
function Input(props) {
  return <input {...props} className={`input ${props.className || ""}`} />;
}
function SelectField({ value, onChange, options, className = "" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`select ${className}`}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
function Textarea(props) {
  return <textarea {...props} className={`textarea ${props.className || ""}`} />;
}
function Button({ children, className = "", ...props }) {
  return <button {...props} className={`btn ${className}`}>{children}</button>;
}

function OfferCard({ offer, onApply, saved, onToggleSave }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.18 }}>
      <Card>
        <div className="card-head">
          <div>
            <h3 className="offer-title">{offer.title}</h3>
            <div className="meta">
              <Building2 size={16} /> {offer.company}
              <span className="dot">•</span>
              <MapPin size={16} /> {offer.city}, {offer.zone}
            </div>
          </div>
          <div className="right-stack">
            {offer.urgent && <Badge className="badge-red">Urgente</Badge>}
            <Badge>Match {offer.match}%</Badge>
          </div>
        </div>
        <div className="chips">
          <Badge>{offer.contract}</Badge>
          <Badge>{offer.salary}</Badge>
          <Badge>{offer.remote}</Badge>
          <Badge>{offer.distance} km</Badge>
        </div>
        <div className="actions">
          <Button className="btn-red" onClick={() => onApply(offer)}>Candidati</Button>
          <Button className="btn-dark" onClick={() => onToggleSave(offer.id)}>
            <Bookmark size={16} /> {saved ? "Salvata" : "Salva"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function JoblyApp() {
  const [tab, setTab] = useState("offerte");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [contract, setContract] = useState("all");
  const [maxDistance, setMaxDistance] = useState("30");
  const [savedIds, setSavedIds] = useState([1]);
  const [applications, setApplications] = useState([
    { id: 101, title: "Help Desk IT", company: "Sielte", status: "In valutazione" },
    { id: 102, title: "Customer Care Specialist", company: "Randstad", status: "Inviata" },
  ]);
  const [profile, setProfile] = useState({
    name: "Christian D.",
    role: "Back Office / Order Management / Customer Support",
    city: "Milano",
    bio: "Profilo operativo con esperienza in customer support, gestione ordini e strumenti gestionali. Cerco ruoli stabili con crescita.",
    skills: "SAP, Back Office, Customer Care, Excel, Ticketing, Gestione ordini",
    cvName: "CV_Christian.pdf",
  });
  const [jobPosts, setJobPosts] = useState([
    { title: "Impiegato Ufficio Acquisti", company: "Studio Retail", city: "Milano", contract: "Tempo indeterminato" }
  ]);
  const [newPost, setNewPost] = useState({ title: "", company: "", city: "", contract: "Tempo indeterminato" });
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([
    { who: "ai", text: "Ciao, sono l’assistente Jobly. Posso aiutarti a trovare offerte, migliorare il CV e capire quali candidature hanno più senso." },
  ]);

  const filteredOffers = useMemo(() => {
    return offersSeed.filter((o) => {
      const okSearch = !search || [o.title, o.company, o.city, o.zone, o.category].join(" ").toLowerCase().includes(search.toLowerCase());
      const okCity = city === "all" || o.city === city;
      const okContract = contract === "all" || o.contract === contract;
      const okDistance = o.distance <= Number(maxDistance);
      return okSearch && okCity && okContract && okDistance;
    });
  }, [search, city, contract, maxDistance]);

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 20;
    if (profile.role) score += 20;
    if (profile.city) score += 20;
    if (profile.bio) score += 20;
    if (profile.skills) score += 10;
    if (profile.cvName) score += 10;
    return score;
  }, [profile]);

  const applyToOffer = (offer) => {
    const exists = applications.some((a) => a.title === offer.title && a.company === offer.company);
    if (!exists) {
      setApplications((prev) => [{ id: Date.now(), title: offer.title, company: offer.company, status: "Inviata" }, ...prev]);
    }
  };
  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChat((prev) => [...prev, { who: "user", text: userMsg }, { who: "ai", text: aiReply(userMsg) }]);
    setChatInput("");
  };
  const addPost = () => {
    if (!newPost.title || !newPost.company || !newPost.city) return;
    setJobPosts((prev) => [newPost, ...prev]);
    setNewPost({ title: "", company: "", city: "", contract: "Tempo indeterminato" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand"><span className="brand-white">JOB</span><span className="brand-red">LY</span></div>
          <Badge className="badge-dark">AI Job Platform</Badge>
        </div>
        <div className="top-icons"><Bell size={20} /><User size={20} /></div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>Trova il lavoro giusto, con un’interfaccia che ti fa tornare.</h1>
          <p>Jobly unisce offerte, candidature, profilo pubblico e assistente AI in un’unica esperienza moderna.</p>
          <div className="chips">
            <Badge className="badge-red">Match intelligenti</Badge>
            <Badge className="badge-dark">Filtri smart</Badge>
            <Badge className="badge-dark">Recruiter view</Badge>
          </div>
        </div>
        <Card className="search-card">
          <div className="label-row"><Filter size={16} /> Ricerca rapida</div>
          <div className="search-line">
            <Search size={16} className="search-icon" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ruolo, azienda, città..." />
          </div>
          <div className="filters-grid">
            <SelectField value={city} onChange={setCity} options={[
              { value: "all", label: "Tutte le città" },
              { value: "Milano", label: "Milano" },
              { value: "Segrate", label: "Segrate" },
              { value: "Pioltello", label: "Pioltello" },
            ]} />
            <SelectField value={contract} onChange={setContract} options={[
              { value: "all", label: "Tutti i contratti" },
              { value: "Tempo indeterminato", label: "Tempo indeterminato" },
              { value: "Tempo determinato", label: "Tempo determinato" },
              { value: "Part-time", label: "Part-time" },
              { value: "Somministrazione", label: "Somministrazione" },
            ]} />
            <SelectField value={maxDistance} onChange={setMaxDistance} options={[
              { value: "5", label: "5 km" },
              { value: "10", label: "10 km" },
              { value: "20", label: "20 km" },
              { value: "30", label: "30 km" },
            ]} />
          </div>
        </Card>
      </section>

      <div className="tabs">
        {["offerte", "candidature", "notifiche", "profilo", "ai"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "tab-active" : ""}`} onClick={() => setTab(t)}>
            {t === "ai" ? "AI Support" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <main className="content">
        {tab === "offerte" && (
          <>
            <section>
              <div className="section-head">
                <div>
                  <h2>Offerte consigliate</h2>
                  <p>Selezionate in base al tuo profilo e ai filtri attivi</p>
                </div>
                <div className="muted">{filteredOffers.length} risultati</div>
              </div>
              <div className="offer-grid">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} onApply={applyToOffer} saved={savedIds.includes(offer.id)} onToggleSave={toggleSave} />
                ))}
              </div>
            </section>

            <section>
              <div className="section-head">
                <h3>Offerte pubblicate dai recruiter</h3>
                <Button className="btn-dark">Vedi tutte <ChevronRight size={16} /></Button>
              </div>
              <div className="offer-grid">
                {jobPosts.map((post, idx) => (
                  <Card key={idx}>
                    <div className="offer-title">{post.title}</div>
                    <div className="meta-text">{post.company}</div>
                    <div className="meta-text small">{post.city} • {post.contract}</div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "candidature" && (
          <div className="two-col">
            <Card>
              <h3>Candidature inviate</h3>
              <div className="stack">
                {applications.map((app) => (
                  <div key={app.id} className="inner-box">
                    <div className="offer-title">{app.title}</div>
                    <div className="meta-text small">{app.company}</div>
                    <Badge className="badge-dark">{app.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3>Pubblica un’offerta</h3>
              <div className="stack">
                <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="Titolo ruolo" />
                <Input value={newPost.company} onChange={(e) => setNewPost({ ...newPost, company: e.target.value })} placeholder="Azienda" />
                <Input value={newPost.city} onChange={(e) => setNewPost({ ...newPost, city: e.target.value })} placeholder="Città" />
                <SelectField value={newPost.contract} onChange={(v) => setNewPost({ ...newPost, contract: v })} options={[
                  { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                  { value: "Tempo determinato", label: "Tempo determinato" },
                  { value: "Part-time", label: "Part-time" },
                ]} />
                <Button className="btn-red" onClick={addPost}>Pubblica</Button>
              </div>
            </Card>
          </div>
        )}

        {tab === "notifiche" && (
          <Card>
            <h3>Notifiche</h3>
            <div className="stack">
              {notificationsSeed.map((n, i) => (
                <div key={i} className="notif">
                  <Bell size={18} color="#ef4444" />
                  <div>{n}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "profilo" && (
          <div className="two-col">
            <Card>
              <h3>Area personale</h3>
              <div className="progress-label"><span>Completamento profilo</span><span>{profileCompletion}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${profileCompletion}%` }} /></div>
              <div className="stack">
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Nome" />
                <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} placeholder="Ruolo" />
                <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Città" />
                <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Bio" />
                <Textarea value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="Competenze" />
                <Input value={profile.cvName} onChange={(e) => setProfile({ ...profile, cvName: e.target.value })} placeholder="Nome CV" />
                <Button className="btn-red">Salva profilo</Button>
              </div>
            </Card>

            <Card className="preview-card">
              <h3>Anteprima recruiter</h3>
              <div className="preview-head">
                <div className="avatar">{profile.name?.[0] || "J"}</div>
                <div>
                  <div className="preview-name">{profile.name}</div>
                  <div className="meta-text">{profile.role}</div>
                  <div className="meta-text small"><MapPin size={14} /> {profile.city}</div>
                </div>
              </div>
              <div>
                <div className="section-label">Bio</div>
                <p>{profile.bio}</p>
              </div>
              <div>
                <div className="section-label">Competenze</div>
                <div className="chips">
                  {profile.skills.split(",").map((s, i) => <Badge key={i}>{s.trim()}</Badge>)}
                </div>
              </div>
              <div className="file-box"><FileText size={16} color="#ef4444" /> {profile.cvName}</div>
            </Card>
          </div>
        )}

        {tab === "ai" && (
          <div className="two-col">
            <Card>
              <h3 className="title-row"><Sparkles size={18} color="#ef4444" /> Cosa può fare l’AI</h3>
              <div className="stack">
                <div className="inner-box">Trova offerte in linguaggio naturale: “milano, indeterminato, entro 10 km”.</div>
                <div className="inner-box">Suggerisce come migliorare CV e profilo.</div>
                <div className="inner-box">Aiuta recruiter a scrivere annunci più chiari.</div>
                <div className="inner-box">Spiega perché un’offerta è coerente con il tuo profilo.</div>
              </div>
            </Card>

            <Card>
              <h3>Chat di supporto</h3>
              <div className="chat-box">
                {chat.map((m, i) => (
                  <div key={i} className={`msg ${m.who === "user" ? "msg-user" : "msg-ai"}`}>{m.text}</div>
                ))}
              </div>
              <div className="chat-row">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Scrivi: trova offerte a Milano indeterminato" />
                <Button className="btn-red" onClick={sendChat}><Send size={16} /></Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="footer">
        Jobly — front-end pronto per Render. Backend, database e autenticazione verranno collegati dopo.
      </footer>
    </div>
  );
}
