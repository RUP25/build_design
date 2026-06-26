import puppeteer from "puppeteer-core";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.goto("https://studio-reaktor.com/", {
  waitUntil: "networkidle2",
  timeout: 90000,
});
await new Promise((r) => setTimeout(r, 4000));

const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;

// Sample scroll positions through showcase section
const scrolls = [];
for (let y = 0; y <= Math.min(totalHeight, vh * 8); y += vh * 0.15) {
  scrolls.push(Math.round(y));
}

const results = [];
for (const y of scrolls) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 600));

  const data = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        opacity: s.opacity,
        transform: s.transform,
        fontSize: s.fontSize,
        zIndex: s.zIndex,
      };
    };

    const all = [...document.querySelectorAll("*")];
    const circles = all
      .filter((el) => {
        const s = getComputedStyle(el);
        const br = parseFloat(s.borderRadius);
        const r = el.getBoundingClientRect();
        return br > 100 && r.width > 80 && r.height > 80 && r.width < 1200;
      })
      .slice(0, 12)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          tag: el.tagName,
          cls: el.className?.toString?.().slice(0, 80),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          op: s.opacity,
        };
      });

    const pills = all
      .filter((el) => {
        const t = el.textContent?.trim() ?? "";
        return /^(Public|Development|Residential|Work space)/.test(t) && t.length < 30;
      })
      .slice(0, 6)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent?.trim().slice(0, 30),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });

    const titles = all
      .filter((el) => {
        const t = el.textContent?.trim() ?? "";
        return ["Residential", "Public", "Work space"].includes(t);
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          text: el.textContent?.trim(),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          fontSize: s.fontSize,
          op: s.opacity,
        };
      });

    return { scrollY: window.scrollY, circles, pills, titles };
  });

  results.push({ y, ...data });
  console.log(JSON.stringify({ y, pills: data.pills?.length, circles: data.circles?.length, titles: data.titles }));
}

await browser.close();
import fs from "fs";
fs.writeFileSync(".video-frames-ref/reaktor-analysis.json", JSON.stringify(results, null, 2));
console.log("saved reaktor-analysis.json");
