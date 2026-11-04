import { ImageResponse } from "next/og";

export const alt = "LOWKYZ — Hassan Haddane, Full-Stack Developer in Rennes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          padding: "50px 58px",
          background: "#101210",
          color: "#f3f1eb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", inset: 0 }}
        >
          <g stroke="#c4f578" fill="none" opacity="0.34">
            <path d="M760 98 C900 72 1045 160 1115 306 C1030 486 858 538 706 455 C642 352 661 174 760 98Z" />
            <path d="M812 132 C947 151 1057 230 1078 337 C1015 443 872 487 746 416 C696 317 723 192 812 132Z" />
            <path d="M736 275 C831 176 1014 177 1110 273 C1047 385 883 439 744 382 C704 349 700 309 736 275Z" />
            <path d="M678 324 C810 247 972 268 1138 393" stroke="#c4f578" />
          </g>
          <g fill="#c4f578">
            <circle cx="760" cy="98" r="4" />
            <circle cx="1115" cy="306" r="4" />
            <circle cx="706" cy="455" r="4" />
            <circle cx="812" cy="132" r="3" />
            <circle cx="1078" cy="337" r="3" />
            <circle cx="746" cy="416" r="3" />
            <circle cx="736" cy="275" r="3" />
            <circle cx="1110" cy="273" r="3" />
          </g>
          <circle cx="905" cy="314" r="8" fill="#c4f578" opacity="0.9" />
          <circle
            cx="905"
            cy="314"
            r="22"
            fill="none"
            stroke="#c4f578"
            opacity="0.18"
          />
        </svg>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "1px",
          }}
        >
          <span style={{ display: "flex", fontWeight: 700, fontSize: 27 }}>
            LOWKYZ<span style={{ color: "#c4f578" }}>/</span>
          </span>
          <span style={{ color: "#b0b5a8", fontSize: 13 }}>
            CODE × RHYTHM × CRAFT
          </span>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 68 }}
        >
          <span
            style={{ color: "#c4f578", fontSize: 17, letterSpacing: "3px" }}
          >
            FULL-STACK WEB DEVELOPER
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 14,
              fontSize: 94,
              lineHeight: 0.84,
              fontWeight: 800,
              letterSpacing: "-6px",
            }}
          >
            <span>HASSAN</span>
            <span>
              HADDANE<span style={{ color: "#c4f578" }}>.</span>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 21,
            borderTop: "1px solid #515947",
          }}
        >
          <span style={{ color: "#d7dce7", fontSize: 18 }}>
            React <span style={{ color: "#53627f" }}>•</span> Next.js{" "}
            <span style={{ color: "#53627f" }}>•</span> TypeScript{" "}
            <span style={{ color: "#53627f" }}>•</span> Python
          </span>
          <span style={{ color: "#c4f578", fontSize: 15 }}>
            RENNES — FRANCE
          </span>
        </div>
      </div>
    ),
    size,
  );
}
