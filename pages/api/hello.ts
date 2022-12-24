import chrome from "chrome-aws-lambda";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url } = req.body;

    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
    const page = await browser.newPage();
    await page.goto(url as string, { waitUntil: "networkidle0" });
    return await page.screenshot({ type: "png" });
  } catch (error) {
    console.log(error);
    res.status(400).send(JSON.stringify(error));
  }
};
export default handler;
