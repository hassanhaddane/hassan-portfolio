"use client";

import { useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CircleUserRound,
  Code2,
  Folder,
  GraduationCap,
  Globe,
  Mail,
  Lightbulb,
  Orbit,
  Pause,
  Route,
  Terminal,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { usePreferences, useCommand } from "./preferences";
import { copy, profile } from "@/lib/portfolio-data";

export function CommandPalette() {
  const [commandOutput, setCommandOutput] = useState<"whoami" | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const {
    locale,
    setLocale,
    mode,
    setMode,
    motion,
    toggleMotion,
    systemReduced,
    theme,
    toggleTheme,
  } = usePreferences();
  const { commandOpen, setCommandOpen } = useCommand();
  const run = (action: () => void) => {
    setCommandOpen(false);
    action();
  };
  const navigate = (hash: string) =>
    run(() => {
      const target = document.getElementById(hash);
      if (target instanceof HTMLDetailsElement) target.open = true;
      window.dispatchEvent(
        new CustomEvent("lowkyz:navigate", { detail: `#${hash}` }),
      );
      requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    });
  const actions = [
    {
      label: locale === "fr" ? "À propos de Hassan" : "About Hassan",
      keywords: "about profil",
      target: "about",
      icon: CircleUserRound,
    },
    {
      label: copy.work[locale],
      keywords: "projects projets work",
      target: "projets",
      icon: Folder,
    },
    {
      label: locale === "fr" ? "Knowledge Graph" : "Knowledge Graph",
      keywords: "skills stack technologies system graph graphe",
      target: "stack",
      icon: Code2,
    },
    {
      label:
        locale === "fr" ? "Mes expériences" : "My experience",
      keywords: "experience parcours journey professionnel timeline",
      target: "experience",
      icon: Route,
    },
    {
      label: locale === "fr" ? "Ma formation" : "My education",
      keywords: "formation education EPSI foundation RNCP",
      target: "education",
      icon: GraduationCap,
    },
    {
      label: "Contact",
      keywords: "email mail contact",
      target: "contact",
      icon: Mail,
    },
  ];
  return (
    <CommandDialog
      open={commandOpen}
      onOpenAutoFocus={() => {
        returnFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      }}
      onCloseAutoFocus={(event) => {
        const target = returnFocus.current;
        returnFocus.current = null;
        if (target?.isConnected && target !== document.body) {
          event.preventDefault();
          requestAnimationFrame(() => target.focus({ preventScroll: true }));
          return;
        }
        const fallback = document.querySelector<HTMLElement>(
          "[data-command-trigger]:not([hidden]), [data-mobile-menu-trigger]",
        );
        if (fallback) {
          event.preventDefault();
          requestAnimationFrame(() => fallback.focus({ preventScroll: true }));
        }
      }}
      onOpenChange={(open) => {
        setCommandOpen(open);
        if (!open) {
          setCommandOutput(null);
          window.setTimeout(() => {
            if (document.activeElement !== document.body) return;
            const fallback = document.querySelector<HTMLElement>(
              "[data-command-trigger]:not([hidden]), [data-mobile-menu-trigger]",
            );
            fallback?.focus({ preventScroll: true });
          }, 240);
        }
      }}
      title={copy.commandTitle[locale]}
      description={
        locale === "fr"
          ? "Naviguer et personnaliser votre visite."
          : "Navigate and personalise your visit."
      }
    >
      <div className="palette-brand mono">
        LOWKYZ <span>{"//"}</span>{" "}
        {locale === "fr" ? "ACCÈS RAPIDE" : "QUICK ACCESS"}
      </div>
      <CommandInput
        placeholder={copy.commandPlaceholder[locale]}
        aria-label={copy.commandPlaceholder[locale]}
      />
      {commandOutput === "whoami" ? (
        <div className="command-output" role="status" aria-live="polite">
          <span className="mono">$ whoami</span>
          <strong>Hassan Haddane</strong>
          <span>{locale === "fr" ? "Développeur Web Full-Stack" : "Full-Stack Web Developer"}</span>
          <small>Rennes · France</small>
        </div>
      ) : null}
      <CommandList>
        <CommandEmpty>{copy.noResults[locale]}</CommandEmpty>
        <CommandGroup heading={locale === "fr" ? "Explorer" : "Explore"}>
          {actions.map((action) => (
            <CommandItem
              key={action.target}
              value={`${action.label} ${action.keywords}`}
              onSelect={() => navigate(action.target)}
            >
              <action.icon aria-hidden="true" />
              {action.label}
              <CommandShortcut>↗</CommandShortcut>
            </CommandItem>
          ))}
          <CommandItem value="GreeCheck" onSelect={() => navigate("greecheck")}>
            <Folder aria-hidden="true" />
            GreeCheck
            <CommandShortcut>
              {locale === "fr" ? "Projet principal" : "Featured project"}
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={locale === "fr" ? "Commandes système" : "System commands"}>
          <CommandItem value="whoami hassan haddane developer rennes" onSelect={() => setCommandOutput("whoami")}>
            <Terminal aria-hidden="true" />
            <span className="command-token">whoami</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem value="stack knowledge graph technologies" onSelect={() => {
            setMode("explore");
            navigate("stack");
          }}>
            <Terminal aria-hidden="true" />
            <span className="command-token">stack</span>
            <CommandShortcut>03</CommandShortcut>
          </CommandItem>
          <CommandItem value="hire contact recruter email" onSelect={() => navigate("contact")}>
            <Terminal aria-hidden="true" />
            <span className="command-token">hire</span>
            <CommandShortcut>06</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          heading={locale === "fr" ? "Liens directs" : "Direct links"}
        >
          <CommandItem
            value="CV resume download télécharger"
            onSelect={() =>
              run(() => {
                const a = document.createElement("a");
                a.href = profile.cv;
                a.download = "CV-Hassan-Haddane.pdf";
                document.body.append(a);
                a.click();
                a.remove();
              })
            }
          >
            <ArrowDownToLine aria-hidden="true" />
            {copy.download[locale]}
            <CommandShortcut>PDF</CommandShortcut>
          </CommandItem>
          {[
            ["GitHub", profile.github],
            ["LinkedIn", profile.linkedin],
          ].map(([name, url]) => (
            <CommandItem
              key={name}
              onSelect={() =>
                run(() => {
                  window.open(url, "_blank", "noopener,noreferrer");
                })
              }
            >
              <ArrowUpRight aria-hidden="true" />
              {name}
              <CommandShortcut>↗</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          heading={locale === "fr" ? "Votre expérience" : "Your experience"}
        >
          <CommandItem
            value="toggle mode recruiter explore"
            onSelect={() =>
              run(() => setMode(mode === "recruiter" ? "explore" : "recruiter"))
            }
          >
            <Orbit aria-hidden="true" />
            {locale === "fr" ? "Passer en mode" : "Switch to"}{" "}
            {mode === "recruiter" ? "Explore" : "Recruiter"}
          </CommandItem>
          <CommandItem
            value="language langue français english FR EN"
            onSelect={() => run(() => setLocale(locale === "fr" ? "en" : "fr"))}
          >
            <Globe aria-hidden="true" />
            {locale === "fr" ? "Switch to English" : "Passer en français"}
          </CommandItem>
          <CommandItem
            value="theme light dark lampe lumière"
            onSelect={() => run(toggleTheme)}
          >
            <Lightbulb aria-hidden="true" />
            {theme === "light"
              ? locale === "fr"
                ? "Éteindre la lampe"
                : "Turn the lamp off"
              : locale === "fr"
                ? "Allumer la lampe"
                : "Turn the lamp on"}
            <CommandShortcut>{theme === "light" ? "DARK" : "LIGHT"}</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="motion mouvement animations pause"
            disabled={systemReduced}
            onSelect={() => run(toggleMotion)}
          >
            <Pause aria-hidden="true" />
            {systemReduced
              ? copy.motionSystem[locale]
              : motion
                ? locale === "fr"
                  ? "Réduire les animations"
                  : "Reduce motion"
                : locale === "fr"
                  ? "Autoriser les animations"
                  : "Enable motion"}
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="palette-footer mono">
        <span>↑ ↓ {locale === "fr" ? "naviguer" : "navigate"}</span>
        <span>↵ {locale === "fr" ? "ouvrir" : "open"}</span>
        <span>esc {copy.close[locale].toLowerCase()}</span>
      </div>
    </CommandDialog>
  );
}
