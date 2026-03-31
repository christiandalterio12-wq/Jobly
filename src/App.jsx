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
  MessageSquare,
  GraduationCap,
  Plus,
  Download,
  Target,
  Upload,
  Bot,
  Play,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "./supabaseClient";
// 🔐 Supabase Auth Session Sync
const useSupabaseSession = (setAuthSession) => {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setAuthSession({
          isAuthenticated: true,
          email: data.session.user.email,
          name: data.session.user.email,
          isDemo: false,
        });
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuthSession({
            isAuthenticated: true,
            email: session.user.email,
            name: session.user.email,
            isDemo: false,
          });
        } else {
          setAuthSession({
            isAuthenticated: false,
            email: "",
            name: "",
            isDemo: false,
          });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
};
const STORAGE_KEYS = {
  theme: "jobly_theme",
  activeTab: "jobly_active_tab",
  activeCvSection: "jobly_active_cv_section",
  profile: "jobly_profile",
  savedIds: "jobly_saved_ids",
  applications: "jobly_applications",
  notifications: "jobly_notifications",
  authSession: "jobly_auth_session",
  chat: "jobly_chat",
  cvData: "jobly_cv_data",
  recruiterMessages: "jobly_recruiter_messages",
  activeConversationId: "jobly_active_conversation_id",
  savedCVs: "jobly_saved_cvs",
  autoApplySettings: "jobly_auto_apply_settings",
  autoApplyQueue: "jobly_auto_apply_queue",
};
const getUserKey = (key, email) => {
  if (!email) return key;
  return `${key}_${email}`;
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
  name: "",
  role: "",
  city: "",
  bio: "",
  skills: "",
  cvName: "",
};

const defaultApplications = [];
const defaultRecruiterMessages = [];
const defaultNotifications = [];
const defaultSavedCVs = [];

const defaultCvData = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  citta: "",
  ruolo: "",
  profilo: "",
  competenze: [],
  newSkill: "",
  esperienze: [
    {
      id: 1,
      ruolo: "",
      azienda: "",
      periodo: "",
      descrizione: "",
    },
  ],
  formazione: [
    {
      id: 1,
      titolo: "",
      istituto: "",
      periodo: "",
      descrizione: "",
    },
  ],
  jobDescription: "",
  coverLetter: "",
};

const defaultAutoApplySettings = {
  enabled: false,
  mode: "review",
  minMatch: 85,
  minRal: 28000,
  contract: "all",
  region: "all",
  province: "all",
  comune: "all",
  zone: "all",
  maxDistance: "20",
  remote: "all",
  category: "all",
  requiredKeyword: "",
  excludedKeyword: "",
  maxDailyApplications: 5,
};

const defaultAutoApplyQueue = [];

const defaultAuthSession = {
  isAuthenticated: false,
  email: "",
  name: "",
  surname: "",
  birthDate: "",
  role: "user",
  isDemo: false,
};

const defaultChat = [
  {
    who: "ai",
    text: "Ciao, sono l’assistente Jobly. Posso aiutarti a filtrare offerte, migliorare il profilo e organizzare le candidature.",
  },
];

const createEmptyJob = () => ({
  title: "",
  company: "",
  region: "Lombardia",
  province: "Milano",
  comune: "Milano",
  zone: "",
  contract: "Tempo indeterminato",
  remote: "On-site",
  category: "Generale",
  distance: "0",
  salary: "",
  description: "",
  requirements: "",
  urgent: false,
});

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

function FieldLabel({ children }) {
  return <div className="section-label" style={{ marginBottom: 8 }}>{children}</div>;
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
          {offer.description ? (
            <p style={{ marginTop: 12, opacity: 0.9 }}>{offer.description}</p>
          ) : null}
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
        <Badge>{offer.category}</Badge>
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

function SectionPreview({ title, content, emptyText }) {
  return (
    <div className="inner-box">
      <div className="section-label">{title}</div>
      <p>{content?.trim() ? content : emptyText}</p>
    </div>
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
              Accedi a offerte, candidature, messaggi con le aziende, CV Studio e Auto Apply AI in un’unica esperienza moderna.
            </p>

            <div className="chips" style={{ position: "relative", zIndex: 1 }}>
              <Badge className="badge-red">Accesso sicuro</Badge>
              <Badge>CV Studio</Badge>
              <Badge>Auto Apply AI</Badge>
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
      <>
                <div>
                  <div className="section-label">Nome</div>
                  <Input
                    value={authForm.name}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Il tuo nome"
                  />
                </div>
      <div>
  <div className="section-label">Cognome</div>
  <Input
    value={authForm.surname}
    onChange={(e) =>
      setAuthForm((prev) => ({ ...prev, surname: e.target.value }))
    }
    placeholder="Il tuo cognome"
  />
</div>
            
<div>
  <div className="section-label">Data di nascita</div>
  <Input
    type="date"
    value={authForm.birthDate}
    onChange={(e) =>
      setAuthForm((prev) => ({ ...prev, birthDate: e.target.value }))
    }
  />
</div>
</>
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

function computeMatchFromCV(job, cvData) {
  const haystack = [
    job.title,
    job.company,
    job.category,
    job.description,
    job.requirements,
    job.contract,
    job.remote,
  ]
    .join(" ")
    .toLowerCase();

  let score = 20;

  const skillMatches = (cvData.competenze || []).filter((skill) =>
    haystack.includes(String(skill).toLowerCase())
  ).length;
  score += Math.min(skillMatches * 8, 40);

  const roleMatches = (cvData.ruolo || "")
    .toLowerCase()
    .split(/[\/,\-]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .some((chunk) => haystack.includes(chunk));
  if (roleMatches) score += 20;

  const profileWords = (cvData.profilo || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((x) => x.length > 4);
  const profileHits = profileWords.filter((word) => haystack.includes(word)).length;
  score += Math.min(profileHits * 2, 20);

  return Math.max(0, Math.min(99, score));
}

export default function App() {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, "dark"));
  const [tab, setTab] = useState(() => readStorage(STORAGE_KEYS.activeTab, "offerte"));
  const [cvSection, setCvSection] = useState(() => readStorage(STORAGE_KEYS.activeCvSection, "dashboard"));

  const [profile, setProfile] = useState(() =>
  readStorage(
    getUserKey(STORAGE_KEYS.profile, defaultAuthSession?.email || ""),
    defaultProfile
  )
);
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState("");
  const [savedIds, setSavedIds] = useState(() => readStorage(STORAGE_KEYS.savedIds, []));
  const [applications, setApplications] = useState(() => readStorage(STORAGE_KEYS.applications, defaultApplications));
  const [notifications, setNotifications] = useState(() => readStorage(STORAGE_KEYS.notifications, defaultNotifications));
  const [authSession, setAuthSession] = useState(() => readStorage(STORAGE_KEYS.authSession, defaultAuthSession));
  useSupabaseSession(setAuthSession);
  useEffect(() => {
  if (!authSession?.email) return;

  const userProfile = readStorage(
    getUserKey(STORAGE_KEYS.profile, authSession.email),
    defaultProfile
  );

  setProfile(userProfile);
}, [authSession]);
  useEffect(() => {

  const userCvData = readStorage(
    getUserKey(STORAGE_KEYS.cvData, authSession?.email || ""),
    defaultCvData
  );

  setCvData(userCvData);
}, [authSession]);
  const [chat, setChat] = useState(() => readStorage(STORAGE_KEYS.chat, defaultChat));
const [savedCVs, setSavedCVs] = useState(() =>
  readStorage(
    getUserKey(STORAGE_KEYS.savedCVs, defaultAuthSession?.email || ""),
    defaultSavedCVs
  )
);
  const [recruiterMessages, setRecruiterMessages] = useState(() =>
  readStorage(
    getUserKey(STORAGE_KEYS.recruiterMessages, defaultAuthSession?.email || ""),
    defaultRecruiterMessages
  )
);
  const [activeConversationId, setActiveConversationId] = useState(() =>
  readStorage(
    getUserKey(STORAGE_KEYS.activeConversationId, defaultAuthSession?.email || ""),
    defaultRecruiterMessages[0]?.id || null
  )
);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [newJob, setNewJob] = useState(createEmptyJob());
  const [jobErrors, setJobErrors] = useState({});
  const [toast, setToast] = useState(null);

  const [autoApplySettings, setAutoApplySettings] = useState(() =>
    readStorage(STORAGE_KEYS.autoApplySettings, defaultAutoApplySettings)
  );
  const [autoApplyQueue, setAutoApplyQueue] = useState(() =>
    readStorage(STORAGE_KEYS.autoApplyQueue, defaultAutoApplyQueue)
  );

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [comune, setComune] = useState("all");
  const [zone, setZone] = useState("all");
  const [contract, setContract] = useState("all");
  const [maxDistance, setMaxDistance] = useState("30");

  const [saveFeedback, setSaveFeedback] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
const [authForm, setAuthForm] = useState({
  name: "",
  surname: "",
  birthDate: "",
  email: "",
  password: "",
  confirmPassword: "",
});

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    window.clearTimeout(window.__joblyToastTimer);
    window.__joblyToastTimer = window.setTimeout(() => {
      setToast(null);
    }, duration);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(tab));
  }, [tab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeCvSection, JSON.stringify(cvSection));
  }, [cvSection]);

  useEffect(() => {
    localStorage.setItem(
  getUserKey(STORAGE_KEYS.profile, authSession.email),
  JSON.stringify(profile)
);
    }, [profile, authSession]);

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
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(authSession));
  }, [authSession]);

 useEffect(() => {
  if (!authSession?.email) return;

  localStorage.setItem(
    getUserKey(STORAGE_KEYS.cvData, authSession.email),
    JSON.stringify(cvData)
  );
}, [cvData, authSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedCVs, JSON.stringify(savedCVs));
  }, [savedCVs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recruiterMessages, JSON.stringify(recruiterMessages));
  }, [recruiterMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeConversationId, JSON.stringify(activeConversationId));
  }, [activeConversationId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.autoApplySettings, JSON.stringify(autoApplySettings));
  }, [autoApplySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.autoApplyQueue, JSON.stringify(autoApplyQueue));
  }, [autoApplyQueue]);

  useEffect(() => {
    const fetchJobs = async () => {
      setOffersLoading(true);
      setOffersError("");

      const { data, error } = await supabase.from("jobs").select("*").order("id", { ascending: false });

      if (error) {
        console.error("Errore Supabase:", error);
        setOffersError("Errore nel caricamento offerte");
        setOffers([]);
      } else {
        setOffers(data || []);
      }

      setOffersLoading(false);
    };

    fetchJobs();
  }, []);

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

  useEffect(() => {
    setNewJob((prev) => {
      const nextProvinceOptions =
        prev.region && locationData[prev.region] ? Object.keys(locationData[prev.region]) : [];
      const safeProvince = nextProvinceOptions.includes(prev.province) ? prev.province : nextProvinceOptions[0] || "";
      const nextComuneOptions =
        prev.region && safeProvince && locationData[prev.region]?.[safeProvince]
          ? Object.keys(locationData[prev.region][safeProvince])
          : [];
      const safeComune = nextComuneOptions.includes(prev.comune) ? prev.comune : nextComuneOptions[0] || "";
      const nextZoneOptions =
        prev.region && safeProvince && safeComune
          ? locationData[prev.region]?.[safeProvince]?.[safeComune] || []
          : [];
      const safeZone = nextZoneOptions.includes(prev.zone) ? prev.zone : "";

      if (
        safeProvince === prev.province &&
        safeComune === prev.comune &&
        safeZone === prev.zone
      ) {
        return prev;
      }

      return {
        ...prev,
        province: safeProvince,
        comune: safeComune,
        zone: safeZone,
      };
    });
  }, [newJob.region]);

  const regionOptions = useMemo(() => ["all", ...Object.keys(locationData)], []);
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

  const autoRegionOptions = regionOptions;
  const autoProvinceOptions = useMemo(() => {
    if (autoApplySettings.region === "all" || !locationData[autoApplySettings.region]) return ["all"];
    return ["all", ...Object.keys(locationData[autoApplySettings.region])];
  }, [autoApplySettings.region]);

  const autoComuneOptions = useMemo(() => {
    if (autoApplySettings.region === "all" || autoApplySettings.province === "all") return ["all"];
    const comuniMap = locationData[autoApplySettings.region]?.[autoApplySettings.province] || {};
    return ["all", ...Object.keys(comuniMap)];
  }, [autoApplySettings.region, autoApplySettings.province]);

  const autoZoneOptions = useMemo(() => {
    if (
      autoApplySettings.region === "all" ||
      autoApplySettings.province === "all" ||
      autoApplySettings.comune === "all"
    ) {
      return ["all"];
    }
    const zones =
      locationData[autoApplySettings.region]?.[autoApplySettings.province]?.[autoApplySettings.comune] || [];
    return ["all", ...zones];
  }, [autoApplySettings.region, autoApplySettings.province, autoApplySettings.comune]);

  const addJobProvinceOptions = useMemo(() => {
    if (!newJob.region || !locationData[newJob.region]) return [];
    return Object.keys(locationData[newJob.region]);
  }, [newJob.region]);

  const addJobComuneOptions = useMemo(() => {
    if (!newJob.region || !newJob.province) return [];
    return Object.keys(locationData[newJob.region]?.[newJob.province] || {});
  }, [newJob.region, newJob.province]);

  const addJobZoneOptions = useMemo(() => {
    if (!newJob.region || !newJob.province || !newJob.comune) return [];
    return locationData[newJob.region]?.[newJob.province]?.[newJob.comune] || [];
  }, [newJob.region, newJob.province, newJob.comune]);

  const normalizedOffers = useMemo(() => {
    return offers.map((o, index) => ({
      id: o.id || `job-${index}`,
      title: o.title || "Titolo non disponibile",
      company: o.company || "Azienda non disponibile",
      region: o.region || "Lombardia",
      province: o.province || "Milano",
      comune: o.comune || "Milano",
      zone: o.zone || "",
      distance: typeof o.distance === "number" ? o.distance : Number(o.distance || 0),
      contract: o.contract || "N/D",
      salary: o.salary || "N/D",
      remote: o.remote || "On-site",
      category: o.category || "Generale",
      match: typeof o.match === "number" ? o.match : Number(o.match || 0),
      urgent: Boolean(o.urgent),
      description: o.description || "",
      requirements: o.requirements || "",
    }));
  }, [offers]);

  const filteredOffers = useMemo(() => {
    return normalizedOffers.filter((o) => {
      const okSearch =
        !search ||
        [o.title, o.company, o.region, o.province, o.comune, o.zone, o.category, o.description, o.requirements]
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
  }, [normalizedOffers, search, region, province, comune, zone, contract, maxDistance]);

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

  const cvCompletion = useMemo(() => {
    let score = 0;
    if (cvData.nome) score += 10;
    if (cvData.cognome) score += 10;
    if (cvData.email) score += 10;
    if (cvData.telefono) score += 10;
    if (cvData.ruolo) score += 15;
    if (cvData.profilo) score += 15;
    if (cvData.esperienze.some((x) => x.ruolo || x.azienda || x.descrizione)) score += 15;
    if (cvData.competenze.length > 0) score += 15;
    if (cvData.formazione.some((x) => x.titolo || x.istituto)) score += 10;
    return Math.min(score, 100);
  }, [cvData]);

  const missingCVItems = useMemo(() => {
    const items = [];
    if (!cvData.email) items.push("email");
    if (!cvData.telefono) items.push("telefono");
    if (!cvData.formazione.some((x) => x.titolo || x.istituto)) items.push("formazione");
    if (!cvData.jobDescription) items.push("annuncio per adattamento");
    return items;
  }, [cvData]);

  const totalUnreadMessages = useMemo(
    () => recruiterMessages.filter((conv) => conv.unread).length,
    [recruiterMessages]
  );

  const activeConversation = useMemo(
    () => recruiterMessages.find((conv) => conv.id === activeConversationId) || null,
    [recruiterMessages, activeConversationId]
  );

  const pulseSave = (message) => {
    setSaveFeedback(message);
    window.clearTimeout(window.__joblySaveTimer);
    window.__joblySaveTimer = window.setTimeout(() => {
      setSaveFeedback("");
    }, 1800);
  };

  const saveProfile = () => pulseSave("Profilo salvato");

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

    const newApplicationId = Date.now();
    const newApp = {
      id: newApplicationId,
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

    setRecruiterMessages((prev) => {
      const existsConversation = prev.some(
        (conv) => conv.company === offer.company && conv.jobTitle === offer.title
      );
      if (existsConversation) return prev;

      return [
        {
          id: Date.now() + 2,
          company: offer.company,
          jobTitle: offer.title,
          applicationId: newApplicationId,
          unread: false,
          messages: [
            {
              id: 1,
              sender: "system",
              text: `Conversazione creata per la candidatura: ${offer.title}.`,
              time: "Oggi • adesso",
            },
          ],
        },
        ...prev,
      ];
    });

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
      jobDescription: `${offer.title} presso ${offer.company}. Regione ${offer.region}, provincia ${offer.province}, comune ${offer.comune}${offer.zone ? `, zona ${offer.zone}` : ""}. Contratto ${offer.contract}. Modalità ${offer.remote}. ${offer.description ? `Descrizione: ${offer.description}.` : ""} ${offer.requirements ? `Requisiti: ${offer.requirements}.` : ""}`,
    }));
    setTab("cv");
    setCvSection("match");
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
    if (lower.includes("messaggi")) aiText = "Nella tab Messaggi trovi le conversazioni con le aziende e puoi rispondere direttamente.";
    if (lower.includes("auto apply")) aiText = "Dentro CV Studio trovi Auto Apply AI: imposti filtri, prepari la coda e invii solo le candidature coerenti.";

    setChat((prev) => [...prev, { who: "user", text: userMsg }, { who: "ai", text: aiText }]);
    setChatInput("");
  };

  const openConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setRecruiterMessages((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unread: false } : conv))
    );
  };

  const sendRecruiterMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    const now = new Date().toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: messageInput.trim(),
      time: `Oggi • ${now}`,
    };

    setRecruiterMessages((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage], unread: false }
          : conv
      )
    );
    setMessageInput("");
    pulseSave("Messaggio inviato");
  };

const syncUserIntoProfile = async (user) => {
  setProfile((prev) => ({
    ...prev,
    name: user.name || prev.name,
    surname: user.surname || prev.surname,
    birthDate: user.birthDate || prev.birthDate,
    email: user.email || prev.email,
  }));

  await supabase
    .from("profiles")
    .upsert({
      email: user.email,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
    });
};

const handleLogin = async () => {
  setAuthError("");
  setAuthSuccess("");

  const email = authForm.email.trim().toLowerCase();
  const password = authForm.password.trim();

  if (!email || !password) {
    setAuthError("Inserisci email e password.");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  setAuthError(error.message);
  return;
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", data.user.id)
  .single();

if (profileError) {
  setAuthError("Login riuscito ma profilo non trovato.");
  return;
}

  setAuthSession({
    isAuthenticated: true,
    email: data.user?.email || email,
    name: data.user?.user_metadata?.name || email,
    isDemo: false,
  });

 syncUserIntoProfile({
  name: data.user?.user_metadata?.name || email,
  surname: data.user?.user_metadata?.surname || "",
  birthDate: data.user?.user_metadata?.birthDate || "",
  email: data.user?.email || email,
})

  setAuthForm({
  name: "",
  surname: "",
  birthDate: "",
  email: "",
  password: "",
  confirmPassword: "",
});

  setAuthSuccess("Accesso effettuato.");
};

 const handleRegister = async () => {
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

 const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: authForm.name,
      surname: authForm.surname,
      birthDate: authForm.birthDate,
    },
  },
});
   if (!error) {
  const cleanCv = {
  ...defaultCvData,
  nome: authForm.name,
  cognome: authForm.surname,
  email: email,
  telefono: "",
  citta: "",
  ruolo: "",
  profilo: "",
  competenze: [],
  esperienze: [],
  formazione: [],
};

localStorage.setItem(
  getUserKey(STORAGE_KEYS.cvData, email),
  JSON.stringify(cleanCv)
);
}

  if (error) {
    setAuthError(error.message);
    return;
  }

  setAuthSuccess("Account creato con successo. Controlla anche la tua email di conferma se richiesta.");

  if (data?.session) {
    setAuthSession({
      isAuthenticated: true,
      email: data.user?.email || email,
      name: data.user?.user_metadata?.name || name,
      isDemo: false,
    });

    syncUserIntoProfile({
      name: data.user?.user_metadata?.name || name,
      email: data.user?.email || email,
    });
  }

setAuthForm({
  name: "",
  surname: "",
  birthDate: "",
  email: "",
  password: "",
  confirmPassword: "",
});
};

  const handleForgotPassword = () => {
    setAuthError("");
    setAuthSuccess("");
    const email = authForm.email.trim().toLowerCase();

    if (!email) {
      setAuthError("Inserisci la tua email.");
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
const handleLogout = async () => {
  await supabase.auth.signOut();

  setAuthSession({
    isAuthenticated: false,
    email: "",
    name: "",
    isDemo: false,
  });

  setAuthMode("login");
};

  const openCVSection = (section) => {
    setTab("cv");
    setCvSection(section);
  };

  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      esperienze: [
        ...prev.esperienze,
        {
          id: Date.now(),
          ruolo: "",
          azienda: "",
          periodo: "",
          descrizione: "",
        },
      ],
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      esperienze: prev.esperienze.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (id) => {
    setCvData((prev) => ({
      ...prev,
      esperienze: prev.esperienze.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      formazione: [
        ...prev.formazione,
        {
          id: Date.now(),
          titolo: "",
          istituto: "",
          periodo: "",
          descrizione: "",
        },
      ],
    }));
  };

  const updateEducation = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      formazione: prev.formazione.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }));
  };

  const removeEducation = (id) => {
    setCvData((prev) => ({
      ...prev,
      formazione: prev.formazione.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = () => {
    const skill = cvData.newSkill.trim();
    if (!skill) return;
    if (cvData.competenze.includes(skill)) {
      setCvData((prev) => ({ ...prev, newSkill: "" }));
      return;
    }
    setCvData((prev) => ({
      ...prev,
      competenze: [...prev.competenze, skill],
      newSkill: "",
    }));
  };

  const removeSkill = (skillToRemove) => {
    setCvData((prev) => ({
      ...prev,
      competenze: prev.competenze.filter((skill) => skill !== skillToRemove),
    }));
  };

  const generateProfileAI = () => {
    setCvData((prev) => ({
      ...prev,
      profilo:
        "Professionista con esperienza in back office, gestione ordini e supporto clienti. Abituato a operare con precisione su processi amministrativi e operativi, con attenzione alla qualità del servizio, all’uso di strumenti gestionali e al rispetto delle priorità aziendali.",
    }));
    pulseSave("Profilo CV migliorato");
  };

  const improveExperienceAI = () => {
    setCvData((prev) => {
      if (prev.esperienze.length === 0) return prev;
      const updated = [...prev.esperienze];
      updated[0] = {
        ...updated[0],
        descrizione:
          "Gestione operativa delle richieste cliente, aggiornamento dati su gestionale, supporto ai flussi di back office e monitoraggio dello stato delle pratiche, con attenzione alla precisione, alle tempistiche e alla continuità del servizio.",
      };
      return { ...prev, esperienze: updated };
    });
    pulseSave("Esperienza migliorata");
  };

  const suggestSkillsAI = () => {
    setCvData((prev) => ({
      ...prev,
      competenze: [
        "SAP",
        "Excel",
        "Back Office",
        "Gestione ordini",
        "Customer Care",
        "Ticketing",
        "Data entry",
        "Precisione operativa",
        "Problem solving",
        "Coordinamento attività",
      ],
    }));
    pulseSave("Competenze aggiornate");
  };

  const adaptCVAI = () => {
    setCvData((prev) => ({
      ...prev,
      profilo:
        "Profilo orientato a ruoli di back office e order management, con esperienza nel supporto operativo, nell’aggiornamento dati e nella gestione di attività amministrative e customer-facing. Forte attenzione all’accuratezza, alla continuità del servizio e all’utilizzo di strumenti gestionali.",
      competenze: [
        "Gestione ordini",
        "SAP",
        "Excel",
        "Back Office",
        "Customer Support",
        "Data entry",
        "Precisione operativa",
        "Monitoraggio pratiche",
        "Comunicazione con clienti e reparti interni",
      ],
    }));
    pulseSave("CV adattato all'offerta");
  };

  const generateCoverLetterAI = () => {
    setCvData((prev) => ({
      ...prev,
      coverLetter:
        "Gentile Recruiter,\n\nho letto con interesse la vostra opportunità e desidero sottoporre la mia candidatura. Nel mio percorso ho maturato esperienza in attività di back office, gestione ordini, aggiornamento dati e supporto clienti, sviluppando precisione operativa, attenzione alle priorità e capacità di lavorare in modo affidabile su processi strutturati.\n\nRitengo che il mio profilo possa essere in linea con il ruolo ricercato e sarei interessato ad approfondire il contributo che potrei portare alla vostra realtà.\n\nCordiali saluti.",
    }));
    pulseSave("Lettera generata");
  };

  const saveCurrentCV = () => {
    const newCV = {
      id: Date.now(),
      name: `${cvData.nome || "CV"}_${(cvData.ruolo || "Nuovo").replaceAll("/", "-")}.pdf`,
      role: cvData.ruolo || "Ruolo non specificato",
      updated: "Adesso",
      status: cvCompletion >= 80 ? "Completo" : "Bozza",
    };
    setSavedCVs((prev) => [newCV, ...prev]);
    setProfile((prev) => ({ ...prev, cvName: newCV.name }));
    pulseSave("CV salvato");
  };

  const preparedAutoApplyOffers = useMemo(() => {
    const requiredKeyword = autoApplySettings.requiredKeyword.trim().toLowerCase();
    const excludedKeyword = autoApplySettings.excludedKeyword.trim().toLowerCase();

    return normalizedOffers
      .filter((offer) => {
        const offerText = [
          offer.title,
          offer.company,
          offer.region,
          offer.province,
          offer.comune,
          offer.zone,
          offer.category,
          offer.contract,
          offer.remote,
          offer.description,
          offer.requirements,
        ]
          .join(" ")
          .toLowerCase();

        const offerRalMin = Number(String(offer.salary).split("-")[0].replace("K", "")) * 1000 || 0;

        const okMatch = offer.match >= Number(autoApplySettings.minMatch);
        const okRal = offerRalMin >= Number(autoApplySettings.minRal || 0);
        const okContract =
          autoApplySettings.contract === "all" || offer.contract === autoApplySettings.contract;
        const okRegion =
          autoApplySettings.region === "all" || offer.region === autoApplySettings.region;
        const okProvince =
          autoApplySettings.province === "all" || offer.province === autoApplySettings.province;
        const okComune =
          autoApplySettings.comune === "all" || offer.comune === autoApplySettings.comune;
        const okZone = autoApplySettings.zone === "all" || offer.zone === autoApplySettings.zone;
        const okDistance = offer.distance <= Number(autoApplySettings.maxDistance || 30);
        const okRemote =
          autoApplySettings.remote === "all" || offer.remote === autoApplySettings.remote;
        const okCategory =
          autoApplySettings.category === "all" || offer.category === autoApplySettings.category;
        const okRequired = !requiredKeyword || offerText.includes(requiredKeyword);
        const okExcluded = !excludedKeyword || !offerText.includes(excludedKeyword);
        const notAlreadyApplied = !applications.some((app) => app.offerId === offer.id);

        return (
          okMatch &&
          okRal &&
          okContract &&
          okRegion &&
          okProvince &&
          okComune &&
          okZone &&
          okDistance &&
          okRemote &&
          okCategory &&
          okRequired &&
          okExcluded &&
          notAlreadyApplied
        );
      })
      .map((offer) => ({
        queueId: `queue_${offer.id}`,
        offerId: offer.id,
        title: offer.title,
        company: offer.company,
        comune: offer.comune,
        zone: offer.zone,
        contract: offer.contract,
        salary: offer.salary,
        match: offer.match,
        remote: offer.remote,
        category: offer.category,
        selected: true,
        status: "Pronta",
        reason: `Compatibile con regole Auto Apply AI: match ${offer.match}%, contratto ${offer.contract}, distanza ${offer.distance} km.`,
      }));
  }, [normalizedOffers, autoApplySettings, applications]);

  const generateAutoApplyQueue = () => {
    setAutoApplyQueue(preparedAutoApplyOffers);
    pulseSave(
      preparedAutoApplyOffers.length > 0
        ? `${preparedAutoApplyOffers.length} candidature preparate`
        : "Nessuna candidatura coerente con i filtri"
    );
  };

  const toggleQueueSelection = (queueId) => {
    setAutoApplyQueue((prev) =>
      prev.map((item) => (item.queueId === queueId ? { ...item, selected: !item.selected } : item))
    );
  };

  const executeAutoApply = () => {
    const selected = autoApplyQueue.filter((item) => item.selected && item.status === "Pronta");
    if (selected.length === 0) {
      pulseSave("Nessuna candidatura selezionata");
      return;
    }

    const limited = selected.slice(0, Number(autoApplySettings.maxDailyApplications || 5));

    limited.forEach((item) => {
      const offer = normalizedOffers.find((o) => o.id === item.offerId);
      if (offer) applyToOffer(offer);
    });

    setAutoApplyQueue((prev) =>
      prev.map((item) =>
        limited.some((sel) => sel.queueId === item.queueId)
          ? { ...item, status: "Inviata", selected: false }
          : item
      )
    );

    pulseSave(`${limited.length} candidature inviate da Auto Apply AI`);
  };

  const updateNewJobField = (field, value) => {
    setNewJob((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "region") {
        const nextProvinces = Object.keys(locationData[value] || {});
        next.province = nextProvinces[0] || "";
        const nextComuni = Object.keys(locationData[value]?.[next.province] || {});
        next.comune = nextComuni[0] || "";
        next.zone = "";
      }

      if (field === "province") {
        const nextComuni = Object.keys(locationData[prev.region]?.[value] || {});
        next.comune = nextComuni[0] || "";
        next.zone = "";
      }

      if (field === "comune") {
        next.zone = "";
      }

      return next;
    });

    setJobErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateJobForm = () => {
    const errors = {};

    if (!newJob.title.trim()) errors.title = "Titolo obbligatorio";
    if (!newJob.company.trim()) errors.company = "Azienda obbligatoria";
    if (!newJob.region.trim()) errors.region = "Regione obbligatoria";
    if (!newJob.province.trim()) errors.province = "Provincia obbligatoria";
    if (!newJob.comune.trim()) errors.comune = "Comune obbligatorio";
    if (!newJob.contract.trim()) errors.contract = "Contratto obbligatorio";
    if (!newJob.remote.trim()) errors.remote = "Modalità obbligatoria";
    if (!newJob.category.trim()) errors.category = "Categoria obbligatoria";

    if (newJob.distance === "" || Number.isNaN(Number(newJob.distance)) || Number(newJob.distance) < 0) {
      errors.distance = "Distanza non valida";
    }

    setJobErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addJob = async () => {
    if (!validateJobForm()) {
      showToast("Controlla i campi evidenziati", "error", 3500);
      return;
    }

    const jobToInsert = {
      ...newJob,
      title: newJob.title.trim(),
      company: newJob.company.trim(),
      region: newJob.region || "Lombardia",
      province: newJob.province || "Milano",
      comune: newJob.comune || "Milano",
      zone: newJob.zone || "",
      contract: newJob.contract || "Tempo indeterminato",
      remote: newJob.remote || "On-site",
      category: newJob.category || "Generale",
      salary: newJob.salary.trim() || "N/D",
      description: newJob.description.trim() || "",
      requirements: newJob.requirements.trim() || "",
      urgent: Boolean(newJob.urgent),
      distance: Number(newJob.distance || 0),
      match: computeMatchFromCV(newJob, cvData),
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert([jobToInsert])
      .select()
      .single();

    if (error) {
      console.error("Errore Supabase completo:", error);
      showToast(`Errore inserimento: ${error.message}`, "error", 4500);
    } else {
      setOffers((prev) => [data, ...prev]);
      setNewJob(createEmptyJob());
      setJobErrors({});
      setShowAddJobForm(false);
      showToast("Offerta aggiunta", "success", 2500);
    }
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
              Jobly unisce offerte, candidature, messaggi con le aziende, CV Studio e Auto Apply AI in un’unica esperienza moderna.
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

            <button className={`tab ${tab === "messaggi" ? "tab-active" : ""}`} onClick={() => setTab("messaggi")}>
              <MessageSquare size={16} />
              <span>Messaggi</span>
              {totalUnreadMessages > 0 ? <Badge className="badge-red">{totalUnreadMessages}</Badge> : null}
            </button>

            <button className={`tab ${tab === "notifiche" ? "tab-active" : ""}`} onClick={() => setTab("notifiche")}>
              <Bell size={16} />
              <span>Notifiche</span>
            </button>

            <button className={`tab ${tab === "profilo" ? "tab-active" : ""}`} onClick={() => setTab("profilo")}>
              <User size={16} />
              <span>Profilo</span>
            </button>

            <button className={`tab ${tab === "cv" ? "tab-active" : ""}`} onClick={() => setTab("cv")}>
              <FileText size={16} />
              <span>CV Studio</span>
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

                <div className="actions" style={{ marginTop: 0 }}>
                  <Button className="btn-red" onClick={() => setShowAddJobForm((prev) => !prev)}>
                    {showAddJobForm ? "Chiudi form" : "+ Aggiungi offerta"}
                  </Button>
                  <div className="muted">{offersLoading ? "..." : filteredOffers.length} risultati</div>
                </div>
              </div>

              {showAddJobForm && (
                <Card style={{ marginBottom: 20 }}>
                  <h3 style={{ marginBottom: 18 }}>Aggiungi nuova offerta</h3>

                  <div className="two-col" style={{ alignItems: "start" }}>
                    <div className="stack">
                      <div>
                        <FieldLabel>Titolo *</FieldLabel>
                        <Input
                          value={newJob.title}
                          onChange={(e) => updateNewJobField("title", e.target.value)}
                          placeholder="Es. Impiegato logistico"
                          style={jobErrors.title ? { border: "1px solid #ef4444" } : {}}
                        />
                        {jobErrors.title ? <div className="meta-text small" style={{ color: "#ef4444" }}>{jobErrors.title}</div> : null}
                      </div>

                      <div>
                        <FieldLabel>Azienda *</FieldLabel>
                        <Input
                          value={newJob.company}
                          onChange={(e) => updateNewJobField("company", e.target.value)}
                          placeholder="Es. Adecco"
                          style={jobErrors.company ? { border: "1px solid #ef4444" } : {}}
                        />
                        {jobErrors.company ? <div className="meta-text small" style={{ color: "#ef4444" }}>{jobErrors.company}</div> : null}
                      </div>

                      <div className="filters-grid">
                        <div>
                          <FieldLabel>Regione *</FieldLabel>
                          <SelectField
                            value={newJob.region}
                            onChange={(value) => updateNewJobField("region", value)}
                            options={Object.keys(locationData).map((item) => ({ value: item, label: item }))}
                            className={jobErrors.region ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Provincia *</FieldLabel>
                          <SelectField
                            value={newJob.province}
                            onChange={(value) => updateNewJobField("province", value)}
                            options={addJobProvinceOptions.map((item) => ({ value: item, label: item }))}
                            className={jobErrors.province ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Comune *</FieldLabel>
                          <SelectField
                            value={newJob.comune}
                            onChange={(value) => updateNewJobField("comune", value)}
                            options={addJobComuneOptions.map((item) => ({ value: item, label: item }))}
                            className={jobErrors.comune ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Zona</FieldLabel>
                          <SelectField
                            value={newJob.zone}
                            onChange={(value) => updateNewJobField("zone", value)}
                            options={[{ value: "", label: "Nessuna zona" }, ...addJobZoneOptions.map((item) => ({ value: item, label: item }))]}
                          />
                        </div>
                      </div>

                      <div className="filters-grid">
                        <div>
                          <FieldLabel>Contratto *</FieldLabel>
                          <SelectField
                            value={newJob.contract}
                            onChange={(value) => updateNewJobField("contract", value)}
                            options={[
                              { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                              { value: "Tempo determinato", label: "Tempo determinato" },
                              { value: "Somministrazione", label: "Somministrazione" },
                              { value: "Stage", label: "Stage" },
                            ]}
                            className={jobErrors.contract ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Modalità *</FieldLabel>
                          <SelectField
                            value={newJob.remote}
                            onChange={(value) => updateNewJobField("remote", value)}
                            options={[
                              { value: "On-site", label: "On-site" },
                              { value: "Ibrido", label: "Ibrido" },
                              { value: "Remoto", label: "Remoto" },
                            ]}
                            className={jobErrors.remote ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Categoria *</FieldLabel>
                          <SelectField
                            value={newJob.category}
                            onChange={(value) => updateNewJobField("category", value)}
                            options={[
                              { value: "Generale", label: "Generale" },
                              { value: "Amministrazione", label: "Amministrazione" },
                              { value: "Customer Service", label: "Customer Service" },
                              { value: "Logistica", label: "Logistica" },
                              { value: "Acquisti", label: "Acquisti" },
                              { value: "IT", label: "IT" },
                              { value: "Vendite", label: "Vendite" },
                            ]}
                            className={jobErrors.category ? "error-field" : ""}
                          />
                        </div>

                        <div>
                          <FieldLabel>Distanza km *</FieldLabel>
                          <Input
                            type="number"
                            min="0"
                            value={newJob.distance}
                            onChange={(e) => updateNewJobField("distance", e.target.value)}
                            placeholder="Es. 8"
                            style={jobErrors.distance ? { border: "1px solid #ef4444" } : {}}
                          />
                          {jobErrors.distance ? <div className="meta-text small" style={{ color: "#ef4444" }}>{jobErrors.distance}</div> : null}
                        </div>
                      </div>

                      <div>
                        <FieldLabel>RAL / Stipendio</FieldLabel>
                        <Input
                          value={newJob.salary}
                          onChange={(e) => updateNewJobField("salary", e.target.value)}
                          placeholder="Es. 28K-32K"
                        />
                      </div>
                    </div>

                    <div className="stack">
                      <div>
                        <FieldLabel>Descrizione offerta</FieldLabel>
                        <Textarea
                          value={newJob.description}
                          onChange={(e) => updateNewJobField("description", e.target.value)}
                          placeholder="Descrivi attività, responsabilità e contesto"
                        />
                      </div>

                      <div>
                        <FieldLabel>Requisiti</FieldLabel>
                        <Textarea
                          value={newJob.requirements}
                          onChange={(e) => updateNewJobField("requirements", e.target.value)}
                          placeholder="Es. esperienza, software richiesti, lingua, patentini"
                        />
                      </div>

                      <div className="inner-box">
                        <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input
                              type="checkbox"
                              checked={newJob.urgent}
                              onChange={(e) => updateNewJobField("urgent", e.target.checked)}
                            />
                            Offerta urgente
                          </label>
                          <Badge>Match stimato: {computeMatchFromCV(newJob, cvData)}%</Badge>
                        </div>
                      </div>

                      <div className="actions">
                        <Button className="btn-red" onClick={addJob}>
                          <Save size={16} />
                          Salva offerta
                        </Button>
                        <Button
                          className="btn-dark"
                          onClick={() => {
                            setNewJob(createEmptyJob());
                            setJobErrors({});
                            setShowAddJobForm(false);
                          }}
                        >
                          Chiudi
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {offersLoading ? (
                <div className="inner-box">Caricamento offerte...</div>
              ) : offersError ? (
                <div className="inner-box">{offersError}</div>
              ) : filteredOffers.length === 0 ? (
                <div className="inner-box">Nessuna offerta trovata.</div>
              ) : (
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
              )}
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

          {tab === "messaggi" && (
            <div className="two-col">
              <Card>
                <div className="section-head">
                  <div>
                    <h3>Conversazioni</h3>
                    <p>Messaggi tra azienda e candidato</p>
                  </div>
                </div>

                <div className="stack">
                  {recruiterMessages.length === 0 ? (
                    <div className="inner-box">Nessuna conversazione disponibile.</div>
                  ) : (
                    recruiterMessages.map((conv) => (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => openConversation(conv.id)}
                        className="inner-box"
                        style={{
                          textAlign: "left",
                          cursor: "pointer",
                          border:
                            conv.id === activeConversationId
                              ? "1px solid rgba(239,68,68,0.45)"
                              : undefined,
                        }}
                      >
                        <div className="section-head" style={{ marginBottom: 8 }}>
                          <div>
                            <div className="offer-title">{conv.company}</div>
                            <div className="meta-text small">{conv.jobTitle}</div>
                          </div>
                          {conv.unread ? <Badge className="badge-red">Nuovo</Badge> : <Badge>Letto</Badge>}
                        </div>
                        <p className="meta-text small">
                          {conv.messages[conv.messages.length - 1]?.text || "Nessun messaggio"}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </Card>

              <Card className="preview-card">
                <div className="section-head">
                  <div>
                    <h3>
                      {activeConversation
                        ? `${activeConversation.company} — ${activeConversation.jobTitle}`
                        : "Seleziona una conversazione"}
                    </h3>
                    <p>
                      {activeConversation
                        ? "Rispondi direttamente dalla piattaforma."
                        : "Apri una conversazione dalla colonna a sinistra."}
                    </p>
                  </div>
                </div>

                {activeConversation ? (
                  <>
                    <div className="chat-box" style={{ maxHeight: 360 }}>
                      {activeConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`msg ${
                            msg.sender === "user"
                              ? "msg-user"
                              : msg.sender === "company" || msg.sender === "system"
                              ? "msg-ai"
                              : "msg-ai"
                          }`}
                        >
                          <div style={{ marginBottom: 4 }}>{msg.text}</div>
                          <div style={{ fontSize: 11, opacity: 0.7 }}>{msg.time}</div>
                        </div>
                      ))}
                    </div>

                    <div className="chat-row">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendRecruiterMessage()}
                        placeholder="Scrivi una risposta all'azienda"
                      />
                      <Button className="btn-red" onClick={sendRecruiterMessage}>
                        <Send size={16} />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="inner-box">Nessuna conversazione selezionata.</div>
                )}
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

          {tab === "cv" && (
            <>
              <section>
                <div className="section-head">
                  <div>
                    <h2>CV Studio</h2>
                    <p>Costruisci, migliora, adatta e automatizza le candidature con Auto Apply AI.</p>
                  </div>
                  <div className="muted">Completamento CV {cvCompletion}%</div>
                </div>

                <div className="inner-box" style={{ marginBottom: 20 }}>
                  <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                    <div className="meta-text small">
                      {missingCVItems.length > 0
                        ? `Da completare: ${missingCVItems.join(", ")}`
                        : "CV completo nelle sezioni principali"}
                    </div>
                    <Button className="btn-dark" onClick={saveCurrentCV}>
                      <Save size={16} />
                      Salva ora
                    </Button>
                  </div>
                </div>

                <div className="tabs" style={{ marginBottom: 20 }}>
                  {[
                    { key: "dashboard", label: "Dashboard" },
                    { key: "create", label: "Crea CV" },
                    { key: "improve", label: "Migliora CV" },
                    { key: "match", label: "Adatta a offerta" },
                    { key: "letter", label: "Lettera" },
                    { key: "autoapply", label: "Auto Apply AI" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      className={`tab ${cvSection === item.key ? "tab-active" : ""}`}
                      onClick={() => setCvSection(item.key)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>

              {cvSection === "dashboard" && (
                <div className="two-col">
                  <Card>
                    <h3>Azioni principali</h3>
                    <div className="stack">
                      <div className="inner-box">
                        <div className="title-row">
                          <Upload size={16} color="#ef4444" />
                          <div className="section-label">Crea nuovo CV</div>
                        </div>
                        <p className="meta-text small">Compila i dati personali, profilo, esperienze, formazione e competenze.</p>
                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={() => openCVSection("create")}>
                          Inizia
                        </Button>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <Wand2 size={16} color="#ef4444" />
                          <div className="section-label">Migliora CV</div>
                        </div>
                        <p className="meta-text small">Riscrivi il profilo, rinforza le esperienze e rendi il CV più professionale.</p>
                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={() => openCVSection("improve")}>
                          Apri editor
                        </Button>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <Target size={16} color="#ef4444" />
                          <div className="section-label">Adatta a offerta</div>
                        </div>
                        <p className="meta-text small">Ottimizza il CV sulla job description scelta dalle offerte.</p>
                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={() => openCVSection("match")}>
                          Adatta
                        </Button>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <Bot size={16} color="#ef4444" />
                          <div className="section-label">Auto Apply AI</div>
                        </div>
                        <p className="meta-text small">Imposta filtri, prepara la coda e invia candidature coerenti in modo assistito.</p>
                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={() => openCVSection("autoapply")}>
                          Configura
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>Stato del tuo CV</h3>
                    <div className="stack">
                      <div className="inner-box">
                        <div className="section-label">Sezioni completate</div>
                        <div className="chips">
                          <Badge>{cvData.nome ? "Dati personali" : "Dati mancanti"}</Badge>
                          <Badge>{cvData.profilo ? "Profilo" : "Profilo mancante"}</Badge>
                          <Badge>{cvData.esperienze.some((x) => x.ruolo || x.azienda) ? "Esperienze" : "Esperienze mancanti"}</Badge>
                          <Badge>{cvData.competenze.length > 0 ? "Competenze" : "Competenze mancanti"}</Badge>
                        </div>
                      </div>

                      <div className="inner-box">
                        <div className="section-label">I tuoi CV</div>
                        {savedCVs.map((cv) => (
                          <div key={cv.id} style={{ marginBottom: 10 }}>
                            <div className="offer-title">{cv.name}</div>
                            <div className="meta-text small">
                              {cv.role} • {cv.updated} • {cv.status}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="inner-box">
                        <div className="section-label">Auto Apply AI</div>
                        <p className="meta-text small">
                          {autoApplyQueue.length > 0
                            ? `${autoApplyQueue.filter((x) => x.status === "Pronta").length} candidature pronte`
                            : "Nessuna coda preparata"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {cvSection === "create" && (
                <div className="two-col">
                  <Card>
                    <h3>Crea CV</h3>
                    <div className="stack">
                      <div className="inner-box">
                        <div className="title-row">
                          <User size={16} color="#ef4444" />
                          <div className="section-label">Dati personali</div>
                        </div>
                        <div className="stack">
                          <Input value={cvData.nome} onChange={(e) => setCvData({ ...cvData, nome: e.target.value })} placeholder="Nome" />
                          <Input value={cvData.cognome} onChange={(e) => setCvData({ ...cvData, cognome: e.target.value })} placeholder="Cognome" />
                          <Input value={cvData.email} onChange={(e) => setCvData({ ...cvData, email: e.target.value })} placeholder="Email" />
                          <Input value={cvData.telefono} onChange={(e) => setCvData({ ...cvData, telefono: e.target.value })} placeholder="Telefono" />
                          <Input value={cvData.citta} onChange={(e) => setCvData({ ...cvData, citta: e.target.value })} placeholder="Città" />
                          <Input value={cvData.ruolo} onChange={(e) => setCvData({ ...cvData, ruolo: e.target.value })} placeholder="Ruolo desiderato" />
                        </div>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <Sparkles size={16} color="#ef4444" />
                          <div className="section-label">Profilo professionale</div>
                        </div>
                        <Textarea value={cvData.profilo} onChange={(e) => setCvData({ ...cvData, profilo: e.target.value })} placeholder="Profilo professionale" />
                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={generateProfileAI}>
                          <Sparkles size={16} />
                          Genera profilo con AI
                        </Button>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <Briefcase size={16} color="#ef4444" />
                          <div className="section-label">Esperienze lavorative</div>
                        </div>
                        <div className="stack">
                          {cvData.esperienze.map((exp) => (
                            <div key={exp.id} className="inner-box">
                              <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                                <div className="section-label">Esperienza</div>
                                <Button className="btn-dark" onClick={() => removeExperience(exp.id)}>
                                  <Trash2 size={16} />
                                  Rimuovi
                                </Button>
                              </div>
                              <div className="stack">
                                <Input value={exp.ruolo} onChange={(e) => updateExperience(exp.id, "ruolo", e.target.value)} placeholder="Ruolo" />
                                <Input value={exp.azienda} onChange={(e) => updateExperience(exp.id, "azienda", e.target.value)} placeholder="Azienda" />
                                <Input value={exp.periodo} onChange={(e) => updateExperience(exp.id, "periodo", e.target.value)} placeholder="Periodo" />
                                <Textarea value={exp.descrizione} onChange={(e) => updateExperience(exp.id, "descrizione", e.target.value)} placeholder="Descrizione attività" />
                              </div>
                            </div>
                          ))}
                          <div className="actions">
                            <Button className="btn-dark" onClick={addExperience}>
                              <Plus size={16} />
                              Aggiungi esperienza
                            </Button>
                            <Button className="btn-dark" onClick={improveExperienceAI}>
                              <Wand2 size={16} />
                              Migliora prima esperienza
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <GraduationCap size={16} color="#ef4444" />
                          <div className="section-label">Formazione</div>
                        </div>
                        <div className="stack">
                          {cvData.formazione.map((edu) => (
                            <div key={edu.id} className="inner-box">
                              <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                                <div className="section-label">Formazione</div>
                                <Button className="btn-dark" onClick={() => removeEducation(edu.id)}>
                                  <Trash2 size={16} />
                                  Rimuovi
                                </Button>
                              </div>
                              <div className="stack">
                                <Input value={edu.titolo} onChange={(e) => updateEducation(edu.id, "titolo", e.target.value)} placeholder="Titolo di studio / corso" />
                                <Input value={edu.istituto} onChange={(e) => updateEducation(edu.id, "istituto", e.target.value)} placeholder="Istituto / ente" />
                                <Input value={edu.periodo} onChange={(e) => updateEducation(edu.id, "periodo", e.target.value)} placeholder="Periodo" />
                                <Textarea value={edu.descrizione} onChange={(e) => updateEducation(edu.id, "descrizione", e.target.value)} placeholder="Dettagli aggiuntivi" />
                              </div>
                            </div>
                          ))}
                          <Button className="btn-dark" onClick={addEducation}>
                            <Plus size={16} />
                            Aggiungi formazione
                          </Button>
                        </div>
                      </div>

                      <div className="inner-box">
                        <div className="title-row">
                          <CheckCircle2 size={16} color="#ef4444" />
                          <div className="section-label">Competenze</div>
                        </div>
                        <div className="actions" style={{ marginTop: 0 }}>
                          <Input
                            value={cvData.newSkill}
                            onChange={(e) => setCvData({ ...cvData, newSkill: e.target.value })}
                            placeholder="Aggiungi competenza"
                          />
                          <Button className="btn-dark" onClick={addSkill}>
                            <Plus size={16} />
                            Aggiungi
                          </Button>
                        </div>

                        <div className="chips" style={{ marginTop: 12 }}>
                          {cvData.competenze.map((skill) => (
                            <span key={skill} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "inherit",
                                  cursor: "pointer",
                                  padding: 0,
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <Button className="btn-dark" style={{ marginTop: 12 }} onClick={suggestSkillsAI}>
                          <Sparkles size={16} />
                          Suggerisci competenze
                        </Button>
                      </div>

                      <div className="actions">
                        <Button className="btn-red" onClick={saveCurrentCV}>
                          <Save size={16} />
                          Salva CV
                        </Button>
                        <Button className="btn-dark">
                          <Download size={16} />
                          Export PDF
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>Anteprima CV</h3>
                    <div className="stack">
                      <div>
                        <div className="preview-name">
                          {cvData.nome} {cvData.cognome}
                        </div>
                        <div className="meta-text">{cvData.ruolo}</div>
                        <div className="meta-text small">
                          {cvData.citta}
                          {cvData.email ? ` • ${cvData.email}` : ""}
                          {cvData.telefono ? ` • ${cvData.telefono}` : ""}
                        </div>
                      </div>

                      <SectionPreview title="Profilo" content={cvData.profilo} emptyText="Aggiungi un profilo professionale." />

                      <div className="inner-box">
                        <div className="section-label">Esperienze</div>
                        {cvData.esperienze.map((exp) => (
                          <div key={exp.id} style={{ marginBottom: 12 }}>
                            <div className="offer-title">{exp.ruolo || "Ruolo non specificato"}</div>
                            <div className="meta-text small">
                              {exp.azienda || "Azienda"} {exp.periodo ? `• ${exp.periodo}` : ""}
                            </div>
                            <p>{exp.descrizione || "Descrizione non inserita."}</p>
                          </div>
                        ))}
                      </div>

                      <div className="inner-box">
                        <div className="section-label">Competenze</div>
                        <div className="chips">
                          {cvData.competenze.map((s) => (
                            <Badge key={s}>{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {cvSection === "improve" && (
                <div className="two-col">
                  <Card>
                    <h3>Migliora CV</h3>
                    <div className="stack">
                      <div className="actions">
                        <Button className="btn-dark" onClick={generateProfileAI}>
                          Migliora profilo
                        </Button>
                        <Button className="btn-dark" onClick={improveExperienceAI}>
                          Riscrivi esperienze
                        </Button>
                        <Button className="btn-dark" onClick={suggestSkillsAI}>
                          Suggerisci competenze
                        </Button>
                      </div>

                      <SectionPreview title="Profilo aggiornato" content={cvData.profilo} emptyText="Nessun profilo aggiornato." />

                      <div className="inner-box">
                        <div className="section-label">Esperienze aggiornate</div>
                        {cvData.esperienze.map((exp) => (
                          <div key={exp.id} style={{ marginBottom: 12 }}>
                            <div className="offer-title">{exp.ruolo || "Ruolo non specificato"}</div>
                            <p>{exp.descrizione || "Descrizione non inserita."}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>Versione aggiornata</h3>
                    <div className="stack">
                      <SectionPreview title="Profilo migliorato" content={cvData.profilo} emptyText="Nessun profilo generato." />
                      <div className="inner-box">
                        <div className="section-label">Competenze suggerite</div>
                        <div className="chips">
                          {cvData.competenze.map((s) => (
                            <Badge key={s}>{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {cvSection === "match" && (
                <div className="two-col">
                  <Card>
                    <h3>Adatta CV a un’offerta</h3>
                    <div className="stack">
                      <Textarea
                        value={cvData.jobDescription}
                        onChange={(e) => setCvData({ ...cvData, jobDescription: e.target.value })}
                        placeholder="Incolla qui il testo dell'annuncio"
                      />

                      <div className="inner-box">
                        <div className="section-label">Azioni consigliate</div>
                        <div className="chips">
                          <Badge>Adatta profilo</Badge>
                          <Badge>Rafforza competenze</Badge>
                          <Badge>Personalizza esperienza</Badge>
                        </div>
                      </div>

                      <div className="actions">
                        <Button className="btn-red" onClick={adaptCVAI}>
                          Adatta il CV
                        </Button>
                        <Button className="btn-dark" onClick={generateCoverLetterAI}>
                          Genera lettera
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>CV ottimizzato</h3>
                    <div className="stack">
                      <SectionPreview title="Profilo adattato" content={cvData.profilo} emptyText="Genera una versione adattata." />
                      <div className="inner-box">
                        <div className="section-label">Competenze consigliate</div>
                        <div className="chips">
                          {cvData.competenze.map((s) => (
                            <Badge key={s}>{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {cvSection === "letter" && (
                <div className="two-col">
                  <Card>
                    <h3>Lettera di presentazione</h3>
                    <div className="stack">
                      <Textarea
                        value={cvData.coverLetter}
                        onChange={(e) => setCvData({ ...cvData, coverLetter: e.target.value })}
                        placeholder="Lettera di presentazione"
                      />
                      <div className="actions">
                        <Button className="btn-red" onClick={generateCoverLetterAI}>
                          Genera con AI
                        </Button>
                        <Button className="btn-dark" onClick={() => pulseSave("Lettera salvata")}>
                          <Save size={16} />
                          Salva
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>Consiglio AI</h3>
                    <div className="inner-box">
                      <p className="meta-text small">
                        Mantieni la lettera breve, credibile e specifica. Evita frasi troppo generiche e collega il tuo profilo ai requisiti dell’offerta.
                      </p>
                    </div>
                    <div className="inner-box" style={{ marginTop: 16 }}>
                      <div className="section-label">CV collegato</div>
                      <div className="file-box">
                        <FileText size={16} color="#ef4444" /> {profile.cvName}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {cvSection === "autoapply" && (
                <div className="two-col">
                  <Card>
                    <div className="section-head">
                      <div>
                        <h3>Auto Apply AI</h3>
                        <p>Imposta la strategia e fai preparare all’AI solo le candidature coerenti.</p>
                      </div>
                    </div>

                    <div className="stack">
                      <div className="inner-box">
                        <div className="title-row">
                          <SlidersHorizontal size={16} color="#ef4444" />
                          <div className="section-label">Regole candidatura</div>
                        </div>

                        <div className="stack">
                          <div className="actions" style={{ marginTop: 0 }}>
                            <label className="meta-text small" style={{ minWidth: 140 }}>Auto Apply attivo</label>
                            <SelectField
                              value={autoApplySettings.enabled ? "yes" : "no"}
                              onChange={(value) =>
                                setAutoApplySettings((prev) => ({ ...prev, enabled: value === "yes" }))
                              }
                              options={[
                                { value: "no", label: "No" },
                                { value: "yes", label: "Sì" },
                              ]}
                            />
                          </div>

                          <SelectField
                            value={autoApplySettings.mode}
                            onChange={(value) => setAutoApplySettings((prev) => ({ ...prev, mode: value }))}
                            options={[
                              { value: "review", label: "Modalità assistita" },
                              { value: "semi", label: "Semi-automatica" },
                              { value: "auto", label: "Automatica" },
                            ]}
                          />

                          <Input
                            type="number"
                            value={autoApplySettings.minMatch}
                            onChange={(e) =>
                              setAutoApplySettings((prev) => ({ ...prev, minMatch: e.target.value }))
                            }
                            placeholder="Match minimo %"
                          />

                          <Input
                            type="number"
                            value={autoApplySettings.minRal}
                            onChange={(e) =>
                              setAutoApplySettings((prev) => ({ ...prev, minRal: e.target.value }))
                            }
                            placeholder="RAL minima"
                          />

                          <SelectField
                            value={autoApplySettings.contract}
                            onChange={(value) => setAutoApplySettings((prev) => ({ ...prev, contract: value }))}
                            options={[
                              { value: "all", label: "Tutti i contratti" },
                              { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                              { value: "Tempo determinato", label: "Tempo determinato" },
                              { value: "Somministrazione", label: "Somministrazione" },
                            ]}
                          />

                          <SelectField
                            value={autoApplySettings.region}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                region: value,
                                province: "all",
                                comune: "all",
                                zone: "all",
                              }))
                            }
                            options={autoRegionOptions.map((r) => ({
                              value: r,
                              label: r === "all" ? "Tutte le regioni" : r,
                            }))}
                          />

                          <SelectField
                            value={autoApplySettings.province}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                province: value,
                                comune: "all",
                                zone: "all",
                              }))
                            }
                            options={autoProvinceOptions.map((p) => ({
                              value: p,
                              label: p === "all" ? "Tutte le province" : p,
                            }))}
                          />

                          <SelectField
                            value={autoApplySettings.comune}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                comune: value,
                                zone: "all",
                              }))
                            }
                            options={autoComuneOptions.map((c) => ({
                              value: c,
                              label: c === "all" ? "Tutti i comuni" : c,
                            }))}
                          />

                          <SelectField
                            value={autoApplySettings.zone}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({ ...prev, zone: value }))
                            }
                            options={autoZoneOptions.map((z) => ({
                              value: z,
                              label: z === "all" ? "Tutte le zone" : z,
                            }))}
                          />

                          <SelectField
                            value={autoApplySettings.maxDistance}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({ ...prev, maxDistance: value }))
                            }
                            options={[
                              { value: "5", label: "5 km" },
                              { value: "10", label: "10 km" },
                              { value: "20", label: "20 km" },
                              { value: "30", label: "30 km" },
                            ]}
                          />

                          <SelectField
                            value={autoApplySettings.remote}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({ ...prev, remote: value }))
                            }
                            options={[
                              { value: "all", label: "Tutte le modalità" },
                              { value: "Ibrido", label: "Ibrido" },
                              { value: "On-site", label: "On-site" },
                              { value: "Remoto", label: "Remoto" },
                            ]}
                          />

                          <SelectField
                            value={autoApplySettings.category}
                            onChange={(value) =>
                              setAutoApplySettings((prev) => ({ ...prev, category: value }))
                            }
                            options={[
                              { value: "all", label: "Tutte le categorie" },
                              { value: "Amministrazione", label: "Amministrazione" },
                              { value: "Customer Service", label: "Customer Service" },
                              { value: "Logistica", label: "Logistica" },
                              { value: "Acquisti", label: "Acquisti" },
                              { value: "IT", label: "IT" },
                              { value: "Vendite", label: "Vendite" },
                            ]}
                          />

                          <Input
                            value={autoApplySettings.requiredKeyword}
                            onChange={(e) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                requiredKeyword: e.target.value,
                              }))
                            }
                            placeholder="Keyword richiesta"
                          />

                          <Input
                            value={autoApplySettings.excludedKeyword}
                            onChange={(e) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                excludedKeyword: e.target.value,
                              }))
                            }
                            placeholder="Keyword esclusa"
                          />

                          <Input
                            type="number"
                            value={autoApplySettings.maxDailyApplications}
                            onChange={(e) =>
                              setAutoApplySettings((prev) => ({
                                ...prev,
                                maxDailyApplications: e.target.value,
                              }))
                            }
                            placeholder="Massimo candidature giornaliere"
                          />
                        </div>
                      </div>

                      <div className="actions">
                        <Button className="btn-dark" onClick={generateAutoApplyQueue}>
                          <Bot size={16} />
                          Prepara candidature AI
                        </Button>
                        <Button className="btn-red" onClick={executeAutoApply}>
                          <Play size={16} />
                          Invia selezionate
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="preview-card">
                    <h3>Coda Auto Apply</h3>
                    <div className="stack">
                      <div className="inner-box">
                        <div className="section-label">Sintesi</div>
                        <p className="meta-text small">
                          Modalità:{" "}
                          {autoApplySettings.mode === "review"
                            ? "assistita"
                            : autoApplySettings.mode === "semi"
                            ? "semi-automatica"
                            : "automatica"}
                          {" • "}
                          Match minimo: {autoApplySettings.minMatch}% {" • "}
                          RAL minima: €{Number(autoApplySettings.minRal || 0).toLocaleString("it-IT")}
                        </p>
                      </div>

                      {autoApplyQueue.length === 0 ? (
                        <div className="inner-box">
                          <div className="section-label">Nessuna coda pronta</div>
                          <p className="meta-text small">
                            Imposta i filtri e premi “Prepara candidature AI”.
                          </p>
                        </div>
                      ) : (
                        autoApplyQueue.map((item) => (
                          <div key={item.queueId} className="inner-box">
                            <div className="section-head" style={{ marginBottom: 8 }}>
                              <div>
                                <div className="offer-title">{item.title}</div>
                                <div className="meta-text small">
                                  {item.company} • {item.comune}
                                  {item.zone ? `, ${item.zone}` : ""}
                                </div>
                              </div>
                              <Badge className={item.status === "Inviata" ? "badge-red" : ""}>{item.status}</Badge>
                            </div>

                            <div className="chips">
                              <Badge>Match {item.match}%</Badge>
                              <Badge>{item.contract}</Badge>
                              <Badge>{item.salary}</Badge>
                              <Badge>{item.remote}</Badge>
                            </div>

                            <p className="meta-text small" style={{ marginTop: 10 }}>
                              {item.reason}
                            </p>

                            <div className="actions">
                              <Button className="btn-dark" onClick={() => toggleQueueSelection(item.queueId)}>
                                {item.selected ? "Deseleziona" : "Seleziona"}
                              </Button>
                              <Button className="btn-dark" onClick={() => setCvSection("match")}>
                                <Wand2 size={16} />
                                Adatta CV
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </>
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
                      Per Auto Apply AI imposta prima filtri duri: match minimo, RAL minima, contratto e distanza.
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
                    placeholder="Scrivi: aiutami con Auto Apply AI"
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

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            minWidth: 260,
            maxWidth: 420,
            padding: "14px 16px",
            borderRadius: 12,
            color: "#fff",
            background: toast.type === "error" ? "#b91c1c" : "#166534",
            boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
