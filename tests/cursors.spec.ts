import { test, expect, Page } from '@playwright/test';

// Options
const HEIGHT = 1200;
const WIDTH = 1600;

const MOVEMENTS = 20;

const viewportSize = {width: WIDTH, height: HEIGHT};

test('default', async ({ context }) => {
  // How can we programatically generate this?
  await Promise.all([
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
    instanceTest(await context.newPage()),
  ]);
});

async function instanceTest(page: Page) {
  console.log("==> Instance started")
  await page.setViewportSize(viewportSize);

  // Pre-flight check that it's booted correctly
  await page.goto('/');
  await expect(page).toHaveTitle(/Cursors/);

  for (let i = 0; i < MOVEMENTS; i++) {
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
