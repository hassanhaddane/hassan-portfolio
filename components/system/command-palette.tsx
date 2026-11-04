"use client";

import { ArrowDownToLine, ArrowUpRight, Pause, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { chapters } from "@/lib/experience-copy";
import { copy, profile } from "@/lib/portfolio-data";
import { useCommand, usePreferences } from "./preferences";

export function CommandPalette() {
  const { locale, motion, toggleMotion, systemReduced } = usePreferences();
  const { commandOpen, setCommandOpen } = useCommand();
  const navigate = (id: string) => {
    setCommandOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      history.pushState(history.state, "", `#${id}`);
      target?.scrollIntoView();
      target?.focus({ preventScroll: true });
    });
  };
  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      title={copy.commandTitle[locale]}
      description={
        locale === "fr"
          ? "Sections, liens et accessibilité."
          : "Sections, links and accessibility."
      }
      onCloseAutoFocus={(event) => {
        if (document.activeElement?.closest("[data-section]"))
          event.preventDefault();
      }}
    >
      <CommandInput
        placeholder={copy.commandPlaceholder[locale]}
        aria-label={copy.commandPlaceholder[locale]}
      />
      <CommandList>
        <CommandEmpty>{copy.noResults[locale]}</CommandEmpty>
        <CommandGroup heading="Navigation">
          {chapters.map((chapter) => (
            <CommandItem
              key={chapter.id}
              value={`${chapter.label.fr} ${chapter.label.en}`}
              onSelect={() => navigate(chapter.id)}
            >
              <Search aria-hidden="true" />
              {chapter.label[locale]}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          heading={locale === "fr" ? "Liens directs" : "Direct links"}
        >
          <CommandItem
            value="CV résumé download télécharger"
            onSelect={() => {
              setCommandOpen(false);
              const a = document.createElement("a");
              a.href = profile.cv;
              a.download = "CV-Hassan-Haddane.pdf";
              a.click();
            }}
          >
            <ArrowDownToLine aria-hidden="true" />
            {copy.download[locale]}
          </CommandItem>
          {[
            ["GitHub", profile.github],
            ["LinkedIn", profile.linkedin],
            ["Email", `mailto:${profile.email}`],
          ].map(([name, url]) => (
            <CommandItem
              key={name}
              value={name}
              onSelect={() => {
                setCommandOpen(false);
                if (name === "Email") location.href = url;
                else window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <ArrowUpRight aria-hidden="true" />
              {name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup
          heading={locale === "fr" ? "Accessibilité" : "Accessibility"}
        >
          <CommandItem
            value="motion animation mouvement"
            disabled={systemReduced}
            onSelect={toggleMotion}
          >
            <Pause aria-hidden="true" />
            {systemReduced
              ? copy.motionSystem[locale]
              : motion
                ? locale === "fr"
                  ? "Réduire les animations"
                  : "Reduce motion"
                : locale === "fr"
                  ? "Activer les animations"
                  : "Enable motion"}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
