import { Wordmark } from "@/components/ui/wordmark";
import { RhythmScore } from "@/components/ui/frequency-score";

export function LogoReveal() {
  return (
    <div className="intro-stage">
      <div className="intro-signal">
        <RhythmScore />
      </div>
      <div className="intro-identity">
        <Wordmark />
        <p className="mono">ENTER THE FREQUENCY</p>
      </div>
      <span className="intro-register mono" aria-hidden="true">
        CODE × RHYTHM × CRAFT
      </span>
    </div>
  );
}
