import { test, expect, Page } from '@playwright/test';

// Options
// Height in pixels of window
const HEIGHT = 1200;
// Width in pixels of window
const WIDTH = 1600;

// Number of seconds to run the test for
const TIMEOUT = 30;

// Number of seconds that we randomise jitter to
const MAX_JITTER = 2;

const viewportSize = {width: WIDTH, height: HEIGHT};

test('default', async ({ context }) => {
  const now = new Date()
  const end = now.getTime() + (TIMEOUT * 1000);
  console.log(`Started at ${now}`)

  // How can we programatically generate this?
  await Promise.all([
    instanceTest(0, await context.newPage(), end),
    instanceTest(1, await context.newPage(), end),
    instanceTest(2, await context.newPage(), end),
    instanceTest(3, await context.newPage(), end),
    instanceTest(4, await context.newPage(), end),
    instanceTest(5, await context.newPage(), end),
    instanceTest(6, await context.newPage(), end),
    instanceTest(7, await context.newPage(), end),
    instanceTest(8, await context.newPage(), end),
    instanceTest(9, await context.newPage(), end),
  ]);

  console.log(`Finished at ${new Date()}`)
});

async function instanceTest(id: number, page: Page, end: number) {
  console.log(`Instance ${id} started`)
  await page.setViewportSize(viewportSize);

  // Pre-flight check that it's booted correctly
  await page.goto('/');
  await expect(page).toHaveTitle(/Cursors/);

  // Record our movements
  let movements = 0;

  while (new Date().getTime() < end) {
    await randomMove(page)
    movements++
  }

  console.log(`Instance ${id} finished with ${movements} movements`)
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
  return Math.floor(Math.random() * (MAX_JITTER*1000))
}
