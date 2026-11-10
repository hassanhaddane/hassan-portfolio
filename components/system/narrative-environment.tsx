import { SignalArtwork } from "@/components/portfolio/signal-artwork";
import { sceneColors, caseSceneColors } from "@/lib/scroll-narrative";

/** Decorative layers remain separate from semantic, anchored document content. */
export function NarrativeEnvironment({
  caseStudy = false,
}: {
  caseStudy?: boolean;
}) {
  return (
    <div className="narrative-environment" aria-hidden="true">
      {(caseStudy ? caseSceneColors : sceneColors).map((color, index) => (
        <div
          key={index}
          className="narrative-wash"
          data-scene-wash
          style={{ backgroundColor: `rgb(${color.join(",")})` }}
        />
      ))}
      <div className="narrative-word" data-narrative-word>
        LOWKYZ
      </div>
      <div className="narrative-word" data-narrative-next-word>
        WORK
      </div>
      <div className="narrative-webgl" data-universe-host />
      <div className="signal-vessel" data-signal-vessel>
        <div className="signal-orbit">
          <SignalArtwork />
        </div>
      </div>
      <svg
        className="narrative-thread"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          data-narrative-thread
          fill="none"
          stroke="currentColor"
          strokeWidth=".7"
        />
      </svg>
    </div>
  );
}
