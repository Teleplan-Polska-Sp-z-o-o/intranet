import sizeOf from "image-size";
import { esdBase64, noEsdBase64 } from "./esdBase64";

export class ImageSettings {
  centered: boolean;
  fileType: string;

  constructor(centered: boolean, fileType: string) {
    this.centered = centered;
    this.fileType = fileType;
  }

  getImage(tagValue: string, tagName: string): Buffer {
    try {
      if (!tagValue) return Buffer.alloc(0); // Skip rendering empty images

      if (tagName === "logo1" || tagName === "logo2" || tagName === "body") {
        // Decode base64 images for logo1 and logo2
        return Buffer.from(tagValue, "base64");
      } else if (tagName === "esd") {
        if (tagValue === "1") {
          return Buffer.from(esdBase64, "base64");
        } else if (tagValue === "0") {
          return Buffer.from(noEsdBase64, "base64");
        }
      }
    } catch (error) {
      console.error(`Error in getImage: ${error.message}`);
      throw error;
    }
  }
  getSize(img: Buffer | string, tagValue: string, tagName: string, context): [number, number] {
    try {
      if (!tagValue) return [0, 0]; // Skip rendering empty images

      if (tagName === "logo1" || tagName === "logo2") {
        const height = 60; // Set the desired height
        const dimensions = sizeOf(img); // Get the original dimensions of the image
        if (!dimensions.width || !dimensions.height) {
          throw new Error("Unable to determine image dimensions");
        }

        const aspectRatio = dimensions.width / dimensions.height; // Calculate aspect ratio
        const width = Math.round(height * aspectRatio); // Scale width proportionally

        return [width, height];
      } else if (tagName === "esd") {
        this.centered = false;
        // Return static dimensions for esd
        return [28, 28];
      } else if (tagName === "body") {
        // const sizeObj = sizeOf(img);
        // const maxWidth = context.part.containerWidth;
        // const maxHeight = context.part.containerHeight || context.part.containerWidth;

        // const widthRatio = sizeObj.width / maxWidth;
        // const heightRatio = sizeObj.height / maxHeight;
        // if (widthRatio < 1 && heightRatio < 1) {
        //   /*
        //    * Do not scale up images that are
        //    * smaller than maxWidth,maxHeight
        //    */
        //   return [sizeObj.width, sizeObj.height];
        // }
        // let finalWidth, finalHeight;
        // if (widthRatio > heightRatio) {
        //   /*
        //    * Width will be equal to maxWidth
        //    * because width is the most "limiting"
        //    */
        //   finalWidth = maxWidth;
        //   finalHeight = sizeObj.height / widthRatio;
        // } else {
        //   /*
        //    * Height will be equal to maxHeight
        //    * because height is the most "limiting"
        //    */
        //   finalHeight = maxHeight;
        //   finalWidth = sizeObj.width / heightRatio;
        // }

        // return [Math.round(finalWidth), Math.round(finalHeight)];
        const dimensions = sizeOf(img); // Get the original dimensions of the image
        if (!dimensions.width || !dimensions.height) {
          throw new Error("Unable to determine image dimensions");
        }
        // Return true dimensions for 'body'
        return [dimensions.width, dimensions.height];
      } else {
        throw new Error(`Unsupported tagName for static size: ${tagName}`);
      }
    } catch (error) {
      console.error(`Error in getSize: ${error.message}`);
      throw error;
    }
  }
}
