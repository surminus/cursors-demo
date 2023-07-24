import { Builder, Browser, Origin } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome.js";

const HEIGHT = 1200;
const INSTANCES = 1;
const MOVEMENTS = 10;
const SECONDS_BETWEEN_MOVES = 1;
const WIDTH = 1200;

function newSelenium() {
  console.log(`width: ${WIDTH}, height: ${HEIGHT}`)
  const opts = new Chrome.Options().windowSize({ width: WIDTH, height: HEIGHT })
  //const opts = new Chrome.Options().addArguments(`--window-size=${WIDTH},${HEIGHT}`);

  const driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(opts)
    .build();

  return driver;
}

async function runSelenium(driver) {
  try {
    await driver.get("http://127.0.0.1:5173");
    const actions = driver.actions({ async: true });

    let location = { x: 0, y: 0 };

    for (let n = 0; n < MOVEMENTS; n++) {
      let [x, y] = calculateOffsets(location);
      console.log(`Moving cursor by offset: {x: ${x}, y: ${y}}, from location: {x: ${location.x}, y: ${location.y}})`)

      await actions.move({ x: x, y: y, origin: Origin.POINTER }).perform();
      location = { x: location.x + x, y: location.y + y };
      await new Promise((resolve) => setTimeout(resolve, SECONDS_BETWEEN_MOVES*1000));
    }
  } finally {
    await driver.quit();
  }
}

function calculateOffsets(location) {
  let [x, y] = [0, 0];
  let start = 0;
  let maxHeight = HEIGHT;
  let maxWidth = WIDTH;

  if (location.x + location.y == 0) {
    [x, y] = [
      randomIntFromInterval(start, maxHeight),
      randomIntFromInterval(start, maxWidth),
    ];
  } else {
    let xRange = [start - location.x, maxHeight - location.x];
    let yRange = [start - location.y, maxWidth - location.x];

    x = randomIntFromInterval(xRange[0], xRange[1]);
    y = randomIntFromInterval(yRange[0], yRange[1]);
  }

  return [Math.floor(x), Math.floor(y)];
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

for (let i = 0; i < INSTANCES; i++) {
  let driver = newSelenium();
  runSelenium(driver);
}
