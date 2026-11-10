import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const slugs = ["greecheck", "808bloom", "tech-express", "ceo19"];
const chapters = [
  "profil",
  "projets",
  "stack",
  "experience",
  "about",
  "contact",
];
const widths = [320, 390, 768, 1024, 1440, 1920];
const cvHash =
  "bba20e7d3fd52dcd072bad9f5ab79b7d973799b21bcebedaa8945ee5f17bfbfd";

function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("favicon"))
      errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    await page.locator("h1,h2,h3").evaluateAll((elements) =>
      elements
        .filter((element) => {
          const r = element.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        })
        .map((element) => element.textContent),
    ),
  ).toEqual([]);
}

for (const locale of ["fr", "en"]) {
  for (const width of widths) {
    test(`${locale}: six chapters at ${width}px`, async ({ page }, info) => {
      const errors = monitor(page);
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/" + locale);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toContainText("LOWKYZ");
      await expect(page.locator("[data-section]")).toHaveCount(6);
      expect(
        await page
          .locator("[data-section]")
          .evaluateAll((elements) => elements.map((e) => e.id)),
      ).toEqual(chapters);
      await expect(
        page.locator('.hero-actions a[href="#projets"]'),
      ).toBeInViewport();
      await expect(page.locator(".living-signal")).toBeVisible();
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath("hero.jpg"),
        type: "jpeg",
        quality: 88,
      });
      for (const id of chapters.slice(1)) {
        await page.locator("#" + id).scrollIntoViewIfNeeded();
        await noOverflow(page);
      }
      for (const image of await page
        .locator(".work-image-stage img, .about-portrait img")
        .all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate(
            (element: HTMLImageElement) => element.naturalWidth,
          ),
        ).toBeGreaterThan(0);
      }
      expect(errors).toEqual([]);
    });
  }
}

test("desktop anchors, active signal, history, language and keyboard commands", async ({
  page,
}) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr#profil");
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  for (const [label, id] of [
    ["Projets", "projets"],
    ["Engineering", "stack"],
    ["Parcours", "experience"],
    ["À propos", "about"],
    ["Contact", "contact"],
  ]) {
    const link = nav.getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
    await expect(link).toHaveAttribute("aria-current", "location");
    await expect(
      page.locator(`.living-signal a[href="#${id}"]`),
    ).toHaveAttribute("aria-current", "location");
  }
  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport({ ratio: 0.5 });
  await page.goForward();
  await expect(page).toHaveURL(/#contact$/);
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\/en#contact$/);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Contact", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("Work");
  await page.getByRole("option", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#projets$/);
  await expect(page.locator("#projets")).toBeFocused();
  await page.locator('.brand[href="#profil"]').first().click();
  await expect(page).toHaveURL(/#profil$/);
  expect(errors).toEqual([]);
});

test("mobile menu, keyboard, clipboard, original CV and persistent motion setting", async ({
  page,
  context,
}) => {
  const errors = monitor(page);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await menu.click();
  await expect(page.getByRole("dialog", { name: "LOWKYZ" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "06 Contact" })
    .click();
  await expect(page.locator("#contact")).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText("Email copied");
  const download = page.waitForEvent("download");
  await page
    .getByRole("navigation", { name: "Professional links" })
    .getByRole("link", { name: "Download my résumé" })
    .click();
  const pdf = await download;
  expect(pdf.suggestedFilename().toLowerCase()).toBe("cv-hassan-haddane.pdf");
  expect(
    createHash("sha256")
      .update(await readFile((await pdf.path())!))
      .digest("hex"),
  ).toBe(cvHash);
  await page
    .getByRole("button", { name: "Reduce motion", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page
    .getByRole("button", { name: "Enable motion", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Reduced motion (system)", exact: true }),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});

for (const locale of ["fr", "en"]) {
  test(`${locale}: all case studies, responsive media, links and SEO`, async ({
    page,
  }) => {
    const errors = monitor(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      for (const slug of slugs) {
        const response = await page.goto(`/${locale}/work/${slug}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator(".case-chapter")).toHaveCount(9);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          `https://www.lowkyz.dev/${locale}/work/${slug}`,
        );
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          "content",
          /projects/,
        );
        await noOverflow(page);
        for (const image of await page.locator(".case-media img").all()) {
          await image.scrollIntoViewIfNeeded();
          await expect(image).toHaveJSProperty("complete", true);
          expect(
            await image.evaluate(
              (element: HTMLImageElement) => element.naturalWidth,
            ),
          ).toBeGreaterThan(0);
        }
        const hrefs = await page
          .locator(".case-links a")
          .evaluateAll((anchors) =>
            anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
          );
        expect(hrefs.length).toBeGreaterThan(0);
        expect(hrefs.every((href) => href.startsWith("https://"))).toBeTruthy();
      }
    }
    await page
      .getByRole("link", { name: locale === "fr" ? "EN" : "FR", exact: true })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      locale === "fr" ? "en" : "fr",
    );
    expect(errors).toEqual([]);
  });
}

test("project navigation, browser back and expanded professional contributions", async ({
  page,
}) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr#projets");
  await page.locator("#greecheck .work-image-link").click();
  await expect(page).toHaveURL(/\/fr\/work\/greecheck$/);
  await page
    .getByRole("navigation", { name: "Projet suivant" })
    .getByRole("link", { name: /808BLOOM/ })
    .click();
  await expect(page).toHaveURL(/\/fr\/work\/808bloom$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/fr\/work\/greecheck$/);
  await page
    .getByRole("navigation", { name: "Navigation de l’étude de cas" })
    .getByRole("link", { name: /Retour aux projets/ })
    .click();
  await expect(page).toHaveURL(/\/fr#greecheck$/);
  await expect(page.locator("#greecheck")).toBeInViewport();
  await page.locator("#iaudiogram summary").click();
  await expect(page.locator("#iaudiogram details")).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
});

test("native content and navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("/en");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-section]")).toHaveCount(6);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#projets$/);
  await page.locator("#greecheck .work-image-link").click();
  await expect(page).toHaveURL(/\/en\/work\/greecheck$/);
  await expect(page.locator(".case-chapter")).toHaveCount(9);
  await context.close();
});

test("metadata, sitemap, real outgoing links and unknown routes", async ({
  request,
  page,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  for (const locale of ["fr", "en"])
    for (const slug of slugs)
      expect(await sitemap.text()).toContain(`/${locale}/work/${slug}`);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
  expect((await request.get("/")).url()).toMatch(/\/fr$/);
  for (const path of [
    "/fr/work/not-a-project",
    "/en/work/not-a-project",
    "/unknown-route",
  ])
    expect((await request.get(path)).status()).toBe(404);
  await page.goto("/fr");
  const hrefs = await page
    .locator('a[target="_blank"]')
    .evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
    );
  for (const href of [
    "https://github.com/hassanhaddane/GreeCheck",
    "https://github.com/hassanhaddane/ceo19",
    "https://gree-check.vercel.app/fr",
    "https://808bloom.vercel.app/fr",
    "https://ceo19.vercel.app/en",
    "https://github.com/hassanhaddane",
    "https://www.linkedin.com/in/hassanhaddane/",
  ])
    expect(hrefs).toContain(href);
});

test("clipboard refusal retains a usable email link", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Permission denied")),
    });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en#contact");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Could not copy. Use the email link above.",
  );
  await expect(
    page.getByRole("link", { name: "hassanhaddane33s@gmail.com" }),
  ).toHaveAttribute("href", "mailto:hassanhaddane33s@gmail.com");
});
