# Recruiter / Explore

Both modes render the same portfolio document and factual data. A mode change updates the existing `PreferencesProvider`; it does not change the route, hash, section order or browser history.

| Surface | Recruiter | Explore |
| --- | --- | --- |
| Hero, work, journey, expertise, CV, contact | Complete and directly readable | Same information |
| Background | Static, subdued SVG/CSS field | Living field and optional Three.js on capable desktop devices |
| Motion | Short control feedback; no entrance reveal, parallax, cursor or project tilt | Shared motion runtime, reveals, parallax, hover response and project tilt |
| Creative Lab | Static preview and explicit Explore action | Interactive Canvas 2D signal and SVG/type playground |

The mode switch is in the desktop and mobile masthead, in the mobile overlay, and in the existing command palette. `aria-pressed` identifies the current choice. Switching modes preserves the active section and scroll position. The preference is stored under `lowkyz.preferences.v1` with locale, motion and theme. An early inline script applies the saved mode before the portfolio paints; Recruiter is the default. A first visit in Recruiter bypasses the cinematic intro. An explicit replay still works.

`prefers-reduced-motion` overrides the manual motion setting. A saved theme choice takes precedence; without one, the site follows `prefers-color-scheme`. Explore loads WebGL only for capable fine-pointer desktops without Save-Data, and disposes it when leaving Explore. The Lab canvas pauses outside the viewport and while the tab is hidden. Recruiter never creates a Lab 2D context or runs its draw loop.

Responsive checks: 320, 375, 390, 430, 768, 1024, 1440 and 1920 px. The mobile menu scrolls within the viewport, and the Work heading and Contact composition reflow before they clip at 1024 px.
