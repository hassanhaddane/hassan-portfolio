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
    <header className="section-heading">
      <span className="chapter-label mono">
        {number} / {label}
      </span>
      <h2 id={id}>{title}</h2>
      {children ? <p>{children}</p> : null}
    </header>
  );
}
