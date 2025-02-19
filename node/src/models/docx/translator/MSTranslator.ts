import axios, { AxiosInstance } from "axios";
import { msTranslatorConfig } from "../../../config/msTranslatorConfig";

import {
  EMSEndpoints,
  EMSErrorCodes,
  EMSErrorMessages,
  EMSLoadedType,
  IMSTranslatorLoaded,
  IMSTranslatorPreloaded,
  MSErrorDetails,
  MSTranslatorError,
} from "./MSTranslatorTypes";

/**
 * Base class for interacting with the Microsoft Translator API.
 */
class MSTranslatorBase {
  protected apiKey: string;
  protected baseEndpoint: string;
  protected version: string;

  protected httpClient: AxiosInstance;
  protected endpoints: typeof EMSEndpoints;

  constructor() {
    this.apiKey = msTranslatorConfig.apiKey;
    if (typeof this.apiKey !== "string" || !this.apiKey.trim()) {
      const error = new MSTranslatorError(
        EMSErrorMessages.INVALID_TYPE,
        EMSErrorCodes.INVALID_API_KEY,
        new MSErrorDetails(typeof this.apiKey, this.apiKey)
      ).log();
      throw error;
    }

    this.baseEndpoint = msTranslatorConfig.baseEndpoint;
    if (typeof this.baseEndpoint !== "string" || !this.baseEndpoint.trim()) {
      const error = new MSTranslatorError(
        EMSErrorMessages.INVALID_TYPE,
        EMSErrorCodes.INVALID_BASE_ENDPOINT,
        new MSErrorDetails(typeof this.baseEndpoint, this.baseEndpoint)
      ).log();
      throw error;
    }

    this.version = msTranslatorConfig.version;
    if (typeof this.version !== "string" || !this.version.trim()) {
      const error = new MSTranslatorError(
        EMSErrorMessages.INVALID_TYPE,
        EMSErrorCodes.INVALID_VERSION,
        new MSErrorDetails(typeof this.version, this.version)
      ).log();
      throw error;
    }

    this.httpClient = axios.create({
      baseURL: this.baseEndpoint,
      headers: {
        "Ocp-Apim-Subscription-Key": this.apiKey,
        "Ocp-Apim-Subscription-Region": "westeurope",
        "Content-Type": "application/json",
      },
    });
    if (
      !(this.httpClient instanceof Object) ||
      typeof this.httpClient.request !== "function" ||
      typeof this.httpClient.get !== "function" ||
      typeof this.httpClient.post !== "function"
    ) {
      const error = new MSTranslatorError(
        EMSErrorMessages.INVALID_TYPE,
        EMSErrorCodes.INVALID_HTTP_CLIENT,
        new MSErrorDetails(typeof this.httpClient, this.httpClient)
      ).log();
      throw error;
    }

    this.endpoints = EMSEndpoints;
    if (
      typeof this.endpoints !== "object" ||
      !this.endpoints.TRANSLATE ||
      !this.endpoints.LANGUAGES ||
      !this.endpoints.DETECT
    ) {
      const error = new MSTranslatorError(
        EMSErrorMessages.INVALID_TYPE,
        EMSErrorCodes.INVALID_ENDPOINTS,
        new MSErrorDetails(typeof this.endpoints, this.endpoints)
      ).log();
      throw error;
    }
  }
}

/**
 * Preloaded class that detects content type and fetches supported languages.
 */
export class MSTranslatorPreloaded extends MSTranslatorBase implements IMSTranslatorPreloaded {
  constructor() {
    super();
  }

  /**
   * Determines if the content is text, HTML, or Markdown.
   */
  private detectContentType(load: string | string[]): EMSLoadedType | null {
    if (!load) {
      return null; // Return null for empty input
    }

    // Convert array to string if necessary
    const content = Array.isArray(load) ? load.join(" ") : load;

    if (typeof content !== "string" || content.trim().length === 0) {
      return null; // Return null if the content is empty or not a valid string
    }

    // Detect HTML content
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return EMSLoadedType.HTML;
    }

    // Detect plain text
    if (content.trim().length > 0) {
      return EMSLoadedType.PLAIN;
    }

    return null;
  }

  /**
   * For now its not required because I fetch these language options on frontend to choose from.
   *
   * Fetches a set of supported languages from Microsoft Translator API.
   * Docs: {@link https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-languages Microsoft Docs}
   */
  //   public async fetchSupportedLanguages(): Promise<Set<string>> {
  //     try {
  //       const response = await this.httpClient.get(`/${this.endpoints.LANGUAGES}`, {
  //         params: { "api-version": this.version },
  //       });
  //       return new Set(Object.keys(response.data.translation));
  //     } catch (error) {
  //       console.error("Failed to fetch supported languages:", error);
  //       throw new MSTranslatorError("Failed to fetch supported languages.", "FETCH_ERROR", { error });
  //     }
  //   }

  /**
   * Loads content and prepares for translation by detecting content type and supported languages.
   */
  async load(load: string[]): Promise<MSTranslatorLoaded | null> {
    try {
      const loadedType = this.detectContentType(load);
      if (loadedType === null) {
        return null; // Gracefully skip translation
      }

      return new MSTranslatorLoaded(load, loadedType);
    } catch (error) {
      if (error instanceof MSTranslatorError) {
        error.log();
        throw error;
      }

      const e = new MSTranslatorError(
        EMSErrorMessages.UNKNOWN_ERROR,
        EMSErrorCodes.UNKNOWN_ERROR,
        new MSErrorDetails(typeof load, error)
      ).log();
      throw e;
    }
  }
}

/**
 * Class representing a loaded translator that detects source language and performs translation.
 */
export class MSTranslatorLoaded extends MSTranslatorBase implements IMSTranslatorLoaded {
  private loaded: string | string[];
  private loadedType: EMSLoadedType;

  constructor(loaded: string | string[], loadedType: EMSLoadedType) {
    super();
    this.loaded = loaded;
    this.loadedType = loadedType;
  }

  /**
   *
   * REQUIRES TESTING
   *
   * Extracts a meaningful text sample from the loaded content.
   *
   * - If `loadedType` is `HTML`, it removes all HTML tags.
   * - Extracts only words, numbers, and punctuation.
   * - Limits the sample to 100 characters while ensuring words are not cut off.
   *
   * @returns {string} A clean, trimmed sample of text for language detection.
   */
  // private sample(): string {
  //   let sample = Array.isArray(this.loaded) ? this.loaded.join(" ") : this.loaded;

  //   // ✅ Strip HTML tags if applicable
  //   if (this.loadedType === EMSLoadedType.HTML) {
  //     sample = sample.replace(/<[^>]+>/g, " ");
  //   }

  //   // ✅ Extract meaningful text (letters, numbers, basic punctuation)
  //   const matches = sample.match(/[\p{L}\d\s.,!?'-]+/gu);
  //   if (!matches) return ""; // Ensure we return something valid

  //   // ✅ Normalize spaces and join into a single string
  //   sample = matches.join(" ").replace(/\s+/g, " ").trim();

  //   // ✅ Split into words and intelligently limit length
  //   const words = sample.split(" ");
  //   let trimmedSample = "";
  //   for (const word of words) {
  //     if ((trimmedSample + " " + word).length > 100) break;
  //     trimmedSample += (trimmedSample ? " " : "") + word;
  //   }

  //   // ✅ Avoid trailing punctuation and spaces
  //   trimmedSample = trimmedSample.replace(/[\s.,!?'-]+$/, "").trim();

  //   return trimmedSample;
  // }

  /**
   *
   * REQUIRES TESTING
   *
   * For now its not required as we auto detect language by not passing from param
   *
   * Detects the source language of the loaded text.
   * Docs: {@link https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-detect Microsoft Docs}
   */
  // private async detectLanguage(): Promise<string | null> {
  //   try {
  //     const sample = this.sample();
  //     if (!sample) return null;

  //     const response = await this.httpClient.post(`/${this.endpoints.DETECT}`, [{ Text: sample }], {
  //       params: { "api-version": this.version },
  //     });
  //     return response.data[0].language;
  //   } catch (error) {
  //     console.error("Failed to detect language:", error);
  //     return null;
  //     // throw new MSTranslatorError("Failed to detect language.", "DETECT_ERROR", { error });
  //   }
  // }

  /**
   * For now its not required as we fetch correct languages on frontend
   *
   * Validates if the target language is supported.
   */
  //   private validateTargetLanguage(supportedLanguages: Set<string>, to: string): string {
  //     if (!supportedLanguages.has(to)) {
  //       throw new MSTranslatorError(
  //         `Language code '${to}' is not supported.`,
  //         "UNSUPPORTED_LANGUAGE",
  //         { to }
  //       );
  //     }
  //     return to;
  //   }

  /**
   * Translates the loaded content into the target language.
   *
   * Docs: {@link https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-translate Microsoft Docs}
   */
  async translate(targetLanguage: string): Promise<string[]> {
    try {
      // Ensure `this.loaded` is an array of strings
      const load = Array.isArray(this.loaded) ? this.loaded : [this.loaded];

      // if ((await this.detectLanguage()) === targetLanguage) return load;

      // Prepare the request body
      const requestBody = load.map((text) => ({ Text: text }));

      // Send translation request
      const response = await this.httpClient.post(`/${this.endpoints.TRANSLATE}`, requestBody, {
        params: {
          "api-version": this.version,
          to: targetLanguage,
          textType: this.loadedType,
        },
      });

      // Extract translated texts
      const translatedTexts = response.data.map((item: any) => item.translations[0].text);

      // Return a single string if input was a string, otherwise return an array
      return translatedTexts;
    } catch (error) {
      console.error("Translation API Request Failed:", error?.response?.data || error);
      return Array.isArray(this.loaded) ? this.loaded : [this.loaded]; // Return original text(s) on error
    }
  }
}

/**
 * Example Usage:
 *
 * (async () => {
 *     const loadedTranslator: MSTranslatorLoaded =  new MSTranslatorPreloaded().load("<p>Hello, world!</p>", "es");
 *     const translatedLoad: string = await loadedTranslator.translate();
 *     console.log(`Translated: ${translatedLoad}`);
 * })();
 */
