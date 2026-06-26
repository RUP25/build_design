"use client";

type BuildingDiagram2DProps = {
  step: number;
  className?: string;
  dark?: boolean;
  onStepChange?: (step: number) => void;
};

const HOTSPOT_POINTS = [
  { cx: 120, cy: 90 },
  { cx: 280, cy: 110 },
  { cx: 210, cy: 170 },
  { cx: 90, cy: 210 },
  { cx: 330, cy: 220 },
  { cx: 210, cy: 250 },
];

export function BuildingDiagram2D({
  step,
  className = "",
  dark = false,
  onStepChange,
}: BuildingDiagram2DProps) {
  const bg = dark ? "#080808" : "#f5f0e8";

  if (dark) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center ${className}`}
      >
        <svg
          viewBox="0 0 420 320"
          className="h-full w-full"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="420" height="320" fill={bg} />
          {HOTSPOT_POINTS.map((point, i) => {
            const active = i === step;
            return (
              <g
                key={i}
                opacity={active ? 1 : 0.35}
                className={onStepChange ? "cursor-pointer" : undefined}
                onClick={onStepChange ? () => onStepChange(i) : undefined}
                onKeyDown={
                  onStepChange
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          onStepChange(i);
                        }
                      }
                    : undefined
                }
                role={onStepChange ? "button" : undefined}
                tabIndex={onStepChange ? 0 : undefined}
              >
                <circle
                  cx={point.cx}
                  cy={point.cy}
                  r={active ? 22 : 18}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={active ? 1.5 : 1}
                  opacity={active ? 0.55 : 0.25}
                />
                <circle
                  cx={point.cx}
                  cy={point.cy}
                  r={active ? 8 : 6}
                  fill={active ? "#e06c07" : "#ffffff"}
                  opacity={active ? 1 : 0.6}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  function clamp(v: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, v));
  }

  const foundation = clamp(step * 2);
  const columns = clamp((step - 0.4) * 2);
  const walls = clamp((step - 1.2) * 1.4);
  const roof = clamp((step - 2.2) * 1.6);
  const glazing = clamp((step - 3.2) * 1.8);
  const landscape = clamp((step - 4.2) * 2);

  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 420 320"
        className="h-full max-h-[min(72vh,520px)] w-full max-w-lg"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="420" height="320" fill={bg} />
        <polygon
          points="80,220 210,260 340,220 210,180"
          fill="#8a8278"
          opacity={foundation}
        />
        {[
          [120, 195, 125, 140],
          [180, 210, 185, 135],
          [240, 210, 245, 135],
          [300, 195, 305, 140],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#1a1814"
            strokeWidth="3"
            opacity={columns}
          />
        ))}
        <polygon
          points="110,195 210,230 310,195 210,160"
          fill="#e8e0d4"
          stroke="#1a1814"
          strokeWidth="1.5"
          opacity={walls}
        />
        <polygon
          points="110,195 130,185 130,145 110,155"
          fill="#ded6ca"
          stroke="#1a1814"
          strokeWidth="1"
          opacity={walls}
        />
        <polygon
          points="290,195 310,185 310,145 290,155"
          fill="#ded6ca"
          stroke="#1a1814"
          strokeWidth="1"
          opacity={walls}
        />
        <polygon
          points="95,165 210,205 325,165 210,125"
          fill="#1a1814"
          opacity={roof}
        />
        <polygon
          points="155,185 210,205 265,185 210,165"
          fill="#b5ada3"
          opacity={glazing * 0.75}
        />
        <rect
          x="128"
          y="148"
          width="8"
          height="38"
          fill="#b5ada3"
          opacity={glazing * 0.65}
          transform="skewY(-18)"
        />
        <rect
          x="198"
          y="178"
          width="24"
          height="32"
          fill="#e06c07"
          opacity={landscape}
          transform="skewY(-18)"
        />
        <circle cx="90" cy="248" r="14" fill="#5a7a52" opacity={landscape} />
        <circle cx="330" cy="252" r="11" fill="#5a7a52" opacity={landscape} />
        <g opacity="0.12" stroke="#8a8278" strokeWidth="0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h-${i}`} x1="40" y1={40 + i * 30} x2="380" y2={40 + i * 30} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v-${i}`} x1={40 + i * 30} y1="40" x2={40 + i * 30} y2="280" />
          ))}
        </g>
      </svg>
    </div>
  );
}
