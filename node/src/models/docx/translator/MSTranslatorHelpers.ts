import { AxiosError } from "axios";
import {
  EMSErrorCodes,
  EMSErrorMessages,
  MSErrorDetails,
  MSTranslatorError,
} from "./MSTranslatorTypes";
import * as cheerio from "cheerio";

/**
 * Handles known Microsoft Translator API errors and provides appropriate messages.
 */
export function handleAxiosError(error: AxiosError): void {
  if (error.response) {
    const status = error.response.status;
    const errorCode = this.mapStatusCodeToError(status);
    const errorMessage = this.mapStatusCodeToMessage(status);

    new MSTranslatorError(errorMessage, errorCode, new MSErrorDetails("HTTP Status", status)).log();

    throw error; // Ensure we do not wrap an already logged error twice
  } else if (error.request) {
    new MSTranslatorError(
      EMSErrorMessages.NETWORK_ERROR,
      EMSErrorCodes.NO_RESPONSE,
      new MSErrorDetails("No response", error.request)
    ).log();

    throw error; // Do not wrap twice
  } else {
    new MSTranslatorError(
      EMSErrorMessages.UNKNOWN_ERROR,
      EMSErrorCodes.UNKNOWN_ERROR,
      new MSErrorDetails("Unknown Error", error)
    ).log();

    throw error;
  }
}

/**
 * Maps HTTP status codes to error codes.
 */
export function mapStatusCodeToError(status: number): EMSErrorCodes {
  switch (status) {
    case 400:
      return EMSErrorCodes.BAD_REQUEST;
    case 401:
      return EMSErrorCodes.UNAUTHORIZED;
    case 403:
      return EMSErrorCodes.FORBIDDEN;
    case 408:
      return EMSErrorCodes.REQUEST_TIMEOUT;
    case 429:
      return EMSErrorCodes.RATE_LIMIT_EXCEEDED;
    case 500:
      return EMSErrorCodes.INTERNAL_SERVER_ERROR;
    case 503:
      return EMSErrorCodes.SERVICE_UNAVAILABLE;
    default:
      return EMSErrorCodes.UNKNOWN_ERROR;
  }
}

/**
 * Maps HTTP status codes to error messages.
 */
export function mapStatusCodeToMessage(status: number): EMSErrorMessages {
  switch (status) {
    case 400:
    case 401:
    case 403:
      return EMSErrorMessages.API_ERROR;
    case 408:
    case 429:
    case 503:
      return EMSErrorMessages.NETWORK_ERROR;
    case 500:
      return EMSErrorMessages.UNKNOWN_ERROR;
    default:
      return EMSErrorMessages.UNKNOWN_ERROR;
  }
}

// interface IBodyVariants {
//   original: string;
//   translation: string;
//   placeholder: string;
// }

// export interface ITranslationHTML {
//   body: IBodyVariants;
//   restoreTranslations(translatedLoad: string): string;
// }

// export class TranslationHTML implements ITranslationHTML {
//   private $placeholder: cheerio.CheerioAPI;
//   private $translation: cheerio.CheerioAPI;
//   private index: number = 0;
//   private map: Map<number, string> = new Map();
//   public body: IBodyVariants;

//   constructor(html: string) {
//     this.$placeholder = cheerio.load(html, null, false);
//     this.$translation = cheerio.load(html, null, false);

//     this.body = {
//       original: html,
//       translation: "",
//       placeholder: "",
//     };

//     // Step 1: Build `placeholderBody` (original structure but text replaced with placeholders)
//     this.buildPlaceholderBody();

//     // Step 2: Build `translationBody` (original structure, but text has IDs)
//     this.buildTranslationBody();

//     // Store modified versions
//     this.body.placeholder = this.$placeholder.root().html() ?? "";
//     this.body.translation = this.$translation.root().html() ?? "";
//   }

//   /**
//    * Builds `placeholderBody` - Original structure but text replaced with placeholders.
//    */
//   private buildPlaceholderBody() {
//     this.$placeholder("*").each((_, element) => {
//       const node = this.$placeholder(element);

//       // Ignore elements that are self-closing (like <img> or <br>)
//       if (node.is("img") || node.is("br")) return;

//       if (node.children().length === 0) {
//         const text = node.text().trim();
//         if (text.length > 0) {
//           const placeholder = `{{${this.index}}}`;
//           this.map.set(this.index, text);
//           node.text(placeholder); // Replace text with placeholder
//           this.index++;
//         }
//       }
//     });
//   }

//   /**
//    * Builds `translationBody` - Original structure but text assigned IDs instead of placeholders.
//    * This version is sent for translation.
//    */
//   private buildTranslationBody() {
//     this.$translation("*").each((_, element) => {
//       const node = this.$translation(element);

//       // Remove base64 images from the translation body
//       if (node.is("img") && node.attr("src")?.startsWith("data:image")) {
//         node.remove();
//       }

//       if (node.children().length === 0) {
//         const text = node.text().trim();
//         if (text.length > 0) {
//           node.attr("id", `text-${this.index}`);
//           Object.keys(node.attr()).forEach((attr) => {
//             if (attr !== "id") node.removeAttr(attr);
//           });

//           this.index++;
//         }
//       }
//     });
//   }

//   /**
//    * Restores translated text into the original placeholder structure.
//    */
//   public restoreTranslations(translatedLoad: string): string {
//     const $translated = cheerio.load(translatedLoad, null, false);

//     this.map.forEach((_, index) => {
//       const translatedText = $translated(`#text-${index}`).text();
//       this.$placeholder(`*:contains("{{${index}}}")`).text(translatedText);
//     });

//     return this.$placeholder.root().html() ?? "";
//   }
// }

export class ImagePlaceholderProcessor {
  private imageMap: Map<string, string>;

  constructor() {
    this.imageMap = new Map();
  }

  /**
   * Extracts <img> tags, replaces them with placeholders, and prevents translation.
   * @param html Input HTML string
   * @returns Processed HTML with placeholders
   */
  // public replaceImagesWithPlaceholders(html: string): string {
  //   return html.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
  //     const placeholderId = `{{img_${this.imageMap.size}}}`;
  //     this.imageMap.set(placeholderId, src);
  //     return `<img src="${placeholderId}" class="notranslate">`;
  //   });
  // }
  public replaceImagesWithPlaceholders(html: string): string {
    return html.replace(
      /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/gi,
      (match, beforeSrc, src, afterSrc) => {
        const placeholderId = `{{img_${this.imageMap.size}}}`;
        this.imageMap.set(placeholderId, src);
        return `<img ${beforeSrc}src="${placeholderId}"${afterSrc} class="notranslate">`;
      }
    );
  }

  /**
   * Restores original image sources based on stored placeholders.
   * @param html HTML string with placeholders
   * @returns Restored HTML with original images
   */
  // public restoreImages(html: string): string {
  //   this.imageMap.forEach((src, placeholder) => {
  //     html = html.replace(new RegExp(placeholder, "g"), src);
  //   });
  //   console.log("IMG HTML", html);
  //   return html;
  // }
  public restoreImages(html: string): string {
    this.imageMap.forEach((src, placeholder) => {
      html = html.replace(new RegExp(`src=["']${placeholder}["']`, "g"), `src="${src}"`);
    });
    return html;
  }
}

// 🚀 How to Use

// const processor = new ImagePlaceholderProcessor();

// // Example HTML with images
// const inputHtml = `
//     <p>Hello World!</p>
//     <img src="https://example.com/image1.jpg" alt="Image 1">
//     <img src="https://example.com/image2.png" alt="Image 2">
// `;

// // Replace images with placeholders
// const processedHtml = processor.replaceImagesWithPlaceholders(inputHtml);
// console.log("Processed HTML:", processedHtml);

// // Restore images back after translation
// const restoredHtml = processor.restoreImages(processedHtml);
// console.log("Restored HTML:", restoredHtml);
