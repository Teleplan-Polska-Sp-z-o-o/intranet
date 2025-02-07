import * as cheerio from "cheerio";
import { HtmlToDocxXmlInterface, Modules, Relationship, TypeModuleInterface } from "./ParserTypes";

import { TypeP, TypeStrong, TypeEm, TypeU, TypeSpan, TypeS } from "./modules/GeneralTypes";

import {
  TypeTable,
  TypeTr,
  TypeTd,
  TypeTh,
  TypeTbody,
  TypeColgroup,
  TypeCol,
} from "./modules/TableTypes";
import { TypeImage } from "./modules/TypeImage";
import { TypeLI, TypeOL, TypeUL } from "./modules/ListTypes";

// Registering modules
const importedModules = {
  p: new TypeP(),
  strong: new TypeStrong(),
  b: new TypeStrong(), // B tag handled by strong
  em: new TypeEm(),
  i: new TypeEm(), // I tag handled by em
  u: new TypeU(),
  s: new TypeS(),
  span: new TypeSpan(),
  li: new TypeLI(),
  ul: new TypeUL(),
  ol: new TypeOL(),
  table: new TypeTable(),
  tbody: new TypeTbody(),
  tr: new TypeTr(),
  td: new TypeTd(),
  th: new TypeTh(),
  colgroup: new TypeColgroup(),
  col: new TypeCol(),
  img: new TypeImage(),
};

export class HtmlToDocxXml implements HtmlToDocxXmlInterface {
  public $: cheerio.CheerioAPI;
  private xml: string = "";
  private modules: Modules = importedModules;
  private relationships: Relationship[] = []; // Store extracted relationship entries

  constructor() {}

  load(html: string) {
    this.$ = cheerio.load(html);
  }

  getRelationships() {
    return this.relationships;
  }

  getModules(nameOfModule?: string): Modules | TypeModuleInterface {
    return nameOfModule ? this.modules[nameOfModule] : this.modules;
  }

  processElement(element: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
    let resultXml = "";

    element.contents().each((_, el) => {
      const cheerioElement = $(el);

      if (el.type === "text") {
        const text = `<w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
            <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
            <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
          </w:rPr>
          <w:t xml:space="preserve">${cheerioElement.text()}</w:t>
        </w:r>`;
        resultXml += text;
      } else {
        const tagName = cheerioElement.prop("tagName").toLowerCase();

        const innerContent = this.processElement(cheerioElement, $);

        if (this.modules[tagName]) {
          if (tagName === "img") {
            const imgInnerContent = JSON.parse(
              this.modules[tagName].process(cheerioElement, innerContent)
            ) as Relationship;
            resultXml += imgInnerContent.xml;
            this.relationships.push({
              xml: imgInnerContent.xml,
              relationshipId: imgInnerContent.relationshipId,
              base64: imgInnerContent.base64,
              targetPath: imgInnerContent.targetPath,
            });
          } else {
            resultXml += this.modules[tagName].process(cheerioElement, innerContent);
          }
        } else {
          console.warn(`Unhandled tag - ${tagName}`);
          resultXml += innerContent;
        }
      }
    });

    this.xml += resultXml;
    return resultXml;
  }
}
