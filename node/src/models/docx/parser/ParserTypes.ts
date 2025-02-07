import * as cheerio from "cheerio";

export interface TypeModuleInterface {
  process(
    element: cheerio.Cheerio<any>,
    content: string,
    deepModuleHandler?: DeepModuleHandler
  ): string; // , modules?: Modules
}

export interface ITypeLI extends TypeModuleInterface {
  createNumberingDefinition(): string;
  resetMapping(): void;
}

export interface Relationship {
  xml: string;
  relationshipId: string;
  base64: string;
  targetPath: string;
}

export interface HtmlToDocxXmlInterface {
  /**
   * Converts HTML to DOCX XML format using the provided modules.
   * @param html - The input HTML string.
   * @returns The converted DOCX XML string.
   */
  load(html: string);
  getRelationships(): Relationship[];
  getModules(nameOfModule?: string): Modules | TypeModuleInterface;
  // getXml(): string;

  /**
   * Processes an individual HTML element recursively and returns DOCX XML.
   * @param element - The Cheerio element to process.
   * @param $ - The Cheerio API instance.
   * @returns The processed XML string for the element.
   */
  processElement(element: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string;
}

export interface Modules {
  [key: string]: TypeModuleInterface;
}

export interface DeepModuleHandler {
  $: cheerio.CheerioAPI;
  modules: Modules;
  processElement(element: cheerio.Cheerio<any>, $: cheerio.CheerioAPI, modules: Modules): string;
}
