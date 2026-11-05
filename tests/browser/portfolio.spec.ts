import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const slugs = ["greecheck", "808bloom", "tech-express", "ceo19"];
const widths = [320, 390, 768, 1024, 1440, 1920];
const cvHash =
  "bba20e7d3fd52dcd072bad9f5ab79b7d973799b21bcebedaa8945ee5f17bfbfd";
const production = (process.env.PLAYWRIGHT_BASE_URL || "").startsWith(
  "https://",
);
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
async function settled(page: Page) {
  await expect(page.locator(".cinematic-intro")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  const clipped = await page.locator("h1,h2,h3").evaluateAll((elements) =>
    elements
      .filter((element) => {
        const r = element.getBoundingClientRect();
        return (
          r.width > 0 &&
          (r.left < -1 || r.right > document.documentElement.clientWidth + 1)
        );
      })
      .map((element) => element.textContent),
  );
  expect(clipped).toEqual([]);
}

for (const locale of ["fr", "en"]) {
  for (const width of widths) {
    test(`${locale}: complete responsive composition at ${width}px`, async ({
      page,
    }, info) => {
      const errors = monitor(page);
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/" + locale);
      await settled(page);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toContainText("FULL-STACK");
      await expect(page.locator("[data-section]")).toHaveCount(6);
      await noOverflow(page);
      await page.screenshot({
        path: info.outputPath("hero.jpg"),
        type: "jpeg",
        quality: 88,
      });
      for (const id of ["projets", "experience", "stack", "about", "contact"]) {
        await page.locator("#" + id).scrollIntoViewIfNeeded();
        await noOverflow(page);
      }
      for (const image of await page.locator(".work-image-link > img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate(
            (element: HTMLImageElement) => element.naturalWidth,
          ),
        ).toBeGreaterThan(0);
      }
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: info.outputPath("contact.jpg"),
        type: "jpeg",
        quality: 88,
      });
      expect(errors).toEqual([]);
    });
  }
}

test("signature, automatic handoff, skip, replay and direct anchors", async ({
  page,
}, info) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const started = Date.now();
  await page.goto("/fr");
  await expect(page.locator(".cinematic-intro")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Passer l’intro" }),
  ).toBeEnabled();
  await expect(page.locator(".cinematic-intro")).toHaveAttribute(
    "data-phase",
    "identity",
  );
  await page.screenshot({
    path: info.outputPath("signature.jpg"),
    type: "jpeg",
    quality: 90,
  });
  await settled(page);
  expect(Date.now() - started).toBeLessThan(8000);
  await expect(page.locator("[data-site-content]")).not.toHaveAttribute(
    "inert",
  );
  await page
    .getByRole("button", { name: "Rejouer l’intro", exact: true })
    .click();
  await expect(page.locator(".cinematic-intro")).toBeVisible();
  await page.getByRole("button", { name: "Passer l’intro" }).click();
  await expect(page.locator(".cinematic-intro")).toHaveCount(0);
  await expect(page.locator("#profil")).toBeFocused();
  await page.reload();
  await expect(page.locator(".cinematic-intro")).toHaveCount(0);
  await page.goto("/en#contact");
  await expect(page.locator(".cinematic-intro")).toHaveCount(0);
  await expect(page.locator("#contact")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("desktop anchors, active navigation, history, language and commands", async ({
  page,
}) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  // Keep history assertions independent of native smooth scrolling.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr#profil");
  for (const [label, id] of [
    ["Projets", "projets"],
    ["Expérience", "experience"],
    ["Expertise", "stack"],
    ["À propos", "about"],
    ["Contact", "contact"],
  ]) {
    const link = page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
    await expect(link).toHaveAttribute("aria-current", "location");
  }
  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport({ ratio: 0.5 });
  await page.goForward();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
  await page
    .getByRole("link", { name: /Switch to English/ })
    .and(page.locator('a[href="/en#contact"]'))
    .click();
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
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/#profil$/);
  expect(errors).toEqual([]);
});

test("mobile menu, keyboard, contact, clipboard, PDF and reduced motion", async ({
  page,
  context,
}) => {
  const errors = monitor(page);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() =>
    sessionStorage.setItem("lowkyz.cinematic.v2", "seen"),
  );
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
  await page.getByRole("link", { name: "06 Contact" }).click();
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
      .update(await readFile(await pdf.path()))
      .digest("hex"),
  ).toBe(cvHash);
  await page
    .getByRole("button", { name: "Reduce motion", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(
    page.getByRole("button", { name: "Replay intro", exact: true }),
  ).toBeDisabled();
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
  test(`${locale}: four case studies, links, images and SEO`, async ({
    page,
  }) => {
    const errors = monitor(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
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
      const links = await page
        .locator(".case-links a")
        .evaluateAll((anchors) =>
          anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
        );
      expect(links.length).toBeGreaterThan(0);
      expect(links.every((link) => link.startsWith("https://"))).toBeTruthy();
      const language = locale === "fr" ? "EN" : "FR";
      await page.getByRole("link", { name: language, exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale === "fr" ? "en" : "fr",
      );
    }
    expect(errors).toEqual([]);
  });
}

test("hover is useful but optional, section details and case/back navigation", async ({
  page,
}, info) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/fr#projets");
  const image = page.locator("#greecheck .work-image-link");
  await image.hover();
  await expect(image).toHaveAttribute("data-pointer", "true");
  await expect(image.locator(".work-preview-note")).toBeVisible();
  await page.screenshot({
    path: info.outputPath("project-hover.jpg"),
    type: "jpeg",
    quality: 90,
  });
  await image.click();
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
  await expect(page.locator(".cinematic-intro")).toHaveCount(0);
  await page.locator("#iaudiogram summary").click();
  await expect(page.locator("#iaudiogram details")).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
});

test("GPU absence, unavailable images and JavaScript absence never block content", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      id: string,
      ...args: unknown[]
    ) {
      if (id.includes("webgl")) return null;
      return original.apply(this, [id, ...args] as never);
    } as typeof original;
  });
  const page = await context.newPage();
  await page.route("**/_next/image?**", (route) => route.abort());
  await page.goto("/fr");
  await settled(page);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-site-content]")).not.toHaveAttribute(
    "inert",
  );
  await expect(page.locator(".organism-field")).toHaveAttribute(
    "data-renderer",
    "vector",
  );
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto("/en");
  await expect(staticPage.locator("h1")).toBeVisible();
  await expect(staticPage.locator(".cinematic-intro")).not.toBeVisible();
  await staticPage.getByRole("link", { name: "Work", exact: true }).click();
  await expect(staticPage).toHaveURL(/#projets$/);
  await noJs.close();
});

test("metadata, sitemap, PDF, external hrefs and unknown routes", async ({
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
  for (const path of [
    "/fr/work/not-a-project",
    "/en/work/not-a-project",
    "/unknown-route",
  ])
    expect((await request.get(path)).status()).toBe(404);
  await page.goto("/fr#projets");
  const hrefs = await page
    .locator('a[target="_blank"]')
    .evaluateAll((anchors) => [
      ...new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href)),
    ]);
  expect(hrefs).toContain("https://github.com/hassanhaddane/GreeCheck");
  expect(hrefs).toContain("https://github.com/hassanhaddane/ceo19");
  expect(hrefs).toContain("https://gree-check.vercel.app/fr");
  expect(hrefs).toContain("https://808bloom.vercel.app/fr");
  expect(hrefs).toContain("https://ceo19.vercel.app/en");
  expect(hrefs.every((href) => href.startsWith("https://"))).toBeTruthy();
  if (!production) expect((await request.get("/fr")).status()).toBe(200);
});

test("WebGL renders only visible scenes and releases resources on reduced motion", async ({
  page,
  context,
}) => {
  const errors = monitor(page);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/fr#profil");
  const field = page.locator(".organism-field");
  const canvas = field.locator("canvas");
  await expect(field).toHaveAttribute("data-renderer", "webgl");
  await expect(canvas).toHaveAttribute("data-running", "true");
  await page
    .getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(canvas).toHaveAttribute("data-running", "false");
  await page
    .getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: "Expertise", exact: true })
    .click();
  await expect(canvas).toHaveAttribute("data-running", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toHaveAttribute("data-renderer", "vector");
  await expect(canvas).toHaveAttribute("data-running", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect
    .poll(() =>
      canvas.evaluate((element: HTMLCanvasElement) =>
        element.getContext("webgl2")?.isContextLost(),
      ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});

test("clipboard refusal has a readable fallback and project links open the real destinations", async ({
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
  await page.goto("/fr#projets");
  const popupPromise = page.waitForEvent("popup");
  await page
    .locator('#greecheck a[href="https://gree-check.vercel.app/fr"]')
    .click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL("https://gree-check.vercel.app/fr");
  await popup.close();
});

test("case-study layouts at all six widths, with editorial control captures", async ({
  page,
}, info) => {
  const errors = monitor(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of ["fr", "en"])
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      for (const slug of slugs) {
        await page.goto(`/${locale}/work/${slug}`);
        await noOverflow(page);
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: info.outputPath(`${locale}-${slug}-${width}.jpg`),
            type: "jpeg",
            quality: 88,
          });
      }
    }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/fr#projets");
    for (const id of ["projets", "experience", "stack", "about", "contact"]) {
      await page
        .locator("#" + id)
        .evaluate((element) =>
          element.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await page.screenshot({
        path: info.outputPath(`${id}-${width}.jpg`),
        type: "jpeg",
        quality: 90,
      });
    }
  }
  expect(errors).toEqual([]);
});

test("signature and skip adapt to every viewport", async ({
  browser,
}, info) => {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
    });
    const page = await context.newPage();
    const errors = monitor(page);
    await page.goto("/fr");
    const intro = page.locator(".cinematic-intro");
    await expect(intro).toHaveAttribute("data-phase", "identity");
    const skip = page.getByRole("button", { name: "Passer l’intro" });
    await expect(skip).toBeInViewport();
    await page.screenshot({
      path: info.outputPath(`signature-${width}.jpg`),
      type: "jpeg",
      quality: 88,
    });
    await skip.click();
    await expect(intro).toHaveCount(0);
    await noOverflow(page);
    expect(errors).toEqual([]);
    await context.close();
  }
});
