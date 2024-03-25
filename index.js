const scrapematch = require("./match.js");
// async function run() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   try {
//     await page.goto(
//       `http://www.howstat.com/cricket/Statistics/IPL/SeriesMatches.asp`
//     );
//     // links
//     const linkTables = await page.$$("tr td a.LinkTable");
//     if (linkTables) {
//       for (let i = 0; i < linkTables.length; ++i) {
//         const a = await linkTables[i].getProperty("href");
//         console.log(a);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
// run();
const makeURL = (no) => {
  let matchNo = no.toString();
  if (matchNo.length < 4) {
    matchNo = matchNo.padStart(4, "0");
  } else {
    matchNo = matchNo;
  }
  const BASE_URL = `http://www.howstat.com/cricket/statistics/IPL/MatchScorecard.asp?MatchCode=${matchNo}`;
  return BASE_URL;
};
async function run() {
  try {
    for (let i = 885; i <= 958; ++i) {
      await scrapematch(makeURL(i));
    }
  } catch (error) {
    console.log(error);
  }
}
run();
// scrapematch(
//   "http://www.howstat.com/cricket/statistics/IPL/MatchScorecard.asp?MatchCode=0959"
// );

// Season 23 0959-1033
// Season 22 0885-0958
// Season 21 0959-1033
