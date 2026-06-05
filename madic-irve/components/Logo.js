import Image from "next/image";
import quadri from "@/public/logos/madic-group-quadri.png";
import blanc from "@/public/logos/madic-group-blanc.png";

/**
 * Logo officiel MADIC group.
 * variant: "white" (fond sombre) | "color"/"red" (fond clair => version quadri).
 * La hauteur suit la taille de police du conteneur (height: 1em).
 */
export default function Logo({ variant = "color", className = "" }) {
  const isWhite = variant === "white";
  const src = isWhite ? blanc : quadri;
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="MADIC group">
      <Image
        src={src}
        alt="MADIC group"
        priority
        style={{ height: "1em", width: "auto", minHeight: 30 }}
        sizes="(max-width: 768px) 140px, 180px"
      />
    </span>
  );
}
