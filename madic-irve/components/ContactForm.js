"use client";
import { useState } from "react";

const initial = {
  societe: "", siren: "", nom: "", prenom: "", email: "", telephone: "",
  codePostal: "", tailleParking: "", tailleFlotte: "", typeAcces: "", message: "", rgpd: false,
};

const accessOptions = ["Privé (collaborateurs)", "Public / ouvert", "Flotte interne", "Mixte"];

function validate(v) {
  const e = {};
  if (!v.societe.trim()) e.societe = "Indiquez le nom de votre société.";
  if (v.siren && !/^\d{9}$/.test(v.siren.replace(/\s/g, ""))) e.siren = "Le SIREN doit comporter 9 chiffres.";
  if (!v.nom.trim()) e.nom = "Champ requis.";
  if (!v.prenom.trim()) e.prenom = "Champ requis.";
  if (!v.email.trim()) e.email = "L'email est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email invalide.";
  if (!v.telephone.trim()) e.telephone = "Le téléphone est requis.";
  else if (!/^[\d\s+().-]{8,}$/.test(v.telephone)) e.telephone = "Numéro invalide.";
  if (v.codePostal && !/^\d{5}$/.test(v.codePostal)) e.codePostal = "Code postal à 5 chiffres.";
  if (!v.rgpd) e.rgpd = "Vous devez accepter la politique de confidentialité.";
  return e;
}

function Field({ label, name, value, onChange, error, type = "text", required, full, ...rest }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-[#16202c]">
        {label} {required && <span className="text-madic-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#16202c] outline-none transition-colors placeholder:text-madic-grey ${
          error ? "border-madic-red focus:border-madic-red" : "border-madic-grey/40 focus:border-madic-red"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs font-medium text-madic-red" role="alert">{error}</p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setV((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = document.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    setStatus("submitting");
    // Simulation d'envoi, à brancher sur votre endpoint / EmailJS / API
    setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <div className="reveal rounded-2xl border border-madic-grey/25 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2bd07a]/15">
          <svg className="h-8 w-8 text-[#1fae64]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-[#16202c]">Demande envoyée !</h3>
        <p className="mx-auto mt-3 max-w-md text-madic-grey-dark">
          Merci {v.prenom}. Un expert MADIC vous recontacte sous 48 h ouvrées pour étudier
          votre projet de recharge électrique.
        </p>
        <button
          onClick={() => { setV(initial); setStatus("idle"); }}
          className="mt-6 text-sm font-bold text-madic-red link-underline"
        >
          Envoyer une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="reveal rounded-2xl border border-madic-grey/25 bg-white p-6 shadow-xl md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Société" name="societe" value={v.societe} onChange={onChange} error={errors.societe} required full />
        <Field label="SIREN" name="siren" value={v.siren} onChange={onChange} error={errors.siren} inputMode="numeric" placeholder="9 chiffres" />
        <Field label="Code postal" name="codePostal" value={v.codePostal} onChange={onChange} error={errors.codePostal} inputMode="numeric" placeholder="44400" />
        <Field label="Prénom" name="prenom" value={v.prenom} onChange={onChange} error={errors.prenom} required />
        <Field label="Nom" name="nom" value={v.nom} onChange={onChange} error={errors.nom} required />
        <Field label="Email" name="email" type="email" value={v.email} onChange={onChange} error={errors.email} required />
        <Field label="Téléphone" name="telephone" type="tel" value={v.telephone} onChange={onChange} error={errors.telephone} required />
        <Field label="Taille du parking (places)" name="tailleParking" value={v.tailleParking} onChange={onChange} error={errors.tailleParking} inputMode="numeric" placeholder="ex. 80" />
        <Field label="Taille de flotte (véhicules)" name="tailleFlotte" value={v.tailleFlotte} onChange={onChange} error={errors.tailleFlotte} inputMode="numeric" placeholder="ex. 25" />

        <div className="sm:col-span-2">
          <label htmlFor="typeAcces" className="mb-1.5 block text-sm font-semibold text-[#16202c]">Type d'accès</label>
          <select
            id="typeAcces" name="typeAcces" value={v.typeAcces} onChange={onChange}
            className="w-full rounded-lg border border-madic-grey/40 bg-white px-3.5 py-2.5 text-sm text-[#16202c] outline-none focus:border-madic-red"
          >
            <option value="">Sélectionnez…</option>
            {accessOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-[#16202c]">Message</label>
          <textarea
            id="message" name="message" value={v.message} onChange={onChange} rows={4}
            placeholder="Décrivez votre projet, vos contraintes, votre échéance…"
            className="w-full resize-y rounded-lg border border-madic-grey/40 bg-white px-3.5 py-2.5 text-sm text-[#16202c] outline-none placeholder:text-madic-grey focus:border-madic-red"
          />
        </div>

        {/* RGPD */}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-madic-grey-dark">
            <input
              type="checkbox" name="rgpd" checked={v.rgpd} onChange={onChange}
              aria-invalid={!!errors.rgpd} aria-describedby={errors.rgpd ? "rgpd-error" : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 accent-madic-red"
            />
            <span>
              J'accepte que mes données soient utilisées pour être recontacté(e) au sujet de ma demande,
              conformément à la <a href="#rgpd" className="font-semibold text-madic-red link-underline">politique de confidentialité</a> de MADIC. <span className="text-madic-red">*</span>
            </span>
          </label>
          {errors.rgpd && <p id="rgpd-error" className="mt-1 text-xs font-medium text-madic-red" role="alert">{errors.rgpd}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-madic-red px-7 py-4 text-base font-bold text-white shadow-lg shadow-madic-red/25 transition-all hover:scale-[1.01] hover:bg-madic-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" /><path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
            Envoi en cours…
          </>
        ) : (
          <>
            Envoyer ma demande
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-madic-grey-dark">* Champs obligatoires. Réponse sous 48 h ouvrées.</p>
    </form>
  );
}
