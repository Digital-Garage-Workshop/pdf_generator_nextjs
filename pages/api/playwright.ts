import chrome from "chrome-aws-lambda";
import type { NextApiRequest, NextApiResponse } from "next";
import playwright from "playwright-core";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url } = req.body;

    const browser = await playwright.chromium.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
    const page = await browser.newPage();
    await page.goto(url as string, { waitUntil: "networkidle" });
    return await page.screenshot({ type: "png" });
  } catch (error) {
    console.log(error);
    res.status(400).send(JSON.stringify(error));
  }
};
export default handler;
