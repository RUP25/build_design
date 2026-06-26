import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
fs.mkdirSync(".shots", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.goto("http://localhost:3000/", {
  waitUntil: "networkidle2",
  timeout: 60000,
});
await new Promise((r) => setTimeout(r, 7500));

const scrollable = await page.evaluate(() => {
  const c = [...document.querySelectorAll("div")].filter(
    (d) => d.style.height?.endsWith("vh") && parseFloat(d.style.height) >= 1000,
  )[0];
  return c.offsetHeight - window.innerHeight;
});

for (const [name, y] of [
  ["flow_a", 7400],
  ["flow_b", 8600],
  ["flow_c", 9800],
  ["flow_d", 11000],
  ["flow_e", 12200],
]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 650));
  const info = await page.evaluate(() => {
    const bubbles = [...document.querySelectorAll("img[alt]")]
      .filter((i) => i.closest('[style*="vh"]'))
      .map((i) => {
        const wrap = i.closest('[style*="translate"]');
        const r = wrap?.getBoundingClientRect();
        return {
          alt: i.alt.slice(0, 22),
          x: r ? Math.round(r.x + r.width / 2) : null,
          size: r ? Math.round(r.width) : null,
        };
      })
      .filter((b) => b.size > 10)
      .sort((a, b) => b.size - a.size);
    return bubbles.slice(0, 5);
  });
  console.log(name, "p", (y / scrollable).toFixed(3), JSON.stringify(info));
  await page.screenshot({ path: `.shots/${name}.png` });
}

await browser.close();
