import { ImageResponse } from "next/og";

export const alt = "LOWKYZ — Hassan Haddane, Full-Stack Developer in Rennes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "42px 56px",
        background: "#eeece4",
        color: "#20221f",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 22,
          borderBottom: "1px solid #999b90",
          fontSize: 15,
          letterSpacing: "2px",
        }}
      >
        <span>HASSAN HADDANE</span>
        <span>THE LIVING SIGNAL</span>
      </div>
      <svg
        width="640"
        height="480"
        viewBox="0 0 600 460"
        style={{ position: "absolute", right: -70, top: 100 }}
      >
        <ellipse
          cx="300"
          cy="230"
          rx="260"
          ry="156"
          transform="rotate(-38 300 230)"
          fill="#f25229"
        />
        <g stroke="#20221f" strokeWidth="1.2" fill="none">
          {Array.from({ length: 17 }, (_, index) => (
            <path
              key={index}
              d={Array.from({ length: 121 }, (_, step) => {
                const x = 40 + step * 4.3;
                const y =
                  230 +
                  Math.sin(step * 0.133) *
                    Math.pow(Math.sin((step / 120) * Math.PI), 1.3) *
                    (18 + index * 6);
                return `${step ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ")}
            />
          ))}
          <path d="M20 230H580M300 40V420" />
        </g>
      </svg>
      <div
        style={{
          display: "flex",
          position: "relative",
          fontSize: 176,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-15px",
          marginTop: 46,
        }}
      >
        LOWKYZ
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 18,
          fontSize: 33,
          lineHeight: 1.16,
          fontWeight: 700,
        }}
      >
        <span>La précision du code.</span>
        <span>L’instinct du son.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          marginTop: "auto",
          paddingTop: 23,
          borderTop: "1px solid #999b90",
          fontSize: 15,
        }}
      >
        <span>FULL-STACK DEVELOPER</span>
        <span>RENNES, FRANCE — LOWKYZ.DEV</span>
      </div>
    </div>,
    size,
  );
}
