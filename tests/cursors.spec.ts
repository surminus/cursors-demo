import { test, expect, Page, BrowserContext } from "@playwright/test";

// Options
// The number of simultaneous cursor moves. Each instance is a separate
// page.
const INSTANCES = 5;

// Height in pixels of window
const HEIGHT = 1200;
// Width in pixels of window
const WIDTH = 1600;

// Number of seconds to run the test for
const TIMEOUT = 10;

// Number of seconds that we randomise jitter to between moves
const MAX_JITTER = 2;

// Number of increments between mouse moves to simulate human actions
const INCREMENTS = 20;

const viewportSize = { width: WIDTH, height: HEIGHT };

test("default", async ({ context }) => {
  const now = new Date();
  const end = now.getTime() + TIMEOUT * 1000;
  console.log(`Started at ${now}`);

  await Promise.all(
    Array.from(Array(INSTANCES)).map((_, i) => instanceTest(i, context, end))
  );

  console.log(`Finished at ${new Date()}`);
});

async function instanceTest(id: number, context: BrowserContext, end: number) {
  const page = await context.newPage();

  console.log(`Instance ${id} started`);
  await page.setViewportSize(viewportSize);

  // Pre-flight check that it's booted correctly
  await page.goto("/");
  await expect(page).toHaveTitle(/Cursors/);

  // Record our movements
  let movements = 0;

  let start = newLocation();
  while (new Date().getTime() < end) {
    let end = newLocation();
    await incrementalMove(page, start, end);
    movements++;
    start = end;
  }

  console.log(
    `Instance ${id} finished with ${movements * INCREMENTS} movements`
  );
}

interface Location {
  height: number;
  width: number;
}

function newLocation(): Location {
  return {
    height: randomTarget(HEIGHT),
    width: randomTarget(WIDTH),
  };
}

async function incrementalMove(page: Page, start: Location, end: Location) {
  const incrementWidth = calcincrements(start.width, end.width);
  const incrementHeight = calcincrements(start.height, end.height);

  let width = start.width;
  let height = start.width;
  for (let i = 0; i < INCREMENTS; i++) {
    width = width + incrementWidth;
    height = height + incrementHeight;
    await page.mouse.move(width, height);
    await page.waitForTimeout(Math.floor(500 / INCREMENTS));
  }

  await page.waitForTimeout(jitter());
}

function calcincrements(start: number, end: number): number {
  return Math.floor((end - start) / INCREMENTS);
}

function randomTarget(max: number) {
  return Math.floor(Math.random() * max);
}

function jitter() {
  return Math.floor(Math.random() * (MAX_JITTER * 1000));
}
