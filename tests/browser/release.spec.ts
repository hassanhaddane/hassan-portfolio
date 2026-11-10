import { mkdir, writeFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const root = "[data-portfolio-root]";
for (const locale of ["fr", "en"] as const) {
  for (const width of [390, 768, 1440, 1920]) {
    test(`${locale} ${width}: intro, navigation, case and motion controls`, async ({
      page,
    }, info) => {
      const fr = locale === "fr";
      const issues: string[] = [];
      page.on("pageerror", (error) => issues.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") issues.push(message.text());
      });
      await page.setViewportSize({ width, height: width < 1000 ? 844 : 1000 });
      let releaseFonts: () => void = () => {};
      const fontGate = new Promise<void>((resolve) => {
        releaseFonts = resolve;
      });
      await page.route("**/*.woff2", async (route) => {
        await fontGate;
        await route.continue();
      });
      await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" });
      const intro = page.locator(".signal-intro");
      const heroAction = page.locator('.hero-actions a[href="#projets"]');
      await expect(intro).toHaveAttribute("data-intro-phase", "loading");
      await expect(heroAction).toBeInViewport();
      const titleRight = await page
        .locator(".hero h1 span")
        .evaluate((element) => element.getBoundingClientRect().right);
      expect(titleRight).toBeLessThanOrEqual(width + 1);
      const progress = intro.locator('[role="progressbar"]');
      await expect
        .poll(async () => Number(await progress.getAttribute("aria-valuenow")))
        .toBeGreaterThan(0);
      expect(Number(await progress.getAttribute("aria-valuenow"))).toBeLessThan(
        100,
      );
      // Capture the actual loading frame: Playwright's normal screenshot waits for fonts.
      const chrome = await page.context().newCDPSession(page);
      const image = await chrome.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 82,
      });
      await mkdir(info.outputDir, { recursive: true });
      await writeFile(
        info.outputPath("intro.jpg"),
        Buffer.from(image.data, "base64"),
      );
      await chrome.detach();
      await intro
        .getByRole("button", {
          name: fr ? "Passer l’introduction" : "Skip the intro",
        })
        .click();
      await expect(intro).toHaveAttribute("data-intro-phase", "closed");
      const replay = intro.getByRole("button", {
        name: fr ? "Rejouer l’introduction" : "Replay the intro",
      });
      await expect(replay).toBeFocused();
      releaseFonts();
      await page.evaluate(() => document.fonts.ready);
      await page.keyboard.press("Enter");
      await expect(intro).toHaveAttribute("data-intro-phase", "release");
      await expect(progress).toHaveAttribute("aria-valuenow", "100");
      await expect(intro).toHaveAttribute("data-intro-phase", "closed");
      await page.screenshot({
        path: info.outputPath("hero.jpg"),
        type: "jpeg",
        quality: 82,
      });

      if (width < 1000) {
        const trigger = page.getByRole("button", {
          name: fr ? "Ouvrir le menu" : "Open menu",
          exact: true,
        });
        await trigger.click();
        const menu = page.getByRole("dialog", { name: "LOWKYZ" });
        await expect(menu).toBeVisible();
        await menu.evaluate((element) =>
          Promise.all(
            element
              .getAnimations({ subtree: true })
              .map((animation) => animation.finished.catch(() => undefined)),
          ),
        );
        await page.screenshot({
          path: info.outputPath("menu.jpg"),
          type: "jpeg",
          quality: 82,
        });
        await page.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
        await trigger.click();
        await menu
          .getByRole("link", { name: fr ? "02 Projets" : "02 Work" })
          .click();
        await expect(page.locator("#projets")).toBeFocused();
      } else {
        await heroAction.hover({ position: { x: 14, y: 12 } });
        await expect(page.locator(".context-cursor")).toBeVisible();
        await expect(page.locator("[data-cursor-caption]")).toHaveText(
          fr ? "ALLER" : "GO",
        );
        await expect
          .poll(() =>
            heroAction.evaluate((e) => e.style.getPropertyValue("--magnet-x")),
          )
          .not.toBe("");
        await heroAction.click();
      }
      await expect(page).toHaveURL(/#projets$/);
      await page.locator('.gallery-index a[href="#tech-express"]').click();
      await expect(page.locator(root)).toHaveAttribute(
        "data-signal-project",
        "tech-express",
      );
      await page.locator("#tech-express .work-image-link").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/work/tech-express$`));
      await expect(page.locator("h1")).toHaveText("Tech Express");
      await expect
        .poll(() =>
          page.evaluate(() =>
            document
              .getAnimations()
              .some(
                (animation) =>
                  animation.effect instanceof KeyframeEffect &&
                  animation.effect.pseudoElement?.startsWith(
                    "::view-transition",
                  ) &&
                  animation.playState === "running",
              ),
          ),
        )
        .toBe(false);
      await page.screenshot({
        path: info.outputPath("case.jpg"),
        type: "jpeg",
        quality: 82,
      });
      await page.locator(".case-topbar a[href$='#tech-express']").click();
      await expect(page).toHaveURL(/#tech-express$/);
      await page.locator('.living-signal a[href="#contact"]').click();
      const email = page.locator('a[href^="mailto:"]').first();
      await expect(email).toBeVisible();
      const cv = page.locator(".contact-links a[download]");
      await expect(cv).toHaveAttribute("href", "/cv-hassan-haddane.pdf");
      expect(
        (await page.request.get("/cv-hassan-haddane.pdf")).ok(),
      ).toBeTruthy();
      await page.locator(".motion-trigger").click();
      await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
      await expect(page.locator("canvas")).toHaveCount(0);
      await expect(page.locator(".context-cursor")).not.toBeVisible();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator(".motion-trigger")).toBeDisabled();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      expect(issues).toEqual([]);
    });
  }
}
