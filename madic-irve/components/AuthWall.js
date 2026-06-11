"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";

const ROLES = [
  { value: "client", label: "Client / Distributeur", hint: "Accédez aux simulateurs et configurez votre projet" },
  { value: "commercial", label: "Commercial MADIC", hint: "Accès complet aux outils d'aide à la vente" },
];

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#16202c]">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-madic-red" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ id, type = "text", placeholder, value, onChange, required, autoComplete }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
      className="w-full rounded-xl border border-madic-grey/40 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-madic-red focus:ring-2 focus:ring-madic-red/10"
    />
  );
}

export default function AuthWall({ onAuthenticated }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regRole, setRegRole] = useState("client");
  const [regErrors, setRegErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(loginEmail, loginPassword);
    setLoading(false);
    if (!result.ok) {
      setGlobalError(result.error);
    } else {
      onAuthenticated?.();
    }
  };

  const validateRegister = () => {
    const errs = {};
    if (!regName.trim()) errs.name = "Nom requis";
    if (!regCompany.trim()) errs.company = "Société requise";
    if (!regEmail.includes("@")) errs.email = "Email invalide";
    if (regPassword.length < 6) errs.password = "6 caractères minimum";
    if (regPassword !== regPassword2) errs.password2 = "Les mots de passe ne correspondent pas";
    return errs;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError("");
    const errs = validateRegister();
    if (Object.keys(errs).length) {
      setRegErrors(errs);
      return;
    }
    setRegErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = register({ name: regName, company: regCompany, email: regEmail, password: regPassword, role: regRole });
    setLoading(false);
    if (!result.ok) {
      setGlobalError(result.error);
    } else {
      onAuthenticated?.();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-madic-navy/5 to-white px-4 py-12">
      {/* Carte */}
      <div className="w-full max-w-md">
        {/* Logo + titre */}
        <div className="mb-8 text-center">
          <a href="/" aria-label="Retour à l'accueil">
            <Logo variant="color" className="mx-auto mb-5 text-[40px]" />
          </a>
          <h1 className="text-2xl font-extrabold tracking-tight text-madic-navy">
            Espace connecté MADIC
          </h1>
          <p className="mt-2 text-sm text-madic-grey-dark">
            Accédez aux simulateurs avancés et outils d'aide à la décision
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-6 flex rounded-2xl bg-madic-grey/15 p-1">
          {[
            { key: "login", label: "Se connecter" },
            { key: "register", label: "Créer un compte" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setMode(tab.key); setGlobalError(""); setRegErrors({}); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === tab.key
                  ? "bg-white text-madic-navy shadow-md"
                  : "text-madic-grey-dark hover:text-madic-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-[0_8px_48px_rgba(0,38,83,0.10)]">
          {globalError && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-madic-red" role="alert">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {globalError}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              <Field label="Adresse email" id="login-email">
                <Input id="login-email" type="email" placeholder="vous@exemple.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" />
              </Field>
              <Field label="Mot de passe" id="login-password">
                <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" />
              </Field>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-madic-red py-3.5 text-sm font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:bg-madic-red-dark hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>

              {/* Comptes démo */}
              <div className="mt-4 rounded-2xl bg-madic-grey/10 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-madic-grey-dark">Comptes démo</p>
                <div className="space-y-1.5">
                  <button type="button" onClick={() => { setLoginEmail("commercial@madic.com"); setLoginPassword("madic2024"); }}
                    className="w-full rounded-lg bg-madic-navy/5 px-3 py-2 text-left text-xs font-semibold text-madic-navy hover:bg-madic-navy/10 transition-colors">
                    🏢 Commercial — commercial@madic.com / madic2024
                  </button>
                  <button type="button" onClick={() => { setLoginEmail("demo.client@carrefour.fr"); setLoginPassword("client2024"); }}
                    className="w-full rounded-lg bg-madic-navy/5 px-3 py-2 text-left text-xs font-semibold text-madic-navy hover:bg-madic-navy/10 transition-colors">
                    🛒 Client — demo.client@carrefour.fr / client2024
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate className="space-y-4">
              {/* Rôle */}
              <div>
                <p className="mb-2 text-xs font-semibold text-[#16202c]">Je suis…</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRegRole(r.value)}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        regRole === r.value
                          ? "border-madic-red bg-madic-red/5"
                          : "border-madic-grey/30 hover:border-madic-grey"
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#16202c]">{r.label}</span>
                      <span className="mt-0.5 block text-[11px] text-madic-grey-dark">{r.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Nom et prénom" id="reg-name" error={regErrors.name}>
                <Input id="reg-name" placeholder="Marie Dupont" value={regName} onChange={(e) => setRegName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Société / Enseigne" id="reg-company" error={regErrors.company}>
                <Input id="reg-company" placeholder="Carrefour — Site de Lyon" value={regCompany} onChange={(e) => setRegCompany(e.target.value)} autoComplete="organization" />
              </Field>
              <Field label="Email professionnel" id="reg-email" error={regErrors.email}>
                <Input id="reg-email" type="email" placeholder="vous@societe.fr" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Mot de passe" id="reg-pwd" error={regErrors.password}>
                <Input id="reg-pwd" type="password" placeholder="6 caractères minimum" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} autoComplete="new-password" />
              </Field>
              <Field label="Confirmer le mot de passe" id="reg-pwd2" error={regErrors.password2}>
                <Input id="reg-pwd2" type="password" placeholder="••••••••" value={regPassword2} onChange={(e) => setRegPassword2(e.target.value)} autoComplete="new-password" />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-madic-red py-3.5 text-sm font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:bg-madic-red-dark hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Création du compte…" : "Créer mon compte"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-madic-grey-dark">
          Espace réservé aux professionnels.{" "}
          <a href="/#contact" className="font-semibold text-madic-navy hover:text-madic-red transition-colors">
            Contacter un commercial MADIC →
          </a>
        </p>
      </div>
    </div>
  );
}
