import chrome from "chrome-aws-lambda";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url } = req.body;

    const options = process.env.AWS_REGION
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          args: [],
          executablePath:
            process.platform === "win32"
              ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
              : process.platform === "linux"
              ? "/usr/bin/google-chrome"
              : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(url as string, { waitUntil: "networkidle0" });
    return await page.screenshot({ type: "png" });
  } catch (error) {
    console.log(error);
    res.status(400).send(JSON.stringify(error));
  }
};
export default handler;
