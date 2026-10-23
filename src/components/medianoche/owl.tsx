import type { Pose } from "@/lib/confession-config";

/**
 * Sirius, el búho captor, estilo papel recortado: siluetas planas + sombra suave.
 * Poses: normal · feliz · sorprendido · sinCapa (final).
 */
export function Owl({ pose = "normal", className = "" }: { pose?: Pose; className?: string }) {
  const cape = pose !== "sinCapa";
  const happy = pose === "feliz" || pose === "sinCapa";
  const wow = pose === "sorprendido";
  return (
    <svg
      viewBox="0 0 200 220"
      className={["drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)]", className].join(" ")}
      role="img"
      aria-label={`Sirius, el búho, ${pose === "sinCapa" ? "sin capa" : pose}`}
    >
      {cape && (
        <path d="M40 92 Q100 70 160 92 L182 208 Q100 192 18 208 Z" fill="#7a1622" />
      )}
      {cape && <path d="M40 92 Q100 70 160 92 L150 112 Q100 96 50 112 Z" fill="#9b1c2c" />}
      {/* orejas */}
      <path d={wow ? "M58 52 L50 6 L84 40 Z" : "M58 54 L54 16 L86 42 Z"} fill="#6e4429" />
      <path d={wow ? "M142 52 L150 6 L116 40 Z" : "M142 54 L146 16 L114 42 Z"} fill="#6e4429" />
      {/* cuerpo */}
      <ellipse cx="100" cy="128" rx="62" ry="78" fill="#8a5a3b" />
      <ellipse cx="100" cy="150" rx="40" ry="50" fill="#d7a874" />
      {[0, 1, 2].map((r) =>
        [-1, 0, 1].map((c) => (
          <path
            key={`${r}${c}`}
            d={`M${92 + c * 16} ${136 + r * 16} q8 8 16 0`}
            fill="none"
            stroke="#b98250"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )),
      )}
      {/* alas */}
      <path
        d={happy ? "M40 110 Q14 128 30 170 Q44 150 52 132 Z" : "M42 116 Q30 150 44 186 Q54 160 56 132 Z"}
        fill="#6e4429"
      />
      <path
        d={happy ? "M160 110 Q186 128 170 170 Q156 150 148 132 Z" : "M158 116 Q170 150 156 186 Q146 160 144 132 Z"}
        fill="#6e4429"
      />
      {/* cara */}
      <path d="M48 78 Q100 40 152 78 Q148 116 100 112 Q52 116 48 78 Z" fill="#c99566" />
      {happy ? (
        <>
          <path d="M60 82 q14 -16 28 0" fill="none" stroke="#2b1d14" strokeWidth="6" strokeLinecap="round" />
          <path d="M112 82 q14 -16 28 0" fill="none" stroke="#2b1d14" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="62" cy="98" rx="9" ry="5" fill="#e8743b" opacity="0.55" />
          <ellipse cx="138" cy="98" rx="9" ry="5" fill="#e8743b" opacity="0.55" />
        </>
      ) : (
        <>
          <circle cx="74" cy="80" r={wow ? 20 : 17} fill="#fff4dc" />
          <circle cx="126" cy="80" r={wow ? 20 : 17} fill="#fff4dc" />
          <circle cx="76" cy="82" r={wow ? 7 : 9} fill="#2b1d14" />
          <circle cx="124" cy="82" r={wow ? 7 : 9} fill="#2b1d14" />
          <circle cx="79" cy="78" r="3" fill="#fff" />
          <circle cx="127" cy="78" r="3" fill="#fff" />
        </>
      )}
      {wow ? (
        <ellipse cx="100" cy="104" rx="6" ry="8" fill="#f2a65a" />
      ) : (
        <path d="M92 96 L108 96 L100 110 Z" fill="#f2a65a" />
      )}
      {/* patas */}
      <path d="M78 202 l-6 12 M84 204 l0 12 M90 202 l6 12" stroke="#f2a65a" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 202 l-6 12 M116 204 l0 12 M122 202 l6 12" stroke="#f2a65a" strokeWidth="5" strokeLinecap="round" />
      {cape && <circle cx="100" cy="112" r="7" fill="#f2a65a" stroke="#7a1622" strokeWidth="2" />}
    </svg>
  );
}
