import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  User,
  MapPin,
  Sparkles,
  Send,
  FileText,
  Building2,
  Filter,
  Bookmark,
  Wand2,
  Briefcase,
  Trash2,
  Save,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";

const STORAGE_KEYS = {
  theme: "jobly_theme",
  activeTab: "jobly_active_tab",
  profile: "jobly_profile",
  offers: "jobly_offers",
  savedIds: "jobly_saved_ids",
  applications: "jobly_applications",
  notifications: "jobly_notifications",
  authUsers: "jobly_auth_users",
  authSession: "jobly_auth_session",
  chat: "jobly_chat",
  cvData: "jobly_cv_data",
};

const locationData = {
  Lombardia: {
    Milano: {
      Milano: [
        "Centro",
        "Barona",
        "Quarto Oggiaro",
        "Bovisa",
        "Affori",
        "Niguarda",
        "Bicocca",
        "Isola",
        "Porta Romana",
        "Porta Venezia",
        "CityLife",
        "San Siro",
        "Lambrate",
        "Città Studi",
        "Navigli",
        "Corvetto",
        "Brera",
        "Garibaldi",
        "Loreto",
        "NoLo",
        "Precotto",
        "Baggio",
        "Giambellino",
        "Rogoredo",
        "Forlanini",
        "Porta Genova",
      ],
      "Novate Milanese": [],
      Bollate: [],
      "Sesto San Giovanni": [],
      "Cinisello Balsamo": [],
      "Cusano Milanino": [],
      Bresso: [],
      Cormano: [],
      "Paderno Dugnano": [],
      Senago: [],
      Limbiate: [],
      Rho: [],
      "Garbagnate Milanese": [],
      "Cesano Maderno": [],
      Segrate: [],
      Pioltello: [],
      Rozzano: [],
      Assago: [],
    },
    Bergamo: {
      Bergamo: ["Centro", "Città Alta", "Città Bassa"],
      Treviglio: [],
      Seriate: [],
    },
    Monza: {
      Monza: ["Centro", "San Biagio", "Triante"],
      Brugherio: [],
      Desio: [],
    },
  },
  Lazio: {
    Roma: {
      Roma: [
        "Centro Storico",
        "EUR",
        "Trastevere",
        "Ostiense",
        "San Lorenzo",
        "Tiburtina",
        "Prati",
        "Monteverde",
      ],
      Fiumicino: [],
      Tivoli: [],
      Guidonia: [],
    },
  },
  Piemonte: {
    Torino: {
      Torino: ["Centro", "Lingotto", "San Salvario", "Crocetta", "Aurora"],
      Moncalieri: [],
      Rivoli: [],
    },
  },
  Veneto: {
    Venezia: {
      Venezia: ["Mestre", "Marghera", "Centro Storico"],
      Spinea: [],
      Mirano: [],
    },
    Verona: {
      Verona: ["Centro", "Borgo Roma", "Borgo Trento"],
      Villafranca: [],
    },
  },
  "Emilia-Romagna": {
    Bologna: {
      Bologna: ["Centro", "San Donato", "Navile", "Saragozza"],
      Imola: [],
      Casalecchio: [],
    },
  },
  Campania: {
    Napoli: {
      Napoli: ["Centro", "Vomero", "Fuorigrotta", "Posillipo", "Chiaia"],
      Pozzuoli: [],
      Casoria: [],
    },
  },
  Toscana: {
    Firenze: {
      Firenze: ["Centro", "Novoli", "Campo di Marte", "Isolotto"],
      "Sesto Fiorentino": [],
      Scandicci: [],
    },
  },
  Sicilia: {
    Palermo: {
      Palermo: ["Centro", "Mondello", "Notarbartolo", "Politeama"],
      Bagheria: [],
      Monreale: [],
    },
  },
};

const defaultProfile = {
  name: "Christian D.",
  role: "Back Office / Order Management / Customer Support",
  city: "Milano",
  bio: "Profilo operativo con esperienza in customer support, gestione ordini e strumenti gestionali. Cerco ruoli stabili con crescita.",
  skills: "SAP, Back Office, Customer Care, Excel, Ticketing, Gestione ordini",
  cvName: "CV_Christian.pdf",
};

const defaultOffers = [
  {
    id: 1,
    title: "Back Office Commerciale",
    company: "Adecco",
    region: "Lombardia",
    province: "Milano",
    comune: "Milano",
    zone: "Bovisa",
    distance: 6,
    contract: "Tempo indeterminato",
    salary: "28K-32K",
    remote: "Ibrido",
    category: "Amministrazione",
    match: 91,
    urgent: true,
  },
  {
    id: 2,
    title: "Customer Care Specialist",
    company: "Randstad",
    region: "Lombardia",
    province: "Milano",
    comune: "Milano",
    zone: "Porta Venezia",
    distance: 9,
    contract: "Tempo determinato",
    salary: "24K-27K",
    remote: "On-site",
    category: "Customer Service",
    match: 84,
    urgent: false,
  },
  {
    id: 3,
    title: "Order Management Specialist",
    company: "DHL",
    region: "Lombardia",
    province: "Milano",
    comune: "Segrate",
    zone: "",
    distance: 14,
    contract: "Tempo indeterminato",
    salary: "30K-34K",
    remote: "Ibrido",
    category: "Logistica",
    match: 96,
    urgent: true,
  },
  {
    id: 4,
    title: "Magazziniere",
    company: "Amazon",
    region: "Lombardia",
    province: "Milano",
    comune: "Pioltello",
    zone: "",
    distance: 18,
    contract: "Somministrazione",
    salary: "22K-25K",
    remote: "On-site",
    category: "Logistica",
    match: 75,
    urgent: false,
  },
  {
    id: 5,
    title: "Impiegato Ufficio Acquisti",
    company: "Gi Group",
    region: "Lombardia",
    province: "Milano",
    comune: "Novate Milanese",
    zone: "",
    distance: 11,
    contract: "Tempo indeterminato",
    salary: "27K-30K",
    remote: "On-site",
    category: "Acquisti",
    match: 79,
    urgent: false,
  },
  {
    id: 6,
    title: "Help Desk IT",
    company: "Sielte",
    region: "Lombardia",
    province: "Milano",
    comune: "Milano",
    zone: "Loreto",
    distance: 8,
    contract: "Tempo indeterminato",
    salary: "27K-31K",
    remote: "Ibrido",
    category: "IT",
    match: 88,
    urgent: false,
  },
  {
    id: 7,
    title: "Addetto Customer Support",
    company: "Manpower",
    region: "Lazio",
    province: "Roma",
    comune: "Roma",
    zone: "EUR",
    distance: 7,
    contract: "Tempo determinato",
    salary: "25K-28K",
    remote: "Ibrido",
    category: "Customer Service",
    match: 73,
    urgent: false,
  },
  {
    id: 8,
    title: "Back Office Logistico",
    company: "Page Personnel",
    region: "Piemonte",
    province: "Torino",
    comune: "Torino",
    zone: "Lingotto",
    distance: 5,
    contract: "Tempo indeterminato",
    salary: "29K-33K",
    remote: "Ibrido",
    category: "Logistica",
    match: 77,
    urgent: false,
  },
];

const defaultApplications = [
  {
    id: 101,
    offerId: 2,
    title: "Customer Care Specialist",
    company: "Randstad",
    status: "Inviata",
    date: "Oggi",
  },
];

const defaultNotifications = [
  { id: 1, text: "Nuova offerta compatibile al 96% pubblicata da DHL.", read: false },
  { id: 2, text: "Un recruiter ha visualizzato il tuo profilo.", read: false },
  { id: 3, text: "La tua candidatura per Customer Care Specialist è in valutazione.", read: true },
];

const defaultAuthSession = {
  isAuthenticated: false,
  email: "",
  name: "",
  isDemo: false,
};

const defaultChat = [
  {
    who: "ai",
    text: "Ciao, sono l’assistente Jobly. Posso aiutarti a filtrare offerte, migliorare il profilo e organizzare le candidature.",
  },
];

const defaultCvData = {
  jobDescription: "",
  coverLetter: "",
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Input(props) {
  return <input {...props} className={`input ${props.className || ""}`} />;
}

function Textarea(props) {
  return <textarea {...props} className={`textarea ${props.className || ""}`} />;
}

function SelectField({ value, onChange, options, className = "" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`select ${className}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`btn ${className}`}>
      {children}
    </button>
  );
}

function OfferCard({ offer, saved, onSave, onApply, onGoCV }) {
  return (
    <Card className="offer-card">
      <div className="card-head">
        <div>
          <h3 className="offer-title">{offer.title}</h3>
          <div className="meta">
            <Building2 size={15} />
            <span>{offer.company}</span>
            <span className="dot">•</span>
            <MapPin size={15} />
            <span>
              {offer.comune}
              {offer.zone ? `, ${offer.zone}` : ""}
            </span>
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
        <Badge>{offer.region}</Badge>
      </div>

      <div className="actions">
        <Button className="btn-red" onClick={() => onApply(offer)}>
          Candidati
        </Button>
        <Button className="btn-dark" onClick={() => onSave(offer.id)}>
          <Bookmark size={16} />
          {saved ? "Salvata" : "Salva"}
        </Button>
        <Button className="btn-dark" onClick={() => onGoCV(offer)}>
          <Wand2 size={16} />
          Adatta CV
        </Button>
      </div>
    </Card>
  );
}

function AuthScreen({
  theme,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authShowPassword,
  setAuthShowPassword,
  authError,
  authSuccess,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  enterDemo,
}) {
  return (
    <div className={`app-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 1100, display: "grid", gap: 24 }} className="auth-grid">
          <Card className="hero-left">
            <div className="hero-glow" />
            <div className="brand-wrap" style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
              <div className="brand">
                <span className="brand-white">JOB</span>
                <span className="brand-red">LY</span>
              </div>
              <Badge className="badge-dark">Premium Access</Badge>
            </div>

            <h1 style={{ position: "relative", zIndex: 1 }}>
              La tua piattaforma lavoro,
              <br />
              con accesso premium.
            </h1>

            <p style={{ position: "relative", zIndex: 1 }}>
              Accedi a offerte, candidature, profilo professionale e CV Studio in un’unica esperienza moderna.
            </p>

            <div className="chips" style={{ position: "relative", zIndex: 1 }}>
              <Badge className="badge-red">Accesso sicuro</Badge>
              <Badge>CV Studio</Badge>
              <Badge>AI integrata</Badge>
            </div>
          </Card>

          <Card>
            <div className="actions" style={{ marginTop: 0, marginBottom: 18 }}>
              <Button className={authMode === "login" ? "btn-red" : "btn-dark"} onClick={() => setAuthMode("login")}>
                Accedi
              </Button>
              <Button className={authMode === "register" ? "btn-red" : "btn-dark"} onClick={() => setAuthMode("register")}>
                Registrati
              </Button>
              <Button className={authMode === "forgot" ? "btn-red" : "btn-dark"} onClick={() => setAuthMode("forgot")}>
                Password dimenticata
              </Button>
            </div>

            <div className="section-head">
              <div>
                <h2>
                  {authMode === "login" && "Bentornato"}
                  {authMode === "register" && "Crea il tuo account"}
                  {authMode === "forgot" && "Recupera accesso"}
                </h2>
                <p>
                  {authMode === "login" && "Accedi per continuare in Jobly."}
                  {authMode === "register" && "Registrati per salvare profilo e candidature."}
                  {authMode === "forgot" && "Inserisci la tua email per la simulazione di recupero."}
                </p>
              </div>
            </div>

            {authError ? (
              <div className="inner-box" style={{ marginBottom: 12, borderColor: "rgba(239,68,68,0.35)" }}>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>{authError}</span>
              </div>
            ) : null}

            {authSuccess ? (
              <div className="inner-box" style={{ marginBottom: 12, borderColor: "rgba(34,197,94,0.35)" }}>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>{authSuccess}</span>
              </div>
            ) : null}

            <div className="stack">
              {authMode === "register" && (
                <div>
                  <div className="section-label">Nome</div>
                  <Input
                    value={authForm.name}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Il tuo nome"
                  />
                </div>
              )}

              <div>
                <div className="section-label">Email</div>
                <Input
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="nome@email.com"
                />
              </div>

              {authMode !== "forgot" && (
                <div>
                  <div className="section-label">Password</div>
                  <div style={{ position: "relative" }}>
                    <Input
                      type={authShowPassword ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Inserisci password"
                      className="auth-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setAuthShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "inherit",
                      }}
                    >
                      {authShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {authMode === "register" && (
                <div>
                  <div className="section-label">Conferma password</div>
                  <Input
                    type={authShowPassword ? "text" : "password"}
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Conferma password"
                  />
                </div>
              )}
            </div>

            <div className="stack" style={{ marginTop: 18 }}>
              {authMode === "login" && (
                <Button className="btn-red" onClick={handleLogin}>
                  <Mail size={16} />
                  Accedi
                </Button>
              )}
              {authMode === "register" && (
                <Button className="btn-red" onClick={handleRegister}>
                  <User size={16} />
                  Crea account
                </Button>
              )}
              {authMode === "forgot" && (
                <Button className="btn-red" onClick={handleForgotPassword}>
                  <Lock size={16} />
                  Invia richiesta
                </Button>
              )}

              <Button className="btn-dark" onClick={enterDemo}>
                Continua in demo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, "dark"));
  const [tab, setTab] = useState(() => readStorage(STORAGE_KEYS.activeTab, "offerte"));

  const [profile, setProfile] = useState(() => readStorage(STORAGE_KEYS.profile, defaultProfile));
  const [offers] = useState(() => readStorage(STORAGE_KEYS.offers, defaultOffers));
  const [savedIds, setSavedIds] = useState(() => readStorage(STORAGE_KEYS.savedIds, [1]));
  const [applications, setApplications] = useState(() => readStorage(STORAGE_KEYS.applications, defaultApplications));
  const [notifications, setNotifications] = useState(() => readStorage(STORAGE_KEYS.notifications, defaultNotifications));
  const [authUsers, setAuthUsers] = useState(() => readStorage(STORAGE_KEYS.authUsers, []));
  const [authSession, setAuthSession] = useState(() => readStorage(STORAGE_KEYS.authSession, defaultAuthSession));
  const [chat, setChat] = useState(() => readStorage(STORAGE_KEYS.chat, defaultChat));
  const [cvData, setCvData] = useState(() => readStorage(STORAGE_KEYS.cvData, defaultCvData));

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [comune, setComune] = useState("all");
  const [zone, setZone] = useState("all");
  const [contract, setContract] = useState("all");
  const [maxDistance, setMaxDistance] = useState("30");

  const [saveFeedback, setSaveFeedback] = useState("");
  const [chatInput, setChatInput] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(tab));
  }, [tab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedIds, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authUsers, JSON.stringify(authUsers));
  }, [authUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(authSession));
  }, [authSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cvData, JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    setProvince("all");
    setComune("all");
    setZone("all");
  }, [region]);

  useEffect(() => {
    setComune("all");
    setZone("all");
  }, [province]);

  useEffect(() => {
    setZone("all");
  }, [comune]);

  const regionOptions = useMemo(() => {
    return ["all", ...Object.keys(locationData)];
  }, []);

  const provinceOptions = useMemo(() => {
    if (region === "all" || !locationData[region]) return ["all"];
    return ["all", ...Object.keys(locationData[region])];
  }, [region]);

  const comuneOptions = useMemo(() => {
    if (region === "all" || province === "all") return ["all"];
    const comuniMap = locationData[region]?.[province] || {};
    return ["all", ...Object.keys(comuniMap)];
  }, [region, province]);

  const zoneOptions = useMemo(() => {
    if (region === "all" || province === "all" || comune === "all") return ["all"];
    const zones = locationData[region]?.[province]?.[comune] || [];
    return ["all", ...zones];
  }, [region, province, comune]);

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const okSearch =
        !search ||
        [o.title, o.company, o.region, o.province, o.comune, o.zone, o.category]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const okRegion = region === "all" || o.region === region;
      const okProvince = province === "all" || o.province === province;
      const okComune = comune === "all" || o.comune === comune;
      const okZone = zone === "all" || o.zone === zone;
      const okContract = contract === "all" || o.contract === contract;
      const okDistance = o.distance <= Number(maxDistance);

      return okSearch && okRegion && okProvince && okComune && okZone && okContract && okDistance;
    });
  }, [offers, search, region, province, comune, zone, contract, maxDistance]);

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

  const pulseSave = (message) => {
    setSaveFeedback(message);
    window.clearTimeout(window.__joblySaveTimer);
    window.__joblySaveTimer = window.setTimeout(() => {
      setSaveFeedback("");
    }, 1800);
  };

  const saveProfile = () => {
    pulseSave("Profilo salvato");
  };

  const toggleSaveOffer = (offerId) => {
    setSavedIds((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]));
    pulseSave("Offerte salvate aggiornate");
  };

  const applyToOffer = (offer) => {
    const exists = applications.some((a) => a.offerId === offer.id);
    if (exists) {
      pulseSave("Candidatura già presente");
      return;
    }

    const newApp = {
      id: Date.now(),
      offerId: offer.id,
      title: offer.title,
      company: offer.company,
      status: "Inviata",
      date: "Oggi",
    };

    setApplications((prev) => [newApp, ...prev]);
    setNotifications((prev) => [
      {
        id: Date.now() + 1,
        text: `Hai inviato la candidatura per ${offer.title} presso ${offer.company}.`,
        read: false,
      },
      ...prev,
    ]);
    pulseSave("Candidatura inviata");
  };

  const updateApplicationStatus = (appId, status) => {
    setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status } : app)));
    pulseSave("Stato candidatura aggiornato");
  };

  const removeApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    pulseSave("Candidatura rimossa");
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleGoCV = (offer) => {
    setCvData((prev) => ({
      ...prev,
      jobDescription: `${offer.title} presso ${offer.company}. Regione ${offer.region}, provincia ${offer.province}, comune ${offer.comune}${offer.zone ? `, zona ${offer.zone}` : ""}. Contratto ${offer.contract}. Modalità ${offer.remote}.`,
    }));
    setTab("ai");
    pulseSave("Descrizione offerta preparata per il CV");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const lower = userMsg.toLowerCase();

    let aiText = "Posso aiutarti a filtrare offerte, migliorare il profilo e organizzare le candidature.";
    if (lower.includes("milano")) aiText = "Per Milano puoi usare anche il filtro zona: Quarto Oggiaro, Barona, Bovisa, San Siro, Loreto e altre.";
    if (lower.includes("cv")) aiText = "Per il CV evidenzia gestione ordini, SAP, assistenza clienti e precisione operativa.";
    if (lower.includes("candidature")) aiText = "Controlla la tab Candidature: lì puoi aggiornare stato o rimuovere candidature non utili.";

    setChat((prev) => [
      ...prev,
      { who: "user", text: userMsg },
      { who: "ai", text: aiText },
    ]);
    setChatInput("");
  };

  const syncUserIntoProfile = (user) => {
    setProfile((prev) => ({
      ...prev,
      name: user.name || prev.name,
    }));
  };

  const handleLogin = () => {
    setAuthError("");
    setAuthSuccess("");

    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password.trim();

    if (!email || !password) {
      setAuthError("Inserisci email e password.");
      return;
    }

    const user = authUsers.find((u) => u.email === email);
    if (!user) {
      setAuthError("Nessun account trovato con questa email.");
      return;
    }

    if (user.password !== password) {
      setAuthError("Password non corretta.");
      return;
    }

    const session = {
      isAuthenticated: true,
      email: user.email,
      name: user.name,
      isDemo: false,
    };

    setAuthSession(session);
    syncUserIntoProfile(user);
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAuthSuccess("Accesso effettuato.");
  };

  const handleRegister = () => {
    setAuthError("");
    setAuthSuccess("");

    const name = authForm.name.trim();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password.trim();
    const confirmPassword = authForm.confirmPassword.trim();

    if (!name || !email || !password || !confirmPassword) {
      setAuthError("Compila tutti i campi.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setAuthError("Inserisci una email valida.");
      return;
    }

    if (password.length < 6) {
      setAuthError("La password deve avere almeno 6 caratteri.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Le password non coincidono.");
      return;
    }

    if (authUsers.some((u) => u.email === email)) {
      setAuthError("Esiste già un account con questa email.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    setAuthUsers((prev) => [...prev, newUser]);
    setAuthSession({
      isAuthenticated: true,
      email,
      name,
      isDemo: false,
    });
    syncUserIntoProfile(newUser);
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAuthSuccess("Account creato con successo.");
  };

  const handleForgotPassword = () => {
    setAuthError("");
    setAuthSuccess("");

    const email = authForm.email.trim().toLowerCase();
    if (!email) {
      setAuthError("Inserisci la tua email.");
      return;
    }

    const user = authUsers.find((u) => u.email === email);
    if (!user) {
      setAuthError("Nessun account trovato con questa email.");
      return;
    }

    setAuthSuccess(`Richiesta registrata per ${email}.`);
  };

  const enterDemo = () => {
    setAuthSession({
      isAuthenticated: true,
      email: "demo@jobly.local",
      name: "Demo User",
      isDemo: true,
    });
    pulseSave("Modalità demo attiva");
  };

  const handleLogout = () => {
    setAuthSession(defaultAuthSession);
    setAuthMode("login");
    setAuthError("");
    setAuthSuccess("");
  };

  if (!authSession.isAuthenticated) {
    return (
      <AuthScreen
        theme={theme}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authShowPassword={authShowPassword}
        setAuthShowPassword={setAuthShowPassword}
        authError={authError}
        authSuccess={authSuccess}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleForgotPassword={handleForgotPassword}
        enterDemo={enterDemo}
      />
    );
  }

  return (
    <div className={`app-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="main-container">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand">
              <span className="brand-white">JOB</span>
              <span className="brand-red">LY</span>
            </div>
            <Badge className="badge-dark">AI Job Platform</Badge>
            {authSession.isDemo ? <Badge>Modalità demo</Badge> : <Badge>{authSession.email}</Badge>}
          </div>

          <div className="top-icons">
            <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Cambia tema">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Bell size={18} />
            <div className="top-user">
              <User size={18} />
              <span>{authSession.name}</span>
            </div>
            <button className="theme-toggle" onClick={handleLogout} title="Esci">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-left">
            <div className="hero-glow" />
            <h1>
              Trova il lavoro giusto, con
              <br />
              un’interfaccia che ti fa tornare.
            </h1>
            <p>
              Jobly unisce offerte, candidature, profilo pubblico e assistente AI in un’unica esperienza moderna.
            </p>
            <div className="chips">
              <Badge className="badge-red">Match intelligenti</Badge>
              <Badge>Filtri smart</Badge>
              <Badge>Ricerca Italia</Badge>
            </div>
          </div>

          <Card className="search-card">
            <div className="label-row">
              <Filter size={16} />
              Ricerca rapida
            </div>

            <div className="search-line">
              <Search size={16} className="search-icon" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ruolo, azienda, regione, città..." />
            </div>

            <div className="filters-grid">
              <SelectField
                value={region}
                onChange={setRegion}
                options={regionOptions.map((r) => ({
                  value: r,
                  label: r === "all" ? "Tutte le regioni" : r,
                }))}
              />

              <SelectField
                value={province}
                onChange={setProvince}
                options={provinceOptions.map((p) => ({
                  value: p,
                  label: p === "all" ? "Tutte le province" : p,
                }))}
              />

              <SelectField
                value={comune}
                onChange={setComune}
                options={comuneOptions.map((c) => ({
                  value: c,
                  label: c === "all" ? "Tutti i comuni" : c,
                }))}
              />

              <SelectField
                value={zone}
                onChange={setZone}
                options={zoneOptions.map((z) => ({
                  value: z,
                  label: z === "all" ? "Tutte le zone" : z,
                }))}
              />

              <SelectField
                value={contract}
                onChange={setContract}
                options={[
                  { value: "all", label: "Tutti i contratti" },
                  { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                  { value: "Tempo determinato", label: "Tempo determinato" },
                  { value: "Somministrazione", label: "Somministrazione" },
                ]}
              />

              <SelectField
                value={maxDistance}
                onChange={setMaxDistance}
                options={[
                  { value: "5", label: "5 km" },
                  { value: "10", label: "10 km" },
                  { value: "20", label: "20 km" },
                  { value: "30", label: "30 km" },
                ]}
              />
            </div>
          </Card>
        </section>

        <div className="tabs-sticky">
          <div className="tabs tabs-premium">
            <button className={`tab ${tab === "offerte" ? "tab-active" : ""}`} onClick={() => setTab("offerte")}>
              <Briefcase size={16} />
              <span>Offerte</span>
            </button>

            <button className={`tab ${tab === "candidature" ? "tab-active" : ""}`} onClick={() => setTab("candidature")}>
              <Send size={16} />
              <span>Candidature</span>
            </button>

            <button className={`tab ${tab === "notifiche" ? "tab-active" : ""}`} onClick={() => setTab("notifiche")}>
              <Bell size={16} />
              <span>Notifiche</span>
            </button>

            <button className={`tab ${tab === "profilo" ? "tab-active" : ""}`} onClick={() => setTab("profilo")}>
              <User size={16} />
              <span>Profilo</span>
            </button>

            <button className={`tab ${tab === "ai" ? "tab-active" : ""}`} onClick={() => setTab("ai")}>
              <Sparkles size={16} />
              <span>AI Support</span>
            </button>
          </div>
        </div>

        {saveFeedback ? (
          <div style={{ padding: "0 28px 10px" }}>
            <div className="inner-box">
              <span style={{ fontWeight: 700 }}>{saveFeedback}</span>
            </div>
          </div>
        ) : null}

        <main className="content">
          {tab === "offerte" && (
            <section>
              <div className="section-head">
                <div>
                  <h2>Offerte consigliate</h2>
                  <p>Ricerca nazionale con filtro per regione, provincia, comune e zona</p>
                </div>
                <div className="muted">{filteredOffers.length} risultati</div>
              </div>

              <div className="offer-grid">
                {filteredOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    saved={savedIds.includes(offer.id)}
                    onSave={toggleSaveOffer}
                    onApply={applyToOffer}
                    onGoCV={handleGoCV}
                  />
                ))}
              </div>
            </section>
          )}

          {tab === "candidature" && (
            <div className="two-col">
              <Card>
                <h3>Candidature inviate</h3>
                <div className="stack">
                  {applications.length === 0 ? (
                    <div className="inner-box">Nessuna candidatura presente.</div>
                  ) : (
                    applications.map((app) => (
                      <div key={app.id} className="inner-box">
                        <div className="offer-title">{app.title}</div>
                        <div className="meta-text small">
                          {app.company} • {app.date}
                        </div>

                        <div className="actions">
                          <SelectField
                            value={app.status}
                            onChange={(value) => updateApplicationStatus(app.id, value)}
                            options={[
                              { value: "Inviata", label: "Inviata" },
                              { value: "In valutazione", label: "In valutazione" },
                              { value: "Colloquio", label: "Colloquio" },
                              { value: "Chiusa", label: "Chiusa" },
                            ]}
                          />
                          <Button className="btn-dark" onClick={() => removeApplication(app.id)}>
                            <Trash2 size={16} />
                            Rimuovi
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="preview-card">
                <h3>Riepilogo candidature</h3>
                <div className="stack">
                  <div className="inner-box">
                    <div className="section-label">Totali</div>
                    <p>{applications.length} candidature registrate.</p>
                  </div>

                  <div className="inner-box">
                    <div className="section-label">Inviate</div>
                    <p>{applications.filter((a) => a.status === "Inviata").length}</p>
                  </div>

                  <div className="inner-box">
                    <div className="section-label">In valutazione</div>
                    <p>{applications.filter((a) => a.status === "In valutazione").length}</p>
                  </div>

                  <div className="inner-box">
                    <div className="section-label">Colloqui</div>
                    <p>{applications.filter((a) => a.status === "Colloquio").length}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {tab === "notifiche" && (
            <Card>
              <h3>Notifiche</h3>
              <div className="stack">
                {notifications.length === 0 ? (
                  <div className="inner-box">Nessuna notifica.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="inner-box notif">
                      <Bell size={18} color={n.read ? "#94a3b8" : "#ef4444"} />
                      <div style={{ flex: 1 }}>
                        <div>{n.text}</div>
                        <div className="meta-text small">{n.read ? "Letta" : "Non letta"}</div>
                      </div>
                      <div className="actions" style={{ marginTop: 0 }}>
                        {!n.read && (
                          <Button className="btn-dark" onClick={() => markNotificationRead(n.id)}>
                            <CheckCircle2 size={16} />
                            Segna letta
                          </Button>
                        )}
                        <Button className="btn-dark" onClick={() => deleteNotification(n.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {tab === "profilo" && (
            <div className="two-col">
              <Card>
                <h3>Area personale</h3>

                <div className="progress-label">
                  <span>Completamento profilo</span>
                  <span>{profileCompletion}%</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${profileCompletion}%` }} />
                </div>

                <div className="stack">
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Nome" />
                  <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} placeholder="Ruolo" />
                  <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Città" />
                  <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Bio" />
                  <Textarea value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="Competenze" />
                  <Input value={profile.cvName} onChange={(e) => setProfile({ ...profile, cvName: e.target.value })} placeholder="Nome CV" />

                  <Button className="btn-red" onClick={saveProfile}>
                    <Save size={16} />
                    Salva profilo
                  </Button>
                </div>
              </Card>

              <Card className="preview-card">
                <h3>Anteprima recruiter</h3>

                <div className="preview-head">
                  <div className="avatar">{profile.name?.[0] || "J"}</div>
                  <div>
                    <div className="preview-name">{profile.name}</div>
                    <div className="meta-text">{profile.role}</div>
                    <div className="meta-text small">
                      <MapPin size={14} style={{ verticalAlign: "middle" }} /> {profile.city}
                    </div>
                  </div>
                </div>

                <div className="inner-box">
                  <div className="section-label">Bio</div>
                  <p>{profile.bio}</p>
                </div>

                <div className="inner-box">
                  <div className="section-label">Competenze</div>
                  <div className="chips">
                    {profile.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, i) => (
                        <Badge key={i}>{skill}</Badge>
                      ))}
                  </div>
                </div>

                <div className="file-box">
                  <FileText size={16} color="#ef4444" />
                  {profile.cvName}
                </div>
              </Card>
            </div>
          )}

          {tab === "ai" && (
            <div className="two-col">
              <Card>
                <h3 className="title-row">
                  <Sparkles size={18} color="#ef4444" />
                  AI Support
                </h3>
                <div className="stack">
                  <div className="inner-box">
                    <div className="section-label">Descrizione offerta per CV</div>
                    <Textarea
                      value={cvData.jobDescription}
                      onChange={(e) => setCvData((prev) => ({ ...prev, jobDescription: e.target.value }))}
                      placeholder="Qui arriva il testo dell'offerta selezionata da 'Adatta CV'"
                    />
                  </div>

                  <div className="inner-box">
                    <div className="section-label">Suggerimento rapido</div>
                    <p className="meta-text small">
                      Ora la ricerca è strutturata meglio: regione, provincia, comune e zona. Per Milano usa il filtro zona per risultati più utili.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3>Chat di supporto</h3>
                <div className="chat-box">
                  {chat.map((m, i) => (
                    <div key={i} className={`msg ${m.who === "user" ? "msg-user" : "msg-ai"}`}>
                      {m.text}
                    </div>
                  ))}
                </div>

                <div className="chat-row">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Scrivi: cercami offerte a Milano zona Barona"
                  />
                  <Button className="btn-red" onClick={sendChat}>
                    <Send size={16} />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
