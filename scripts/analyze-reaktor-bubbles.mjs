import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

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
await new Promise((r) => setTimeout(r, 5000));

// Find showcase section scroll range
const sectionTop = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].find((el) =>
    el.textContent?.trim().match(/^(Residential|Public|Work space)$/),
  );
  if (!h2) return null;
  let el = h2;
  while (el && el !== document.body) {
    const s = getComputedStyle(el);
    if (s.position === "sticky" || el.classList.contains("sticky")) {
      return el.getBoundingClientRect().top + window.scrollY;
    }
    el = el.parentElement;
  }
  const sec = h2.closest("section") ?? h2.parentElement?.parentElement;
  return sec ? sec.getBoundingClientRect().top + window.scrollY : null;
});

console.log("sectionTop", sectionTop);

const samples = [];
for (let i = 0; i <= 20; i++) {
  const y = Math.round((sectionTop ?? 1400) + i * 45);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 500));

  const data = await page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const imgs = [...document.querySelectorAll("img, [class*='sphere'], [class*='bubble'], [class*='project']")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 60 || r.height < 60) return null;
        if (r.bottom < 0 || r.top > vh) return null;
        const br = parseFloat(getComputedStyle(el).borderRadius);
        if (r.width > 80 && (br > r.width * 0.4 || el.tagName === "IMG")) {
          return {
            cls: el.className?.toString?.().slice(0, 60),
            xPct: +((r.left + r.width / 2) / vw * 100).toFixed(1),
            yPct: +((r.top + r.height / 2) / vh * 100).toFixed(1),
            sizeVh: +((r.height / vh) * 100).toFixed(1),
            op: getComputedStyle(el).opacity,
          };
        }
        return null;
      })
      .filter(Boolean);

    const title = [...document.querySelectorAll("h2")].find((el) => {
      const t = el.textContent?.trim();
      return t === "Residential" || t === "Public" || t === "Work space";
    });
    const titleBox = title?.getBoundingClientRect();

    const pills = [...document.querySelectorAll("*")]
      .filter((el) => {
        const t = el.textContent?.trim() ?? "";
        return /^Public/.test(t) && el.children.length <= 3 && el.getBoundingClientRect().height > 40;
      })
      .slice(0, 2)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { yPct: +((r.top + r.height / 2) / vh * 100).toFixed(1), visible: r.bottom > 0 && r.top < vh };
      });

    return {
      scrollY: window.scrollY,
      imgs: imgs.slice(0, 6),
      title: titleBox
        ? {
            text: title?.textContent?.trim(),
            yPct: +((titleBox.top) / vh * 100).toFixed(1),
            op: getComputedStyle(title).opacity,
          }
        : null,
      pills,
    };
  });

  samples.push({ y, ...data });
  console.log(JSON.stringify({ y, imgs: data.imgs?.length, title: data.title, pills: data.pills }));
}

import fs from "fs";
fs.mkdirSync(".video-frames-ref", { recursive: true });
fs.writeFileSync(".video-frames-ref/reaktor-bubbles.json", JSON.stringify(samples, null, 2));
await browser.close();
