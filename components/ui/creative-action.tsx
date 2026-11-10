import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type CreativeActionProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "text";
  icon?: ReactNode;
};

export function CreativeAction({
  label,
  variant = "primary",
  icon = <ArrowUpRight aria-hidden="true" />,
  className = "",
  ...rest
}: CreativeActionProps) {
  return (
    <a
      {...rest}
      className={`creative-action creative-action--${variant} ${className}`.trim()}
    >
      <span className="creative-action__label">{label}</span>
      <span className="creative-action__icon" aria-hidden="true">
        {icon}
      </span>
    </a>
  );
}
