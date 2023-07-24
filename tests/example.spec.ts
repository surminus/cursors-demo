import { test, expect, Page } from '@playwright/test';

// Options
const HEIGHT = 800;
const WIDTH = 800;

const MOVEMENTS = 100;
const SECONDS_BETWEEN_MOVES = 1;

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

  await page.goto('/');
  await expect(page).toHaveTitle(/Cursors/);

  for (let i = 0; i < MOVEMENTS; i++) {
    await page.mouse.move(0, 0);
    await page.mouse.down();
    // await page.mouse.move(WIDTH, HEIGHT);
    await page.mouse.move(10, 0);
    await page.waitForTimeout(SECONDS_BETWEEN_MOVES*1000);
    await page.mouse.move(20, 0);
    await page.waitForTimeout(SECONDS_BETWEEN_MOVES*1000);
    await page.mouse.move(30, 0);
  }
  // await page.mouse.down();
  //await page.mouse.move(100, 100);
  //await page.mouse.move(100, 0);
  //await page.mouse.move(0, 0);
  //await page.mouse.up();
  console.log("==> Instance finished")
}

// humanMove will move the cursor in increments,
// mimicking the way a human moves the mouse
async function humanMove(page: Page, width: number, height: number) {

};
