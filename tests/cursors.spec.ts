import { test, expect, Page, BrowserContext } from "@playwright/test";

// Options
// The number of simultaneous cursor moves. Each member uses a separate
// page.
const MEMBERS = process.env.MEMBERS || "5";

// Height in pixels of window (x)
const HEIGHT = 1200;
// Width in pixels of window (y)
const WIDTH = 1600;

// How many squares to draw
const SQUARES = 10;

const SQUARE_SIZE = 600;

// Number of seconds that we randomise jitter to between moves
const MAX_JITTER = 2;

const viewportSize = { width: WIDTH, height: HEIGHT };

test("default", async ({ context }) => {
  const now = new Date();
  console.log(`Started at ${now}`);

  await Promise.all(
    Array.from(Array(parseInt(MEMBERS))).map((_, i) => instanceTest(i, context))
  );

  console.log(`Finished at ${new Date()}`);
});

async function instanceTest(id: number, context: BrowserContext) {
  const page = await context.newPage();

  console.log(`Instance ${id} started`);
  await page.setViewportSize(viewportSize);

  // Pre-flight check that it's booted correctly
  await page.goto("/");
  await expect(page).toHaveTitle(/Cursors/);

  for (let i = 0; i < SQUARES; i++) {
    await square(page, SQUARE_SIZE);
  }

  console.log(
    `Instance ${id} finished`
  );
}

async function square(page: Page, size: number = 500, steps: number = 100) {
  await page.mouse.move(0, 0, {steps: 0});
  await page.mouse.move(0, size, {steps});
  await page.mouse.move(size, size, {steps});
  await page.mouse.move(size, 0, {steps});
  await page.mouse.move(0, 0, {steps});
}

interface Location {
  x: number;
  y: number;
}

function newLocation(): Location {
  return {
    x: randomTarget(HEIGHT),
    y: randomTarget(WIDTH),
  };
}

async function move(page: Page, location: Location, steps: number = 100) {
  await page.mouse.move(location.x, location.y, {steps});
  await page.waitForTimeout(jitter());
}

function randomTarget(max: number) {
  return Math.floor(Math.random() * max);
}

function jitter() {
  return Math.floor(Math.random() * (MAX_JITTER * 1000));
}
