import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = ".shots";
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  ["hero_a", 600],
  ["hero_b", 1800],
  ["merge", 2700],
  ["handoff", 4900],
  ["ticker", 5400],
  ["ticker_hold", 5700],
  ["bubble1", 7200],
  ["bubble2", 7800],
  ["bubble3", 8400],
  ["bubble4", 9000],
  ["statement", 10200],
  ["beliefs1", 11200],
  ["beliefs2", 12600],
  ["beliefs3", 13800],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
// wait out the intro sequence + image loads
await new Promise((r) => setTimeout(r, 7000));

for (const [name, y] of shots) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot", name, y);
}

await browser.close();
console.log("done");
