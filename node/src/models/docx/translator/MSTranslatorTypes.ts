/**
 * Enum for Microsoft Translator API endpoints.
 */
export enum EMSEndpoints {
  TRANSLATE = "translate",
  LANGUAGES = "languages",
  DETECT = "detect",
}
/**
 * Enum for type of loaded text.
 */
export enum EMSLoadedType {
  PLAIN = "plain",
  HTML = "html",
}

/**
 * Enum for common error messages.
 */
export enum EMSErrorMessages {
  INVALID_TYPE = "Invalid type: Expected a valid value but received an incorrect type.",
  EMPTY_VALUE = "Invalid value: Expected a non-empty value.",
  NETWORK_ERROR = "Network error: Unable to communicate with the server.",
  API_ERROR = "API error: Received an error response from Microsoft Translator API.",
  UNKNOWN_ERROR = "Unexpected error occurred during the process.",
}

/**
 * Enum for error codes.
 */
export enum EMSErrorCodes {
  INVALID_API_KEY = "INVALID_API_KEY_TYPE",
  INVALID_BASE_ENDPOINT = "INVALID_BASE_ENDPOINT_TYPE",
  INVALID_VERSION = "INVALID_VERSION_TYPE",
  INVALID_HTTP_CLIENT = "INVALID_HTTP_CLIENT",
  INVALID_ENDPOINTS = "INVALID_ENDPOINTS_TYPE",
  INVALID_CONTENT_TYPE = "INVALID_CONTENT_TYPE",
  UNDETECTABLE_CONTENT_TYPE = "UNDETECTABLE_CONTENT_TYPE",
  FETCH_ERROR = "FETCH_ERROR",
  TRANSLATE_ERROR = "TRANSLATE_ERROR",
  DETECT_ERROR = "DETECT_ERROR",
  UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  NO_RESPONSE = "NO_RESPONSE",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Interface for error details.
 */
export interface IMSErrorDetails {
  receivedType: string;
  receivedValue: any;
}

/**
 * Class to store detailed error information.
 */
export class MSErrorDetails implements IMSErrorDetails {
  receivedType: string;
  receivedValue: any;

  constructor(receivedType: string, receivedValue: any) {
    this.receivedType = receivedType;
    this.receivedValue = receivedValue;
  }
}

/**
 *  Structured JSON representation of the error
 */
export interface IMSTranslatorErrorJSON {
  name: string;
  message: string;
  code: EMSErrorCodes;
  details?: MSErrorDetails;
  stack?: string;
}

/**
 * Interface for structured MSTranslator errors.
 */
export interface IMSTranslatorError extends Error {
  code: EMSErrorCodes;
  details?: IMSErrorDetails;
  location?: string;
  log(): this;
  toJSON(): IMSTranslatorErrorJSON;
}

/**
 * Custom error class for handling Microsoft Translator errors.
 */
export class MSTranslatorError extends Error implements IMSTranslatorError {
  public code: EMSErrorCodes;
  public details?: MSErrorDetails;
  public location?: string;

  constructor(message: EMSErrorMessages, code: EMSErrorCodes, details?: MSErrorDetails) {
    super(message);
    this.name = "MSTranslatorError";
    this.code = code;
    this.details = details;
    this.location = this.getErrorLocation();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MSTranslatorError);
    }
  }

  /**
   * Extracts error location from the stack trace.
   */
  private getErrorLocation(): string | undefined {
    try {
      const stackLines = this.stack?.split("\n");
      if (stackLines && stackLines.length > 2) {
        return stackLines[2].trim(); // Extracts the first relevant stack trace line
      }
    } catch (err) {
      console.warn("Error extracting location:", err);
    }
    return undefined;
  }

  /**
   * Returns a structured JSON representation of the error.
   */
  toJSON(): IMSTranslatorErrorJSON {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack, // Useful for debugging
    };
  }

  /**
   * Console error a structured JSON representation of the error.
   */
  log(): this {
    console.error(this.toJSON());
    return this;
  }
}

/**
 * Interface for preloaded MSTranslator class.
 */
export interface IMSTranslatorPreloaded {
  load(load: string[]): Promise<IMSTranslatorLoaded | null>;
}

/**
 * Interface for fully loaded MSTranslator instance.
 */
export interface IMSTranslatorLoaded {
  translate(targetLanguage: string): Promise<string | string[]>;
}
