import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  ChevronRight,
  Wand2,
  Briefcase,
  PenSquare,
  Download,
  CheckCircle2,
  Upload,
  GraduationCap,
  Layers3,
  Target,
  Plus,
  Trash2,
  Save,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const STORAGE_KEYS = {
  theme: "jobly_theme",
  savedIds: "jobly_saved_ids",
  applications: "jobly_applications",
  profile: "jobly_profile",
  jobPosts: "jobly_job_posts",
  chat: "jobly_chat",
  cvData: "jobly_cv_data",
  savedCVs: "jobly_saved_cvs",
  activeTab: "jobly_active_tab",
  activeCvSection: "jobly_active_cv_section",
  lastSavedAt: "jobly_last_saved_at",
  authSession: "jobly_auth_session",
  authUsers: "jobly_auth_users",
};

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

const defaultProfile = {
  name: "Christian D.",
  role: "Back Office / Order Management / Customer Support",
  city: "Milano",
  bio: "Profilo operativo con esperienza in customer support, gestione ordini e strumenti gestionali. Cerco ruoli stabili con crescita.",
  skills: "SAP, Back Office, Customer Care, Excel, Ticketing, Gestione ordini",
  cvName: "CV_Christian.pdf",
};

const defaultApplications = [
  { id: 101, title: "Help Desk IT", company: "Sielte", status: "In valutazione" },
  { id: 102, title: "Customer Care Specialist", company: "Randstad", status: "Inviata" },
];

const defaultJobPosts = [
  { title: "Impiegato Ufficio Acquisti", company: "Studio Retail", city: "Milano", contract: "Tempo indeterminato" },
];

const defaultChat = [
  {
    who: "ai",
    text: "Ciao, sono l’assistente Jobly. Posso aiutarti a trovare offerte, migliorare il CV e capire quali candidature hanno più senso.",
  },
];

const defaultCvData = {
  nome: "Christian",
  cognome: "D.",
  email: "",
  telefono: "",
  citta: "Milano",
  ruolo: "Back Office / Order Management",
  profilo:
    "Professionista operativo con esperienza in customer support, gestione ordini e utilizzo di strumenti gestionali. Orientato alla precisione, alla continuità operativa e alla qualità del servizio.",
  competenze: ["SAP", "Excel", "Back Office", "Customer Care", "Ticketing"],
  newSkill: "",
  esperienze: [
    {
      id: 1,
      ruolo: "Back Office / Supporto Clienti",
      azienda: "Azienda attuale",
      periodo: "2024 - Oggi",
      descrizione:
        "Gestione richieste clienti, aggiornamento dati, utilizzo di SAP, supporto operativo e monitoraggio pratiche.",
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
  coverLetter:
    "Gentile Recruiter, desidero sottoporre la mia candidatura per il ruolo indicato. Ho maturato esperienza in attività operative, customer support e gestione ordini, con attenzione alla precisione e alla continuità del servizio. Ritengo che il mio profilo possa essere coerente con le esigenze della vostra realtà.",
};

const defaultSavedCVs = [
  { id: 1, name: "CV_Christian.pdf", role: "Back Office / Order Management", updated: "Oggi", status: "Completo" },
  { id: 2, name: "CV_Logistica.pdf", role: "Logistica / Magazzino", updated: "Ieri", status: "Bozza" },
];

const defaultAuthSession = {
  isAuthenticated: false,
  email: "",
  name: "",
  mode: "",
  isDemo: false,
};

const defaultAuthUsers = [];

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

function Textarea(props) {
  return <textarea {...props} className={`textarea ${props.className || ""}`} />;
}

function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`btn ${className}`}>
      {children}
    </button>
  );
}

function OfferCard({ offer, onApply, saved, onToggleSave, onGoCV }) {
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
          <Button className="btn-red" onClick={() => onApply(offer)}>
            Candidati
          </Button>
          <Button className="btn-dark" onClick={() => onToggleSave(offer.id)}>
            <Bookmark size={16} /> {saved ? "Salvata" : "Salva"}
          </Button>
          <Button className="btn-dark" onClick={() => onGoCV(offer)}>
            <Wand2 size={16} /> Adatta CV
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function CVActionCard({ icon, title, desc, buttonLabel, onClick, red = false }) {
  return (
    <div className="inner-box">
      <div className="title-row" style={{ marginBottom: 8 }}>
        {icon}
        <div className="offer-title">{title}</div>
      </div>
      <div className="meta-text small">{desc}</div>
      <Button className={red ? "btn-red" : "btn-dark"} style={{ marginTop: 12 }} onClick={onClick}>
        {buttonLabel}
      </Button>
    </div>
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
  authError,
  authSuccess,
  authShowPassword,
  setAuthShowPassword,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  enterDemo,
}) {
  const premiumBg = theme === "dark"
    ? {
        background:
          "radial-gradient(circle at 20% 20%, rgba(239,68,68,0.22), transparent 24%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 18%), radial-gradient(circle at 50% 80%, rgba(239,68,68,0.14), transparent 24%), linear-gradient(135deg, #090b10 0%, #11141b 45%, #0b0d12 100%)",
        color: "#f5f7fb",
      }
    : {
        background:
          "radial-gradient(circle at 20% 20%, rgba(239,68,68,0.18), transparent 24%), radial-gradient(circle at 80% 30%, rgba(17,24,39,0.06), transparent 18%), radial-gradient(circle at 50% 80%, rgba(239,68,68,0.12), transparent 24%), linear-gradient(135deg, #ffffff 0%, #f4f7fb 48%, #eef2f7 100%)",
        color: "#111827",
      };

  const cardBg = theme === "dark" ? "rgba(17,20,27,0.88)" : "rgba(255,255,255,0.9)";
  const secondary = theme === "dark" ? "#aeb6c7" : "#5b6472";
  const border = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)";
  const inputBg = theme === "dark" ? "#0f131b" : "#f3f4f6";
  const inputColor = theme === "dark" ? "#f5f7fb" : "#111827";

  return (
    <div
      style={{
        minHeight: "100vh",
        ...premiumBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(239,68,68,0.16)",
          filter: "blur(40px)",
          top: -80,
          left: -80,
        }}
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          filter: "blur(44px)",
          bottom: -80,
          right: -50,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "min(1200px, calc(100% - 32px))",
          margin: "0 auto",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 28,
          alignItems: "center",
          padding: "28px 0",
        }}
      >
        <div style={{ paddingRight: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.08em" }}>
              <span style={{ color: premiumBg.color }}>JOB</span>
              <span style={{ color: "#ef4444" }}>LY</span>
            </div>
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.06)",
                border: `1px solid ${border}`,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Premium Access
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "clamp(2.3rem, 5vw, 4.4rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.05em",
              margin: "0 0 16px",
              maxWidth: 620,
            }}
          >
            La tua piattaforma lavoro,
            <br />
            con accesso premium e identità forte.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: 620,
              color: secondary,
              fontSize: 17,
              margin: "0 0 24px",
            }}
          >
            Entra in Jobly per gestire candidature, CV Studio, profilo professionale e strumenti AI in un’unica esperienza semplice, moderna e curata.
          </motion.p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["Accesso sicuro", "CV Studio", "AI integrata", "Esperienza premium"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid ${border}`,
                  background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.62)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            boxShadow: theme === "dark"
              ? "0 20px 60px rgba(0,0,0,0.35)"
              : "0 20px 60px rgba(15,23,42,0.12)",
            borderRadius: 28,
            padding: 26,
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { key: "login", label: "Accedi" },
              { key: "register", label: "Registrati" },
              { key: "forgot", label: "Password dimenticata" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setAuthMode(item.key)}
                style={{
                  border: "none",
                  padding: "11px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontWeight: 700,
                  background:
                    authMode === item.key
                      ? "#ef4444"
                      : theme === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(17,24,39,0.06)",
                  color: authMode === item.key ? "#fff" : inputColor,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
              {authMode === "login" && "Bentornato"}
              {authMode === "register" && "Crea il tuo account"}
              {authMode === "forgot" && "Recupera l’accesso"}
            </div>
            <div style={{ color: secondary, fontSize: 14 }}>
              {authMode === "login" && "Accedi per continuare in Jobly."}
              {authMode === "register" && "Registrati per salvare CV, profilo e candidature."}
              {authMode === "forgot" && "Inserisci la tua email per simulare il recupero password."}
            </div>
          </div>

          {authError && (
            <div
              style={{
                marginBottom: 14,
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: theme === "dark" ? "#fecaca" : "#b91c1c",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {authError}
            </div>
          )}

          {authSuccess && (
            <div
              style={{
                marginBottom: 14,
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.22)",
                color: theme === "dark" ? "#bbf7d0" : "#166534",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {authSuccess}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {authMode === "register" && (
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Nome</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", top: 15, left: 14, color: secondary }} />
                  <input
                    value={authForm.name}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Il tuo nome"
                    style={{
                      width: "100%",
                      padding: "13px 14px 13px 42px",
                      borderRadius: 16,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: inputColor,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", top: 15, left: 14, color: secondary }} />
                <input
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="nome@email.com"
                  style={{
                    width: "100%",
                    padding: "13px 14px 13px 42px",
                    borderRadius: 16,
                    border: `1px solid ${border}`,
                    background: inputBg,
                    color: inputColor,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {authMode !== "forgot" && (
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", top: 15, left: 14, color: secondary }} />
                  <input
                    type={authShowPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Inserisci password"
                    style={{
                      width: "100%",
                      padding: "13px 44px 13px 42px",
                      borderRadius: 16,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: inputColor,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setAuthShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 11,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: secondary,
                    }}
                  >
                    {authShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {authMode === "register" && (
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Conferma password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", top: 15, left: 14, color: secondary }} />
                  <input
                    type={authShowPassword ? "text" : "password"}
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Conferma password"
                    style={{
                      width: "100%",
                      padding: "13px 14px 13px 42px",
                      borderRadius: 16,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: inputColor,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
            {authMode === "login" && (
              <Button className="btn-red" onClick={handleLogin}>
                Accedi
              </Button>
            )}
            {authMode === "register" && (
              <Button className="btn-red" onClick={handleRegister}>
                Crea account
              </Button>
            )}
            {authMode === "forgot" && (
              <Button className="btn-red" onClick={handleForgotPassword}>
                Invia richiesta
              </Button>
            )}

            <Button className="btn-dark" onClick={enterDemo}>
              Continua in demo
            </Button>
          </div>

          <div style={{ marginTop: 18, color: secondary, fontSize: 13 }}>
            Accesso premium, semplice e immediato. Il suono lo valutiamo dopo.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function JoblyApp() {
  const [tab, setTab] = useState(() => readStorage(STORAGE_KEYS.activeTab, "offerte"));
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, "dark"));

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [contract, setContract] = useState("all");
  const [maxDistance, setMaxDistance] = useState("30");

  const [savedIds, setSavedIds] = useState(() => readStorage(STORAGE_KEYS.savedIds, [1]));
  const [applications, setApplications] = useState(() => readStorage(STORAGE_KEYS.applications, defaultApplications));
  const [profile, setProfile] = useState(() => readStorage(STORAGE_KEYS.profile, defaultProfile));
  const [jobPosts, setJobPosts] = useState(() => readStorage(STORAGE_KEYS.jobPosts, defaultJobPosts));
  const [chat, setChat] = useState(() => readStorage(STORAGE_KEYS.chat, defaultChat));
  const [cvData, setCvData] = useState(() => readStorage(STORAGE_KEYS.cvData, defaultCvData));
  const [savedCVs, setSavedCVs] = useState(() => readStorage(STORAGE_KEYS.savedCVs, defaultSavedCVs));
  const [cvSection, setCvSection] = useState(() => readStorage(STORAGE_KEYS.activeCvSection, "dashboard"));
  const [lastSavedAt, setLastSavedAt] = useState(() => readStorage(STORAGE_KEYS.lastSavedAt, null));
  const [saveFeedback, setSaveFeedback] = useState("");

  const [authSession, setAuthSession] = useState(() => readStorage(STORAGE_KEYS.authSession, defaultAuthSession));
  const [authUsers, setAuthUsers] = useState(() => readStorage(STORAGE_KEYS.authUsers, defaultAuthUsers));
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

  const [newPost, setNewPost] = useState({
    title: "",
    company: "",
    city: "",
    contract: "Tempo indeterminato",
  });

  const [chatInput, setChatInput] = useState("");

  const syncUserIntoProfile = (user) => {
    const safeName = user?.name?.trim() || "Utente Jobly";
    const safeEmail = user?.email?.trim() || "";

    setProfile((prev) => ({
      ...prev,
      name: safeName,
    }));

    setCvData((prev) => ({
      ...prev,
      nome: safeName.split(" ")[0] || prev.nome,
      cognome: safeName.split(" ").slice(1).join(" ") || prev.cognome,
      email: prev.email || safeEmail,
    }));
  };

  const persistAllData = (message = "Dati salvati") => {
    const now = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
    localStorage.setItem(STORAGE_KEYS.savedIds, JSON.stringify(savedIds));
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.jobPosts, JSON.stringify(jobPosts));
    localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(chat));
    localStorage.setItem(STORAGE_KEYS.cvData, JSON.stringify(cvData));
    localStorage.setItem(STORAGE_KEYS.savedCVs, JSON.stringify(savedCVs));
    localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(tab));
    localStorage.setItem(STORAGE_KEYS.activeCvSection, JSON.stringify(cvSection));
    localStorage.setItem(STORAGE_KEYS.lastSavedAt, JSON.stringify(now));
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(authSession));
    localStorage.setItem(STORAGE_KEYS.authUsers, JSON.stringify(authUsers));

    setLastSavedAt(now);
    setSaveFeedback(`${message} alle ${now}`);

    window.clearTimeout(window.__joblySaveTimer);
    window.__joblySaveTimer = window.setTimeout(() => {
      setSaveFeedback("");
    }, 2200);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedIds, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.jobPosts, JSON.stringify(jobPosts));
  }, [jobPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cvData, JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedCVs, JSON.stringify(savedCVs));
  }, [savedCVs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(tab));
  }, [tab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeCvSection, JSON.stringify(cvSection));
  }, [cvSection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(authSession));
  }, [authSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authUsers, JSON.stringify(authUsers));
  }, [authUsers]);

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

  const applyToOffer = (offer) => {
    const exists = applications.some((a) => a.title === offer.title && a.company === offer.company);
    if (!exists) {
      setApplications((prev) => [
        { id: Date.now(), title: offer.title, company: offer.company, status: "Inviata" },
        ...prev,
      ]);
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
    persistAllData("Offerta salvata");
  };

  const handleGoToCVFromOffer = (offer) => {
    const generatedJD = `${offer.title} presso ${offer.company}. Sede: ${offer.city}, ${offer.zone}. Contratto: ${offer.contract}. Modalità: ${offer.remote}. Fascia retributiva: ${offer.salary}.`;
    setCvData((prev) => ({ ...prev, jobDescription: generatedJD }));
    setTab("cv");
    setCvSection("match");
  };

  const generateProfileAI = () => {
    setCvData((prev) => ({
      ...prev,
      profilo:
        "Professionista con esperienza in back office, gestione ordini e supporto clienti. Abituato a operare con precisione su processi amministrativi e operativi, con attenzione alla qualità del servizio, all’uso di strumenti gestionali e al rispetto delle priorità aziendali.",
    }));
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
  };

  const generateCoverLetterAI = () => {
    setCvData((prev) => ({
      ...prev,
      coverLetter:
        "Gentile Recruiter,\n\nho letto con interesse la vostra opportunità e desidero sottoporre la mia candidatura. Nel mio percorso ho maturato esperienza in attività di back office, gestione ordini, aggiornamento dati e supporto clienti, sviluppando precisione operativa, attenzione alle priorità e capacità di lavorare in modo affidabile su processi strutturati.\n\nRitengo che il mio profilo possa essere in linea con il ruolo ricercato e sarei interessato ad approfondire il contributo che potrei portare alla vostra realtà.\n\nCordiali saluti.",
    }));
  };

  const saveCurrentCV = () => {
    const newCV = {
      id: Date.now(),
      name: `${cvData.nome || "CV"}_${cvData.ruolo?.replaceAll("/", "-") || "Nuovo"}.pdf`,
      role: cvData.ruolo || "Ruolo non specificato",
      updated: "Adesso",
      status: cvCompletion >= 80 ? "Completo" : "Bozza",
    };
    setSavedCVs((prev) => [newCV, ...prev]);
    setProfile((prev) => ({ ...prev, cvName: newCV.name }));
    persistAllData("CV salvato");
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

  const clearLocalData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
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
      name: user.name || "Utente Jobly",
      mode: "account",
      isDemo: false,
    };

    setAuthSession(session);
    syncUserIntoProfile(user);
    setAuthSuccess("Accesso effettuato.");
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
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
      createdAt: new Date().toISOString(),
    };

    setAuthUsers((prev) => [...prev, newUser]);

    const session = {
      isAuthenticated: true,
      email,
      name,
      mode: "account",
      isDemo: false,
    };

    setAuthSession(session);
    syncUserIntoProfile(newUser);
    setAuthSuccess("Account creato con successo.");
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
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

    setAuthSuccess(`Richiesta registrata per ${email}. Per ora è una simulazione locale.`);
  };

  const enterDemo = () => {
    setAuthError("");
    setAuthSuccess("");

    const demoSession = {
      isAuthenticated: true,
      email: "demo@jobly.local",
      name: "Demo User",
      mode: "demo",
      isDemo: true,
    };

    setAuthSession(demoSession);
    syncUserIntoProfile({ name: "Demo User", email: "demo@jobly.local" });
  };

  const handleLogout = () => {
    setAuthSession(defaultAuthSession);
    setAuthMode("login");
    setAuthForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
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
        authError={authError}
        authSuccess={authSuccess}
        authShowPassword={authShowPassword}
        setAuthShowPassword={setAuthShowPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleForgotPassword={handleForgotPassword}
        enterDemo={enterDemo}
      />
    );
  }

  return (
    <div className={`app-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
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
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Cambia tema"
            title="Cambia tema"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Bell size={20} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <User size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {authSession.name}
            </span>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={handleLogout}
            aria-label="Esci"
            title="Esci"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>Trova il lavoro giusto, con un’interfaccia che ti fa tornare.</h1>
          <p>
            {authSession.isDemo
              ? "Stai usando Jobly in modalità demo. Puoi esplorare tutte le sezioni e testare il flusso."
              : `Bentornato ${authSession.name}. Jobly unisce offerte, candidature, profilo pubblico e assistente AI in un’unica esperienza moderna.`}
          </p>
          <div className="chips">
            <Badge className="badge-red">Match intelligenti</Badge>
            <Badge className="badge-dark">Filtri smart</Badge>
            <Badge className="badge-dark">Recruiter view</Badge>
          </div>
        </div>

        <Card className="search-card">
          <div className="label-row">
            <Filter size={16} /> Ricerca rapida
          </div>

          <div className="search-line">
            <Search size={16} className="search-icon" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ruolo, azienda, città..." />
          </div>

          <div className="filters-grid">
            <SelectField
              value={city}
              onChange={setCity}
              options={[
                { value: "all", label: "Tutte le città" },
                { value: "Milano", label: "Milano" },
                { value: "Segrate", label: "Segrate" },
                { value: "Pioltello", label: "Pioltello" },
              ]}
            />
            <SelectField
              value={contract}
              onChange={setContract}
              options={[
                { value: "all", label: "Tutti i contratti" },
                { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                { value: "Tempo determinato", label: "Tempo determinato" },
                { value: "Part-time", label: "Part-time" },
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

      <div className="tabs">
        {["offerte", "candidature", "notifiche", "profilo", "cv", "ai"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "tab-active" : ""}`} onClick={() => setTab(t)}>
            {t === "ai" ? "AI Support" : t === "cv" ? "CV Studio" : t.charAt(0).toUpperCase() + t.slice(1)}
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
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onApply={applyToOffer}
                    saved={savedIds.includes(offer.id)}
                    onToggleSave={toggleSave}
                    onGoCV={handleGoToCVFromOffer}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="section-head">
                <h3>Offerte pubblicate dai recruiter</h3>
                <Button className="btn-dark">
                  Vedi tutte <ChevronRight size={16} />
                </Button>
              </div>

              <div className="offer-grid">
                {jobPosts.map((post, idx) => (
                  <Card key={idx}>
                    <div className="offer-title">{post.title}</div>
                    <div className="meta-text">{post.company}</div>
                    <div className="meta-text small">
                      {post.city} • {post.contract}
                    </div>
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
                <SelectField
                  value={newPost.contract}
                  onChange={(v) => setNewPost({ ...newPost, contract: v })}
                  options={[
                    { value: "Tempo indeterminato", label: "Tempo indeterminato" },
                    { value: "Tempo determinato", label: "Tempo determinato" },
                    { value: "Part-time", label: "Part-time" },
                  ]}
                />
                <Button className="btn-red" onClick={addPost}>
                  Pubblica
                </Button>
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
                <Button className="btn-red" onClick={() => persistAllData("Profilo salvato")}>
                  <Save size={16} /> Salva profilo
                </Button>
                <Button className="btn-dark" onClick={() => openCVSection("dashboard")}>
                  <FileText size={16} /> Vai a CV Studio
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
                    <MapPin size={14} /> {profile.city}
                  </div>
                </div>
              </div>

              <div>
                <div className="section-label">Bio</div>
                <p>{profile.bio}</p>
              </div>

              <div>
                <div className="section-label">Competenze</div>
                <div className="chips">
                  {profile.skills.split(",").map((s, i) => (
                    <Badge key={i}>{s.trim()}</Badge>
                  ))}
                </div>
              </div>

              <div className="file-box">
                <FileText size={16} color="#ef4444" /> {profile.cvName}
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
                  <p>Costruisci, migliora e adatta il tuo CV con un flusso dedicato.</p>
                </div>
                <div className="muted">Completamento CV {cvCompletion}%</div>
              </div>

              <div className="inner-box" style={{ marginBottom: 20 }}>
                <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
                  <div className="meta-text small">
                    {saveFeedback || (lastSavedAt ? `Ultimo salvataggio: ${lastSavedAt}` : "Salvataggio locale disponibile")}
                  </div>
                  <Button className="btn-dark" onClick={() => persistAllData("CV salvato manualmente")}>
                    <Save size={16} /> Salva ora
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
                  <div className="actions" style={{ justifyContent: "space-between", marginTop: 0, marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Azioni principali</h3>
                    <Button className="btn-dark" onClick={() => persistAllData("Dashboard salvata")}>
                      <Save size={16} /> Salva
                    </Button>
                  </div>

                  <div className="stack">
                    <CVActionCard
                      icon={<FileText size={18} color="#ef4444" />}
                      title="Crea nuovo CV"
                      desc="Parti da zero con dati personali, profilo, esperienze, formazione e competenze."
                      buttonLabel="Inizia"
                      onClick={() => setCvSection("create")}
                      red
                    />
                    <CVActionCard
                      icon={<Wand2 size={18} color="#ef4444" />}
                      title="Migliora CV"
                      desc="Riscrivi testi, rendi il profilo più professionale e correggi le sezioni principali."
                      buttonLabel="Apri editor"
                      onClick={() => setCvSection("improve")}
                    />
                    <CVActionCard
                      icon={<Target size={18} color="#ef4444" />}
                      title="Adatta CV a offerta"
                      desc="Ottimizza il CV per una job description specifica e migliora il match."
                      buttonLabel="Adatta ora"
                      onClick={() => setCvSection("match")}
                    />
                    <CVActionCard
                      icon={<PenSquare size={18} color="#ef4444" />}
                      title="Lettera di presentazione"
                      desc="Genera una lettera coerente con il ruolo e con il tuo profilo."
                      buttonLabel="Genera lettera"
                      onClick={() => setCvSection("letter")}
                    />
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
                      <div className="section-label">Da completare</div>
                      <p className="meta-text small">
                        {missingCVItems.length > 0
                          ? `Ti conviene completare: ${missingCVItems.join(", ")}.`
                          : "Hai compilato tutte le sezioni principali del CV."}
                      </p>
                    </div>

                    <div className="inner-box">
                      <div className="section-label">Suggerimento AI</div>
                      <p className="meta-text small">
                        Per aumentare il valore del CV, aggiungi una formazione più precisa e usa risultati concreti nelle esperienze.
                      </p>
                    </div>

                    <div className="inner-box">
                      <div className="section-label">Salvataggio locale</div>
                      <p className="meta-text small">
                        I dati attuali restano salvati nel browser anche se aggiorni la pagina.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3>I tuoi CV</h3>
                  <div className="stack">
                    {savedCVs.map((cv) => (
                      <div key={cv.id} className="inner-box">
                        <div className="offer-title">{cv.name}</div>
                        <div className="meta-text small">{cv.role}</div>
                        <div className="meta-text small">Ultimo aggiornamento: {cv.updated}</div>
                        <div className="chips" style={{ marginTop: 10 }}>
                          <Badge className={cv.status === "Completo" ? "badge-dark" : ""}>{cv.status}</Badge>
                        </div>
                        <div className="actions" style={{ marginTop: 12 }}>
                          <Button className="btn-dark">Apri</Button>
                          <Button className="btn-dark">Modifica</Button>
                          <Button className="btn-dark">Duplica</Button>
                          <Button className="btn-red">
                            <Download size={16} /> Scarica
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3>Scorciatoie utili</h3>
                  <div className="stack">
                    <div className="inner-box">
                      <div className="title-row">
                        <Layers3 size={16} color="#ef4444" />
                        <div className="section-label">Ottimizza il profilo</div>
                      </div>
                      <p className="meta-text small">Rendi il tuo profilo più coerente con ruoli di back office, order management e customer support.</p>
                      <Button className="btn-dark" style={{ marginTop: 12 }} onClick={generateProfileAI}>
                        Genera miglioramento
                      </Button>
                    </div>

                    <div className="inner-box">
                      <div className="title-row">
                        <Briefcase size={16} color="#ef4444" />
                        <div className="section-label">Rinforza le esperienze</div>
                      </div>
                      <p className="meta-text small">Riscrivi le attività in modo più professionale e mirato.</p>
                      <Button className="btn-dark" style={{ marginTop: 12 }} onClick={improveExperienceAI}>
                        Migliora esperienze
                      </Button>
                    </div>

                    <div className="inner-box">
                      <div className="title-row">
                        <Trash2 size={16} color="#ef4444" />
                        <div className="section-label">Reset dati locali</div>
                      </div>
                      <p className="meta-text small">Cancella i dati salvati in locale e ricarica l’app.</p>
                      <Button className="btn-dark" style={{ marginTop: 12 }} onClick={clearLocalData}>
                        Resetta dati
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {cvSection === "create" && (
              <div className="two-col">
                <Card>
                  <div className="actions" style={{ justifyContent: "space-between", marginTop: 0, marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Crea il tuo CV</h3>
                    <Button className="btn-dark" onClick={() => persistAllData("Sezione Crea CV salvata")}>
                      <Save size={16} /> Salva
                    </Button>
                  </div>

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
                        <Sparkles size={16} /> Genera profilo con AI
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
                                <Trash2 size={16} /> Rimuovi
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
                            <Plus size={16} /> Aggiungi esperienza
                          </Button>
                          <Button className="btn-dark" onClick={improveExperienceAI}>
                            <Wand2 size={16} /> Migliora prima esperienza
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
                                <Trash2 size={16} /> Rimuovi
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
                          <Plus size={16} /> Aggiungi formazione
                        </Button>
                      </div>
                    </div>

                    <div className="inner-box">
                      <div className="title-row">
                        <CheckCircle2 size={16} color="#ef4444" />
                        <div className="section-label">Competenze</div>
                      </div>

                      <div className="stack">
                        <div className="actions" style={{ marginTop: 0 }}>
                          <Input
                            value={cvData.newSkill}
                            onChange={(e) => setCvData({ ...cvData, newSkill: e.target.value })}
                            placeholder="Aggiungi competenza"
                          />
                          <Button className="btn-dark" onClick={addSkill}>
                            <Plus size={16} /> Aggiungi
                          </Button>
                        </div>

                        <div className="chips">
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

                        <Button className="btn-dark" onClick={suggestSkillsAI}>
                          <Sparkles size={16} /> Suggerisci competenze
                        </Button>
                      </div>
                    </div>

                    <div className="actions">
                      <Button className="btn-red" onClick={saveCurrentCV}>
                        <Save size={16} /> Salva CV
                      </Button>
                      <Button className="btn-dark">
                        <Download size={16} /> Export PDF
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
                      {cvData.esperienze.some((x) => x.ruolo || x.azienda || x.descrizione) ? (
                        <div className="stack">
                          {cvData.esperienze.map((exp) => (
                            <div key={exp.id}>
                              <div className="offer-title">{exp.ruolo || "Ruolo non specificato"}</div>
                              <div className="meta-text small">
                                {exp.azienda || "Azienda"} {exp.periodo ? `• ${exp.periodo}` : ""}
                              </div>
                              <p>{exp.descrizione || "Descrizione non inserita."}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Aggiungi almeno una esperienza lavorativa.</p>
                      )}
                    </div>

                    <div className="inner-box">
                      <div className="section-label">Formazione</div>
                      {cvData.formazione.some((x) => x.titolo || x.istituto) ? (
                        <div className="stack">
                          {cvData.formazione.map((edu) => (
                            <div key={edu.id}>
                              <div className="offer-title">{edu.titolo || "Titolo non specificato"}</div>
                              <div className="meta-text small">
                                {edu.istituto || "Istituto"} {edu.periodo ? `• ${edu.periodo}` : ""}
                              </div>
                              <p>{edu.descrizione || "Nessun dettaglio aggiuntivo."}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Aggiungi il tuo titolo di studio e gli eventuali corsi.</p>
                      )}
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
                  <div className="actions" style={{ justifyContent: "space-between", marginTop: 0, marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Migliora CV esistente</h3>
                    <Button className="btn-dark" onClick={() => persistAllData("Sezione Migliora CV salvata")}>
                      <Save size={16} /> Salva
                    </Button>
                  </div>

                  <div className="stack">
                    <div className="inner-box">
                      <div className="title-row">
                        <Upload size={16} color="#ef4444" />
                        <div className="section-label">Interventi rapidi AI</div>
                      </div>
                      <p className="meta-text small">
                        Usa questi strumenti per ripulire il CV, migliorare le descrizioni e rafforzare le competenze.
                      </p>
                    </div>

                    <div className="actions">
                      <Button className="btn-dark" onClick={generateProfileAI}>Migliora profilo</Button>
                      <Button className="btn-dark" onClick={improveExperienceAI}>Riscrivi esperienze</Button>
                      <Button className="btn-dark" onClick={suggestSkillsAI}>Suggerisci competenze</Button>
                    </div>

                    <SectionPreview title="Profilo aggiornato" content={cvData.profilo} emptyText="Nessun profilo aggiornato." />

                    <div className="inner-box">
                      <div className="section-label">Esperienze aggiornate</div>
                      <div className="stack">
                        {cvData.esperienze.map((exp) => (
                          <div key={exp.id}>
                            <div className="offer-title">{exp.ruolo || "Ruolo non specificato"}</div>
                            <p>{exp.descrizione || "Descrizione non inserita."}</p>
                          </div>
                        ))}
                      </div>
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

                    <div className="inner-box">
                      <div className="section-label">Consiglio AI</div>
                      <p className="meta-text small">
                        Evita descrizioni troppo generiche. Meglio frasi più concrete, chiare e vicine al ruolo cercato.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {cvSection === "match" && (
              <div className="two-col">
                <Card>
                  <div className="actions" style={{ justifyContent: "space-between", marginTop: 0, marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Adatta CV a un’offerta</h3>
                    <Button className="btn-dark" onClick={() => persistAllData("Sezione Adatta a offerta salvata")}>
                      <Save size={16} /> Salva
                    </Button>
                  </div>

                  <div className="stack">
                    <Textarea
                      value={cvData.jobDescription}
                      onChange={(e) => setCvData({ ...cvData, jobDescription: e.target.value })}
                      placeholder="Incolla qui il testo dell'annuncio"
                    />

                    <div className="inner-box">
                      <div className="section-label">Analisi offerta</div>
                      <p className="meta-text small">
                        Ruolo orientato ad attività operative e di coordinamento. Probabili parole chiave:
                        gestione ordini, supporto clienti, precisione, strumenti gestionali, continuità operativa.
                      </p>
                    </div>

                    <div className="inner-box">
                      <div className="section-label">Azioni consigliate</div>
                      <div className="chips">
                        <Badge>Adatta profilo</Badge>
                        <Badge>Rafforza competenze</Badge>
                        <Badge>Personalizza esperienza</Badge>
                      </div>
                    </div>

                    <div className="actions">
                      <Button className="btn-red" onClick={adaptCVAI}>Adatta il CV</Button>
                      <Button className="btn-dark" onClick={generateCoverLetterAI}>Genera lettera</Button>
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

                    <div className="inner-box">
                      <div className="section-label">Valutazione match</div>
                      <p className="meta-text small">
                        Il tuo profilo è coerente, ma migliora se evidenzi gestione ordini, precisione operativa e uso di strumenti gestionali.
                      </p>
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
                      <Button className="btn-red" onClick={generateCoverLetterAI}>Genera con AI</Button>
                      <Button className="btn-dark" onClick={() => persistAllData("Lettera salvata")}>
                        <Save size={16} /> Salva
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
          </>
        )}

        {tab === "ai" && (
          <div className="two-col">
            <Card>
              <h3 className="title-row">
                <Sparkles size={18} color="#ef4444" /> Cosa può fare l’AI
              </h3>
              <div className="stack">
                <div className="inner-box">Trova offerte in linguaggio naturale: “milano, indeterminato, entro 10 km”.</div>
                <div className="inner-box">Suggerisce come migliorare CV e profilo.</div>
                <div className="inner-box">Aiuta recruiter a scrivere annunci più chiari.</div>
                <div className="inner-box">Spiega perché un’offerta è coerente con il tuo profilo.</div>
                <div className="inner-box">Collega la candidatura alla sezione CV Studio per adattare il curriculum.</div>
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
                  placeholder="Scrivi: trova offerte a Milano indeterminato"
                />
                <Button className="btn-red" onClick={sendChat}>
                  <Send size={16} />
                </Button>
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
