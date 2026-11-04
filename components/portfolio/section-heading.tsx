import type { ReactNode } from "react";

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
      <h2 id={id}>{title}</h2>
      {children ? <p>{children}</p> : null}
    </header>
  );
}
