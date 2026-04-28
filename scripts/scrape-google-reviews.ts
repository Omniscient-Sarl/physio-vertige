import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as readline from "readline";

const PLACE_URL =
  "https://www.google.com/maps/place/Physio-vertige+Arnaud+Canadas/data=!4m2!3m1!1s0x0:0x4760ff2303cc9752?sa=X&ved=1t:2428&ictx=111";

const headless = process.argv.includes("--headless");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay(min = 200, max = 500) {
  return sleep(min + Math.random() * (max - min));
}

function stableHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 16);
}

async function waitForUser(message: string) {
  console.log(`\n⚠️  ${message}`);
  console.log("   Solve it in the browser window, then press Enter to continue.");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>((resolve) => rl.once("line", () => { rl.close(); resolve(); }));
}

async function run() {
  console.log(`Launching Chromium (headless: ${headless})...`);

  const browser = await chromium.launch({
    headless,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    locale: "fr-CH",
    timezoneId: "Europe/Zurich",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  console.log("Navigating to Google Maps...");
  await page.goto(PLACE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await sleep(2000);

  // Handle cookie consent
  const consentButton = await page.$(
    'button:has-text("Tout refuser"), button:has-text("Reject all"), button:has-text("Alle ablehnen")'
  );
  if (consentButton) {
    console.log("Dismissing cookie consent...");
    await consentButton.click();
    await sleep(1000);
  }

  // Check for CAPTCHA
  const captcha = await page.$('iframe[src*="recaptcha"], #captcha-form, form[action*="sorry"]');
  if (captcha) {
    await waitForUser("CAPTCHA detected.");
  }

  // Wait for the place panel
  await page.waitForSelector('[data-item-id="reviews"]', { timeout: 15000 }).catch(() => null);
  await sleep(1000);

  // Click "Avis" tab
  console.log("Clicking Avis tab...");
  const avisTab = await page.$(
    'button[aria-label*="Avis"], button[jsaction*="reviewChart"], [data-tab-id="reviews"], button[role="tab"]:has-text("Avis")'
  );
  if (avisTab) {
    await avisTab.click();
  } else {
    // Fallback: click the reviews count element
    const reviewsLink = await page.$('[data-item-id="reviews"]');
    if (reviewsLink) await reviewsLink.click();
  }
  await sleep(2000);

  // Find the scrollable reviews container
  const scrollableSelector =
    'div[aria-label*="Avis sur"], div.m6QErb.DxyBCb, div.m6QErb';

  await page.waitForSelector(scrollableSelector, { timeout: 10000 }).catch(() => null);
  await sleep(1000);

  // Scroll until all reviews are loaded
  console.log("Scrolling to load all reviews...");
  let previousCount = 0;
  let stableRounds = 0;

  for (let i = 0; i < 50; i++) {
    const reviewCards = await page.$$('[data-review-id], div.jftiEf');
    const currentCount = reviewCards.length;

    if (i % 2 === 0) {
      console.log(`  Loaded ${currentCount} reviews so far...`);
    }

    if (currentCount === previousCount) {
      stableRounds++;
      if (stableRounds >= 3) {
        console.log(`  All ${currentCount} reviews loaded (stable for 3 cycles).`);
        break;
      }
    } else {
      stableRounds = 0;
    }
    previousCount = currentCount;

    // Scroll the container
    await page.evaluate((sel) => {
      const container = document.querySelector(sel);
      if (container) {
        container.scrollBy(0, container.clientHeight);
      }
    }, scrollableSelector);

    await randomDelay(300, 600);
  }

  // Expand all "Plus" / "More" toggles
  console.log("Expanding review texts...");
  const expandButtons = await page.$$('button[aria-label*="Plus"], button.w8nwRe, button[aria-expanded="false"][jsaction*="review"]');
  for (const btn of expandButtons) {
    await btn.click().catch(() => {});
    await sleep(100);
  }
  await sleep(500);

  // Extract reviews
  console.log("Extracting review data...");
  const reviews = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-review-id], div.jftiEf');
    const results: Array<{
      review_id: string;
      author_name: string;
      author_avatar_url: string;
      rating: number;
      relative_time: string;
      content: string;
    }> = [];

    cards.forEach((card) => {
      const reviewId =
        card.getAttribute("data-review-id") || "";

      // Author name
      const nameEl = card.querySelector('.d4r55, .WNxzHc a, button[data-review-id] + div a');
      const authorName = nameEl?.textContent?.trim() || "Anonyme";

      // Avatar
      const avatarEl = card.querySelector('img.NBa7we, img[src*="googleusercontent"]') as HTMLImageElement | null;
      const authorAvatarUrl = avatarEl?.src || "";

      // Rating - from aria-label like "5 étoiles sur 5" or count filled stars
      const ratingEl = card.querySelector('[role="img"][aria-label*="toile"], .kvMYJc');
      let rating = 5;
      if (ratingEl) {
        const ariaLabel = ratingEl.getAttribute("aria-label") || "";
        const match = ariaLabel.match(/(\d)/);
        if (match) rating = parseInt(match[1], 10);
      }

      // Relative time
      const timeEl = card.querySelector('.rsqaWe, .DU9Pgb, span[class*="xRkPPb"]');
      const relativeTime = timeEl?.textContent?.trim() || "";

      // Content - full text after expansion
      const textEl = card.querySelector('.wiI7pd, .MyEned span, .Jtu6Td span');
      const content = textEl?.textContent?.trim() || "";

      const finalId = reviewId || "";

      results.push({
        review_id: finalId,
        author_name: authorName,
        author_avatar_url: authorAvatarUrl,
        rating,
        relative_time: relativeTime,
        content,
      });
    });

    return results;
  });

  // Generate stable IDs for reviews without data-review-id
  for (const review of reviews) {
    if (!review.review_id) {
      review.review_id = stableHash(
        review.author_name + (review.content || "").slice(0, 100)
      );
    }
  }

  // Get aggregate data from the header
  const aggregateData = await page.evaluate(() => {
    const ratingEl = document.querySelector('.fontDisplayLarge, [class*="fontDisplayLarge"]');
    const countEl = document.querySelector('button[jsaction*="reviewChart"] span, [aria-label*="avis"]');
    const avgText = ratingEl?.textContent?.trim() || "";
    const countText = countEl?.textContent?.trim() || "";
    const avgMatch = avgText.match(/([\d,]+)/);
    const countMatch = countText.match(/(\d+)/);
    return {
      average: avgMatch ? parseFloat(avgMatch[1].replace(",", ".")) : 0,
      total: countMatch ? parseInt(countMatch[1], 10) : 0,
    };
  });

  await browser.close();

  // Write output
  const output = {
    scraped_at: new Date().toISOString(),
    place_url: PLACE_URL,
    total_count: aggregateData.total || reviews.length,
    average_rating: aggregateData.average || (reviews.length > 0
      ? parseFloat((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1))
      : 0),
    reviews,
  };

  const outDir = path.join(process.cwd(), "scraped");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "google-reviews.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n✅ Done! ${reviews.length} reviews scraped.`);
  console.log(`   Average rating: ${output.average_rating}`);
  console.log(`   Total count: ${output.total_count}`);
  console.log(`   Saved to: ${outPath}`);
}

run().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
