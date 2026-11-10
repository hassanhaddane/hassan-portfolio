import { test, expect, type Page } from "@playwright/test";

const slugs = ["greecheck", "808bloom", "tech-express", "ceo19"];
const names = ["GreeCheck", "808BLOOM", "Tech Express", "CEO1.9"];
const root = "[data-portfolio-root]";
function errorsOn(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}
async function ready(page: Page) {
  await expect(page.locator(root)).toHaveAttribute("data-narrative", "on");
  await expect(page.locator(".work-gallery")).toHaveAttribute(
    "data-ready",
    "true",
  );
}
async function selected(page: Page, index: number) {
  await expect(page.locator(`[id="${slugs[index]}"]`)).toHaveAttribute(
    "data-active",
    "true",
  );
  await expect(page.locator(root)).toHaveAttribute(
    "data-signal-project",
    slugs[index],
  );
  await expect(
    page.locator(`[id="${slugs[index]}"] .work-image-stage img`),
  ).toHaveJSProperty("complete", true);
}
for (const locale of ["fr", "en"] as const) {
  for (const width of [390, 1440]) {
    test(`${locale}: gallery previews, native selection, history and case capture at ${width}px`, async ({
      page,
    }) => {
      const errors = errorsOn(page);
      const fr = locale === "fr";
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(`/${locale}#projets`);
      await ready(page);
      for (let i = 0; i < slugs.length; i++) {
        await page.locator(`.gallery-index a[href="#${slugs[i]}"]`).click();
        await expect(page).toHaveURL(new RegExp(`#${slugs[i]}$`));
        await selected(page, i);
        await expect(
          page.locator(".work-entry:not([data-active='true']) a").first(),
        ).not.toBeVisible();
      }
      if (width === 1440) {
        await page.locator('.gallery-index a[href="#808bloom"]').hover();
        await selected(page, 1);
        await expect(page).toHaveURL(/#ceo19$/);
        await page.locator(".gallery-transport").hover();
        await selected(page, 3);
      }
      await page.locator('.gallery-index a[href="#ceo19"]').focus();
      await page.keyboard.press("ArrowLeft");
      await expect(
        page.locator('.gallery-index a[href="#tech-express"]'),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await selected(page, 2);
      await expect(page).toHaveURL(/#tech-express$/);
      await page
        .getByRole("link", {
          name: fr ? "Projet précédent" : "Previous project",
          exact: true,
        })
        .click();
      await selected(page, 1);
      await page.goBack();
      await selected(page, 2);
      await page.locator('[id="tech-express"] .work-image-link').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/work/tech-express$`));
      await expect(page.locator(root)).toHaveAttribute(
        "data-signal-project",
        "tech-express",
      );
      await expect(page.locator(".signal-canvas")).toHaveCount(1);
      const capture = page.locator(".capture-open").first();
      await capture.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.locator(".capture-full img")).toHaveJSProperty(
        "complete",
        true,
      );
      expect(
        await dialog
          .locator("img")
          .evaluate((e: HTMLImageElement) => e.naturalWidth),
      ).toBeGreaterThan(0);
      await dialog
        .getByRole("button", { name: fr ? "Capture suivante" : "Next capture" })
        .click();
      await expect(dialog.locator(".capture-full img")).toHaveAttribute(
        "src",
        /v2-desktop/,
      );
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(capture).toBeFocused();
      await page
        .locator(".case-topbar")
        .getByRole("link", { name: /Retour aux projets|Back to work/ })
        .click();
      await ready(page);
      await selected(page, 2);
      await expect(page).toHaveURL(/#tech-express$/);
      expect(errors).toEqual([]);
    });
  }
  test(`${locale}: engineering connections, chronology and the two personal practices`, async ({
    page,
  }) => {
    const errors = errorsOn(page);
    const fr = locale === "fr";
    await page.setViewportSize({ width: fr ? 1440 : 390, height: 1000 });
    await page.goto(`/${locale}#stack`);
    await ready(page);
    for (const button of await page.locator(".engineering-node").all()) {
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.locator(".engineering-evidence a").first(),
      ).toBeVisible();
    }
    await page.locator(".engineering-node").nth(3).click();
    await page.getByRole("button", { name: "Cypress", exact: true }).click();
    expect(
      await page
        .locator(".engineering-evidence a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ).toEqual(["#iaudiogram", "#biosency"]);
    await expect(page.locator(".engineering-evidence a")).toHaveCount(2);
    await page.locator('.engineering-evidence a[href="#iaudiogram"]').click();
    await expect(page).toHaveURL(/#iaudiogram$/);
    await page.locator("#iaudiogram summary").click();
    await expect(page.locator("#iaudiogram details")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator("#iaudiogram details")).toContainText(
      "GitHub Actions",
    );
    await page.locator('.journey-score a[href="#education"]').click();
    await expect(page).toHaveURL(/#education$/);
    await expect(page.locator("#education")).toContainText("RNCP 7");
    await page
      .getByRole("button", { name: fr ? /02.*Composer/ : /02.*Compose/ })
      .click();
    await expect(page.locator("#practice-1")).toBeVisible();
    await expect(page.locator("#practice-0")).not.toBeVisible();
    await expect(page.locator("#practice-1")).toContainText("808BLOOM");
    await expect(page.locator(root)).toHaveAttribute("data-signal-mode", "1");
    await page
      .getByRole("button", { name: fr ? /01.*Construire/ : /01.*Build/ })
      .click();
    await expect(page.locator("#practice-0")).toBeVisible();
    await expect(page.locator("#practice-1")).not.toBeVisible();
    expect(errors).toEqual([]);
  });
  test(`${locale}: all case studies use one canvas through their six narrative scenes`, async ({
    page,
  }) => {
    const errors = errorsOn(page);
    await page.setViewportSize({
      width: locale === "fr" ? 1440 : 390,
      height: 1000,
    });
    for (let i = 0; i < slugs.length; i++) {
      await page.goto(`/${locale}/work/${slugs[i]}`);
      await expect(page.locator("h1")).toHaveText(names[i]);
      await expect(page.locator(root)).toHaveAttribute(
        "data-universe",
        "webgl",
        { timeout: 20000 },
      );
      await expect(page.locator(root)).toHaveAttribute(
        "data-signal-project",
        slugs[i],
      );
      await page
        .locator("canvas")
        .evaluate((e) => (e.dataset.instance = "case-persistent"));
      const links = page.locator(".case-reading-nav > a");
      for (let scene = 1; scene < 6; scene++) {
        const link = links.nth(scene);
        const id = (await link.getAttribute("href"))!.slice(1);
        await link.click();
        await expect(page.locator(root)).toHaveAttribute("data-chapter", id);
        await expect(page.locator("canvas")).toHaveCount(1);
        await expect(page.locator("canvas")).toHaveAttribute(
          "data-instance",
          "case-persistent",
        );
        await expect(link).toHaveAttribute("aria-current", "location");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        ).toBeLessThanOrEqual(1);
      }
      await page.keyboard.press("End");
      await expect
        .poll(async () =>
          Number(await page.locator("canvas").getAttribute("data-stage")),
        )
        .toBe(5);
      await links.nth(2).click();
      await expect(page.locator(root)).toHaveAttribute(
        "data-chapter",
        "case-decisions",
      );
      await page.goBack();
      await expect(page).toHaveURL(/#case-links$/);
      await expect(page.locator(root)).toHaveAttribute(
        "data-chapter",
        "case-links",
      );
    }
    expect(errors).toEqual([]);
  });
}
