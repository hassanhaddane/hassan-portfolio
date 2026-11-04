import { Wordmark } from "@/components/ui/wordmark";

export function LogoReveal() {
  return (
    <div className="intro-logo">
      <div className="intro-score" aria-hidden="true">
        {Array.from({ length: 41 }, (_, i) => (
          <i
            key={i}
            style={{
              height: `${(12 + Math.sin((i / 40) * Math.PI) * (50 + Math.cos(i * 0.65) * 30)).toFixed(2)}%`,
            }}
          />
        ))}
      </div>
      <Wordmark />
      <p className="mono">CODE × RHYTHM × CRAFT</p>
    </div>
  );
}
