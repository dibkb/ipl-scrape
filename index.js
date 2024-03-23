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
    const match_details = {};
    const teamsHTML = await page.$$("tr[bgcolor='#a5d3ca']");
    for (let i = 0; i < teamsHTML.length; ++i) {
      const team = await (
        await teamsHTML[i].getProperty("innerText")
      ).jsonValue();
      switch (i) {
        case 0:
          match_details["batting_first"] = team.split("(")[0].trim();
        case 1:
          match_details["batting_second"] = team.split("(")[0].trim();
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
          match_details["venue"] = scoreInfo;
        case 2:
          // Date
          match_details["date"] = scoreInfo;
        case 3:
          // result
          match_details["winner"] = scoreInfo.split("won")[0].trim();
      }
    }
    console.log({ match_details });
    // Select all tr elements
    const count = {
      BATTING: 0,
      BOWLING: 0,
    };
    const trElements = await page.$$("tr");
    const players = [];
    for (const trElement of trElements) {
      // batting or bowling
      const block10 = await trElement.$("td.TextBlackBold10");
      if (block10) {
        const block = await (
          await block10.getProperty("innerText")
        ).jsonValue();
        if (block.trim() === "BATTING") {
          count["BATTING"]++;
        } else if (block.trim() === "BOWLING") {
          count["BOWLING"]++;
        }
      }
      // player element
      const aElement = await trElement.$("a.ScorecardLink1");
      if (aElement) {
        let player_block = {
          player_name: null,
          dismissal: null,
          runs_scored: null,
          balls_faced: null,
          fours: null,
          sixes: null,
          strike_rate: null,
          percent_runs: null,
          overs: null,
          maidens: null,
          runs_given: null,
          wickets_taken: null,
          economy: null,
          percent_wickets: null,
          catches: null,
          opponent: null,
        };
        const info = [];
        const player = await (
          await aElement.getProperty("innerText")
        ).jsonValue();
        if (!player.startsWith("Season")) {
          info.push(player);
          // player performance
          const tdElements = await trElement.$$("td.TextBlack9");
          for (const td of tdElements) {
            const tdInnerText = await (
              await td.getProperty("innerText")
            ).jsonValue();
            info.push(tdInnerText.trim());
          }
        }
        if (count["BATTING"] === 2 && count["BOWLING"] === 0) {
          info.push(match_details["batting_second"]);
        } else if (count["BATTING"] === 2 && count["BOWLING"] === 2) {
          info.push(match_details["batting_first"]);
        } else if (count["BATTING"] === 3 && count["BOWLING"] === 2) {
          info.push(match_details["batting_first"]);
        } else if (count["BATTING"] === 3 && count["BOWLING"] === 4) {
          info.push(match_details["batting_second"]);
        }
        const index = players?.findIndex(
          (item) => item?.player_name === info[0]
        );
        if (index !== -1) {
          const match_block = players?.filter(
            (p) => p?.player_name === info[0]
          )[0];
          player_block = { ...player_block, ...match_block };
        }
        // Batsman
        if (info.length === 9) {
          // players.push(info);

          for (let i = 0; i < info.length; ++i) {
            switch (i) {
              case 0:
                player_block["player_name"] = info[i];
              case 1:
                player_block["dismissal"] = info[i];
              case 2:
                player_block["runs_scored"] = parseInt(info[i]);
              case 3:
                player_block["balls_faced"] = parseInt(info[i]);
              case 4:
                player_block["fours"] = parseInt(info[i]);
              case 5:
                player_block["sixes"] = parseInt(info[i]);
              case 6:
                player_block["strike_rate"] = parseFloat(info[i]);
              case 7:
                player_block["percent_runs"] = info[i];
              case 8:
                player_block["opponent"] = info[i];
            }
          }
          players.push(player_block);
        }
        // Bowler
        if (info.length === 8) {
          // players.push(info);
          for (let i = 0; i < info.length; ++i) {
            switch (i) {
              case 0:
                player_block["player_name"] = info[i];
              case 1:
                player_block["overs"] = parseFloat(info[i]);
              case 2:
                player_block["maidens"] = parseInt(info[i]);
              case 3:
                player_block["runs_given"] = parseInt(info[i]);
              case 4:
                player_block["wickets_taken"] = parseInt(info[i]);
              case 5:
                player_block["economy"] = parseFloat(info[i]);
              case 6:
                player_block["percent_wickets"] = parseFloat(info[i]);
              case 7:
                player_block["opponent"] = info[i];
            }
          }
          // if (index) {
          //   players[index] === match_block;
          // } else {
          // }
          players.push(player_block);
        }
      }
    }
    console.log({ players });
  } catch (error) {
    console.error("error", error.message);
  } finally {
    await browser.close();
  }
}
run();
