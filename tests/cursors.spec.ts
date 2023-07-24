import { test, expect, Page } from '@playwright/test';

// Options
// Height in pixels of window
const HEIGHT = 1200;
// Width in pixels of window
const WIDTH = 1600;

// Number of seconds to run the test for
const TIMEOUT = 30;

const viewportSize = {width: WIDTH, height: HEIGHT};

test('default', async ({ context }) => {
  const now = new Date()
  const end = now.getTime() + (TIMEOUT * 1000);
  console.log(`Started at ${now}`)

  // How can we programatically generate this?
  await Promise.all([
    instanceTest(await context.newPage(), end),
    instanceTest(await context.newPage(), end),
    instanceTest(await context.newPage(), end),
    instanceTest(await context.newPage(), end),
    instanceTest(await context.newPage(), end),
  ]);

  console.log(`Finished at ${new Date()}`)
});

async function instanceTest(page: Page, end: number) {
  console.log("==> Instance started")
  await page.setViewportSize(viewportSize);

  // Pre-flight check that it's booted correctly
  await page.goto('/');
  await expect(page).toHaveTitle(/Cursors/);

  while (new Date().getTime() < end) {
    await randomMove(page)
  }

  console.log("==> Instance finished")
}

interface Location {
  width: number,
  height: number,
}

// Randomly move the cursor somewhere within the bounds of the window
async function randomMove(page: Page) {
  const targetWidth = randomTarget(WIDTH);
  const targetHeight = randomTarget(HEIGHT);
  await page.mouse.move(targetWidth, targetHeight);
  await page.waitForTimeout(jitter());
};

function randomTarget(max: number) {
  return Math.floor(Math.random() * max)
}

function jitter() {
  return Math.floor(Math.random() * 2000)
}
