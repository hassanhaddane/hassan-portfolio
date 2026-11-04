import { Fragment, type CSSProperties, type ReactNode } from "react";

export function SectionHeading({
  number,
  label,
  title,
  id,
  children,
}: {
  number: string;
  label: string;
  title: string;
  id: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-heading reveal">
      <div className="section-index mono">
        <span>{number}</span> / {label}
      </div>
      <h2 id={id} aria-label={title}>
        {title.split(" ").map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="type-mask" aria-hidden="true">
              <span
                className="type-ink"
                style={{ "--word-index": index } as CSSProperties}
              >
                {word}
              </span>
            </span>{" "}
          </Fragment>
        ))}
      </h2>
      {children ? <p>{children}</p> : null}
    </header>
  );
}
