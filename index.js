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
    const teamsHTML = await page.$$("tr[bgcolor='#a5d3ca']");
    const teams = [];
    for (const team of teamsHTML)
      if (team) {
        const _team = await (await team.getProperty("innerText")).jsonValue();
        teams.push(_team.split("(")[0].trim());
      }
    console.log(JSON.stringify(teams));
    // for (const trElement of trElements) {
    //   // player element
    //   const aElement = await trElement.$("a.ScorecardLink1");
    //   if (aElement) {
    //     const player = await (
    //       await aElement.getProperty("innerText")
    //     ).jsonValue();
    //     if (!player.startsWith("Season")) {
    //       console.log(player);
    //       // player performance
    //       const tdElements = await trElement.$$("td.TextBlack9");
    //       for (const td of tdElements) {
    //         const tdInnerText = await (
    //           await td.getProperty("innerText")
    //         ).jsonValue();
    //         console.log(tdInnerText.trim());
    //       }
    //     }
    //   }
    // }
  } catch (error) {
    console.error("error", error.message);
  } finally {
    await browser.close();
  }
}
run();
