import puppeteer from "puppeteer";
// import sharp from "sharp";
import fs from "fs";
import path from "path";
import { DOCX_TEMPLATES_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";

/**
 * Renders the given HTML as an image and returns the image in Base64 format.
 *
 * @param html - The HTML string to render.
 * @returns A Promise that resolves to a Base64-encoded string of the rendered image.
 */
async function renderHtmlToImage(html: string): Promise<string> {
  // Read the CSS file content
  const cssPath = path.join(UPLOADS_PATH, DOCX_TEMPLATES_FOLDER, "github.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  // Add the CSS content to the HTML
  const styledHtml = `
    <html>
      <head>
        <style>
            ${cssContent}
            body {
                width: 16.94cm; /* A4 width (21cm) minus left and right margins (2.03cm each) */
                margin: 0 auto;
            }
        </style>
      </head>
      <body class="vuetify-pro-tiptap-editor__content markdown-theme-github">
        <puppeteer-clip>
            ${html}
        </puppeteer-clip>
      </body>
    </html>
  `;

  // Launch a new Puppeteer browser instance
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.setContent(styledHtml);

    await page.waitForSelector("puppeteer-clip");
    const clipHandle = await page.$("puppeteer-clip");
    if (!clipHandle) throw new Error("puppeteer-clip element not found");
    const boundingBox = await clipHandle.boundingBox();
    if (!boundingBox) throw new Error("Unable to determine bounding box");

    const baseWidth = Math.ceil(boundingBox.width);
    const baseHeight = Math.ceil(boundingBox.height);
    const deviceScaleFactor = 1; // High-quality scaling

    await page.setViewport({
      width: baseWidth,
      height: baseHeight,
      deviceScaleFactor: deviceScaleFactor, // Directly increase resolution
    });

    // Capture a high-resolution screenshot
    const screenshot = await page.screenshot({
      encoding: "base64", // Get binary buffer for processing
      type: "png",
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: baseWidth,
        height: baseHeight,
      },
    });

    // // Downscale the image to base size using sharp
    // const resizedImageBuffer = await sharp(screenshotBuffer)
    //   .resize(baseWidth * deviceScaleFactor, baseHeight * deviceScaleFactor)
    //   .toBuffer();

    // Convert the resized image to Base64
    return screenshot;
  } finally {
    // Ensure the browser is closed to free up resources
    await browser.close();
  }
}

export { renderHtmlToImage };
