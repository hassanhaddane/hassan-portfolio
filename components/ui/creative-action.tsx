import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "icon";
type Shared = {
  variant?: Variant;
  label: string;
  icon?: ReactNode;
  className?: string;
};
type LinkAction = Shared & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "aria-label">;
type ButtonAction = Shared & { href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;
export type CreativeActionProps = LinkAction | ButtonAction;

export function CreativeAction(props: CreativeActionProps) {
  const { variant = "primary", label, icon = <ArrowUpRight aria-hidden="true" />, className = "" } = props;
  const content = (
    <>
      <span className="creative-action__label" aria-hidden={variant === "icon" ? true : undefined}>
        <span>{label}</span><span aria-hidden="true">{label}</span>
      </span>
      <span className="creative-action__icon" aria-hidden="true">{icon}</span>
    </>
  );
  const classes = `creative-action creative-action--${variant} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, variant: _variant, label: _label, icon: _icon, className: _className, ...rest } = props;
    void _variant; void _label; void _icon; void _className;
    return <a {...rest} className={classes} href={href} aria-label={variant === "icon" ? label : undefined}>{content}</a>;
  }
  const { variant: _variant, label: _label, icon: _icon, className: _className, href: _href, ...rest } = props as ButtonAction;
  void _variant; void _label; void _icon; void _className; void _href;
  return <button {...rest} className={classes} aria-label={variant === "icon" ? label : undefined} type={rest.type ?? "button"}>{content}</button>;
}
