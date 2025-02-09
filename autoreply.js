import { chromium } from "playwright";

const WHATSAPP_URL = "https://web.whatsapp.com";
const USER_DATA_DIR = "./browser-profile";
const MESSAGE =
  "Hey! I'm no longer using WhatsApp. Please contact me on Signal instead. If you get this in this moment I'm programming this automation 🤷🏻";

async function sendMessage() {
  console.log("sendMessage");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
  });
  console.log("Browser initialised");
  const page = await context.newPage();
  await context.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  });

  await page.goto(WHATSAPP_URL, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForTimeout(10000);
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector("h1");
        return h1 && h1.textContent.includes("Chat");
      },
      { timeout: 10000 }
    );
  } catch (error) {
    await page.screenshot({
      path: `./qr-codes/${new Date().toISOString().replace(/[:.]/g, "-")}.png`,
    });
    console.error(
      "Not logged in or the expected page content is not loaded. A screenshot with the QR-code was taken, please scan it with your phone and try again."
    );
    await context.close();
    return;
  }

  const unreadSelectors = await page.$$(
    '[aria-label*="unread message"], [aria-label="Unread"]'
  );
  if (!unreadSelectors.length) {
    console.log("No unread messages.");
    await context.close();
    return;
  }

  for (const chat of unreadSelectors) {
    await chat.click();
    await page.waitForTimeout(1000);
    const isGroupChat = async () => {
      const menuButtons = await page.$$('[aria-label="Menu"]');
      const menuButton = menuButtons[menuButtons.length - 1];
      if (menuButton) {
        await menuButton.click();
        await page.waitForTimeout(500);
        const groupInfoVisible = await page.isVisible('text="Group info"');
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
        return groupInfoVisible;
      }
      return false;
    };

    if (await isGroupChat()) {
      console.log("Skipping group chat.");
      continue;
    }

    const inputBox = await page.$(
      'div[contenteditable="true"][aria-placeholder="Type a message"]'
    );
    if (inputBox) {
      await inputBox.click();
      await page.waitForTimeout(500);
      await inputBox.fill(MESSAGE);
      await page.waitForTimeout(500);
      await inputBox.press("Enter");
      console.log("Message sent to an individual chat.");
      await page.waitForTimeout(1000);
    } else {
      console.error("Input box not found.");
    }
  }
  await context.close();
}

(async () => {
  try {
    await sendMessage();
  } catch (err) {
    console.error("Something went wrong:", err);
    await context.close();
  }
})();
