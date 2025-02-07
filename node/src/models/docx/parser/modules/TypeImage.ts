import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { TypeModuleInterface } from "../ParserTypes";
import sizeOf from "image-size";

export class TypeImage implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    try {
      const src = element.attr("src") || "";

      if (!src) {
        console.warn("Warning: No src attribute found for image, skipping.");
        return "";
      }

      // Match base64 image format (data:image/png;base64,...)
      const base64Match = src.match(/^data:image\/(\w+);base64,(.*)$/);
      if (!base64Match) {
        console.warn("Warning: Invalid or unsupported image format.");
        return "";
      }

      const mimeType = base64Match[1]; // Get image type (png, jpg, etc.)
      const base64Data = base64Match[2]; // Get base64 data

      // Generate a unique relationship ID for the image embedding
      const relationshipId = `rId${uuidv4()}`;
      // Generate a unique target path for the image
      const target = `image_${uuidv4()}.${mimeType}`;
      const targetPath = `media/${target}`;

      // THIS WORKED
      // const dimensions = sizeOf(Buffer.from(base64Data, "base64")); // Get the original dimensions of the image
      // // Convert px to EMU (1px = 9525 EMU units)
      // const widthEMU = dimensions.width * 9525;
      // const heightEMU = dimensions.height * 9525;

      // Get original image size from base64
      const originalDimensions = sizeOf(Buffer.from(base64Data, "base64"));
      let width = originalDimensions.width;
      let height = originalDimensions.height;

      // Get width, height & lockAspectRatio from <img> attributes
      const htmlWidth = element.attr("width");
      const htmlHeight = element.attr("height");
      const lockAspectRatio = element.attr("lockaspectratio") === "true";

      if (lockAspectRatio && htmlWidth) {
        // Resize while maintaining aspect ratio
        const scaleFactor = parseInt(htmlWidth, 10) / width;
        width = parseInt(htmlWidth, 10);
        height = Math.round(height * scaleFactor);
      } else if (!lockAspectRatio && htmlWidth && htmlHeight) {
        // Use explicit width & height
        width = parseInt(htmlWidth, 10);
        height = parseInt(htmlHeight, 10);
      }

      // Convert px → EMU (1px = 9525 EMU units)
      const widthEMU = width * 9525;
      const heightEMU = height * 9525;

      // Image reference inside document content
      const imageReference = `
          <w:drawing>
            <wp:inline>
              <wp:extent cx="${widthEMU}" cy="${heightEMU}"/>
              <wp:docPr id="1" name=""/>
              <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                    <pic:nvPicPr>
                      <pic:cNvPr id="0" name=""/>
                      <pic:cNvPicPr/>
                    </pic:nvPicPr>
                    <pic:blipFill>
                      <a:blip r:embed="${relationshipId}"/>
                      <a:stretch>
                        <a:fillRect/>
                      </a:stretch>
                    </pic:blipFill>
                    <pic:spPr>
                      <a:xfrm>
                        <a:off x="0" y="0"/>
                        <a:ext cx="${widthEMU}" cy="${heightEMU}"/>
                      </a:xfrm>
                      <a:prstGeom prst="rect">
                        <a:avLst/>
                      </a:prstGeom>
                    </pic:spPr>
                  </pic:pic>
                </a:graphicData>
              </a:graphic>
            </wp:inline>
          </w:drawing>
      `;

      const processObject = {
        xml: `${imageReference}`,
        relationshipId,
        base64: base64Data,
        targetPath,
      };

      return JSON.stringify(processObject);
    } catch (error) {
      console.error("Error processing image element:", error);
      return "";
    }
  }
}
