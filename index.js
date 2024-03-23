const fs = require("fs");
const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(
      "http://www.howstat.com/cricket/Statistics/IPL/MatchScorecard.asp?MatchCode=0959&Print=Y"
    );
    // match details
    const matchDetails = {};
    const teamsHTML = await page.$$("tr[bgcolor='#a5d3ca']");
    for (let i = 0; i < teamsHTML.length; ++i) {
      const team = await (
        await teamsHTML[i].getProperty("innerText")
      ).jsonValue();

      switch (i) {
        case 0:
          matchDetails["batting_first"] = team.split("(")[0].trim();
        case 1:
          matchDetails["batting_second"] = team.split("(")[0].trim();
      }
    }
    const headers = await page.$$("td.ScorecardHeader");
    for (let i = 0; i < headers.length; ++i) {
      const scoreInfo = await (
        await headers[i].getProperty("innerText")
      ).jsonValue();
      switch (i) {
        case 1:
          //  Venue
          matchDetails["venue"] = scoreInfo;
        case 2:
          // Date
          matchDetails["date"] = scoreInfo;
        case 3:
          // result
          matchDetails["winner"] = scoreInfo.split("won")[0].trim();
      }
    }
    console.log(JSON.stringify(matchDetails));
    // Select all tr elements
    const trElements = await page.$$("tr");
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
