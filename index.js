const fs = require("fs");
const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(
      "http://www.howstat.com/cricket/Statistics/IPL/MatchScorecard.asp?MatchCode=0959"
    );
    // Select all tr elements
    const trElements = await page.$$("tr");
    const tdTexts = [];
    const teams = [];
    for (const tr of trElements) {
      const divwrap = await tr.$("td.ScorecardCountry3");
      if (divwrap) {
        const team = await (await divwrap.getProperty("innerText")).jsonValue();
        teams.push(team);
      }
      // player element
      const aElement = await tr.$("a.ScorecardLink1");
      if (aElement) {
        const player = await (
          await aElement.getProperty("innerText")
        ).jsonValue();
        // SKIP if season
        if (player.startsWith("Season") || player.startsWith("BOWLING"));
        const tdElements = await tr.$$("td");
        const tdInnerTexts = [];
        const tdTexts = [];
        for (const td of tdElements) {
          const tdInnerText = await (
            await td.getProperty("innerText")
          ).jsonValue();
          tdInnerTexts.push(tdInnerText.trim());
        }
        console.log(tdTexts);
      }
      console.log(tdTexts);
    }
  } catch (error) {
    console.error("error", error.message);
  } finally {
    await browser.close();
  }
}
run();
