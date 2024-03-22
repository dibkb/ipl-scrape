const fs = require("fs");
const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(
      "http://www.howstat.com/cricket/Statistics/IPL/SeriesMatches.asp?s=2023"
    );
    const links = await page.evaluate(() => {
      const linkTable = document.querySelectorAll(".LinkTable"); // Select all elements with class name 'LinkTable'
      return Array.from(linkTable).map((link) => link.href); // Extract href attribute from each link
    });
  } catch (error) {
    console.error("error", error.message);
  } finally {
    await browser.close();
  }
}
run();
