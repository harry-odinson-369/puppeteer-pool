# Puppetool 😎

A lightweight **Puppeteer tab/page pool manager** that helps you control concurrent pages/tabs efficiently.
It supports both **shared** and **isolated contexts** (fresh pages with no cookies or storage shared), making it ideal for web scraping, automation, or load-balanced browser tasks.

---

## ✨ Features
- 🚀 Singleton-based pool manager (easy to use across your project).
- 📑 Limit concurrent tabs/pages with a configurable max.
- 🧹 Auto-cleans closed pages from the pool.
- 🔒 `fresh: true` option for a brand-new incognito context (no cookies, cache, or localStorage leakage).
- ⚡ Built on top of Puppeteer (supports `rebrowser-puppeteer-core` as well).

---

## 📦 Installation

```bash
npm install puppetool
```

## 🚀 Usage (TypeScript)

```typescript
import Puppetool, { Page } from "puppetool";

(async () => {
  // Configure maximum concurrent tabs/pages
  Puppetool.instance.setMaxConcurrentPages(10);

  // Request a new page. If { fresh: true }, it will create a new isolated browser context (no cookies, cache, or localStorage shared with others).
  const page = await Puppetool.instance.getPage({ fresh: true });

  // Do your logic here as normal
  await page.goto("https://example.com");

  const title: string = await page.title();
  console.log("Page Title:", title);

  // Close the page (pool will auto-clean it up)
  await page.close();
})();

```