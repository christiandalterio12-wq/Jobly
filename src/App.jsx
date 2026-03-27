import React, { useEffect, useMemo, useRef, useState } from "react";
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
  importedFile: null,
  importedText: "",
  importedStatus: "",
  importedManualText: "",
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

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
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
  const isDark = theme === "dark";
  const isMobile = useIsMobile(900);

  const premiumBg = isDark
    ? {
        background: "linear-gradient(180deg, #0a0d12 0%, #11141b 55%, #0c1016 100%)",
        color: "#f5f7fb",
      }
    : {
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fb 55%, #eef2f7 100%)",
        color: "#111827",
      };

  const cardBg = isDark ? "rgba(17,20,27,0.96)" : "rgba(255,255,255,0.98)";
  const secondary = isDark ? "#aeb6c7" : "#5b6472";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)";
  const inputBg = isDark ? "#0f131b" : "#f3f4f6";
  const inputColor = isDark ? "#f5f7fb" : "#111827";

  return (
    <div
      style={{
        minHeight: "100svh",
        ...premiumBg,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {!isMobile && (
        <>
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 12, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
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
              background: "rgba(255,255,255,0.05)",
              filter: "blur(44px)",
              bottom: -80,
              right: -50,
            }}
          />
        </>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: isMobile ? 560 : 1200,
          margin: "0 auto",
          minHeight: "100svh",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.08fr 0.92fr",
          gap: isMobile ? 20 : 28,
          alignItems: "center",
          padding: isMobile ? "20px 16px 32px" : "28px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ paddingRight: isMobile ? 0 : 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{ fontSize: isMobile ? "1.7rem" : "2rem", fontWeight: 800, letterSpacing: "0.08em" }}>
              <span style={{ color: premiumBg.color }}>JOB</span>
              <span style={{ color: "#ef4444" }}>LY</span>
            </div>
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.06)",
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
              fontSize: isMobile ? "2.2rem" : "clamp(2.3rem, 5vw, 4.4rem)",
              lineHeight: isMobile ? 1.03 : 0.98,
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
              fontSize: isMobile ? 15 : 17,
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
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.62)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {item}
              </div>
            ))}
          </div
