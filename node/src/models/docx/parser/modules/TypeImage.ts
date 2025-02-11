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

      // console.log("content:", element.removeAttr("src").toString());

      // Get original image size from base64
      const originalDimensions = sizeOf(Buffer.from(base64Data, "base64"));
      let width = originalDimensions.width;
      let height = originalDimensions.height;

      // console.log(`originalDimensions - width: ${width}, height: ${height}`);

      // Define A4 usable width in pixels (16.94cm = ~640px)
      const A4_USABLE_WIDTH_PX = 640;

      // Extract relevant attributes
      const htmlWidth = element.attr("width");
      const htmlHeight = element.attr("height");
      const lockAspectRatio = element.attr("lockaspectratio") === "true";

      // console.log(
      //   `htmlAttributes - width: ${htmlWidth}, height: ${htmlHeight}, lockAspectRatio: ${lockAspectRatio}`
      // );

      // Determine width and height from attributes
      if (htmlWidth) {
        if (htmlWidth.endsWith("%")) {
          // If width is percentage, calculate based on A4 usable width (not original image width)
          width = (parseInt(htmlWidth, 10) / 100) * A4_USABLE_WIDTH_PX;
        } else {
          // Handle explicit width in px
          width = parseInt(htmlWidth, 10);
        }

        // If `lockaspectratio` is true and height is not explicitly set, calculate height
        if (lockAspectRatio && !htmlHeight) {
          const aspectRatio = originalDimensions.height / originalDimensions.width;
          height = Math.round(width * aspectRatio);
        }
      }

      if (htmlHeight) {
        if (htmlHeight.endsWith("%")) {
          // Handle height as percentage of original
          height = (parseInt(htmlHeight, 10) / 100) * originalDimensions.height;
        } else {
          // Handle explicit height in px
          height = parseInt(htmlHeight, 10);
        }
      }

      // console.log(`Final Dimensions - width: ${width}px, height: ${height}px`);

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
