import * as cheerio from "cheerio";
import { ITypeLI, TypeModuleInterface } from "../ParserTypes";

interface IListNumbering {
  ilvl: number;
  numId: number;
  type: "decimal" | "bullet";
}

export class TypeLI implements ITypeLI {
  mapping: Map<any, IListNumbering> = new Map();
  process(element: cheerio.Cheerio<any>, content: string): string {
    const parent = element.parent();
    const tagName = parent.prop("tagName").toLowerCase();
    const cleanedContent = content.replace(/<\/?w:p[^>]*>/g, "").trim();

    // Retrieve or create list entry
    let list = this.mapping.get(parent[0]);

    if (!list) {
      const highestNumId = Math.max(0, ...Array.from(this.mapping.values()).map((l) => l.numId));

      list = {
        ilvl: parent.parents("ol, ul").length,
        numId: highestNumId + 1,
        type: tagName === "ol" ? "decimal" : "bullet",
      };

      this.mapping.set(parent[0], list);
    }

    return `
      <w:p>
        <w:pPr>
          <w:spacing w:before="120" w:after="120"/>
          <w:numPr>
            <w:ilvl w:val="${list.ilvl}"/>
            <w:numId w:val="${list.numId}"/>
          </w:numPr>
        </w:pPr>
        <w:r>${cleanedContent}</w:r>
      </w:p>
    `;
  }

  createNumberingDefinition(): string {
    let numberingXml = `<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`;

    this.mapping.forEach((list, _) => {
      // const baseIndent = 720;
      // const indent = baseIndent + list.ilvl * 720;
      const baseIndent = 540;
      const hangingIndent = 540;
      const indent = baseIndent + list.ilvl * hangingIndent;

      numberingXml += `
        <w:abstractNum w:abstractNumId="${list.numId}">
          <w:multiLevelType w:val="singleLevel"/>
          <w:lvl w:ilvl="${list.ilvl}">
            ${list.type === "decimal" ? `<w:start w:val="1"/>` : ""}
            <w:numFmt w:val="${list.type}"/>
            <w:lvlText w:val="${list.type === "decimal" ? "%1." : "•"}"/>
            <w:lvlJc w:val="left"/>
            <w:pPr><w:ind w:left="${indent}" w:hanging="360"/></w:pPr>
            <w:rPr>
              <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
              <w:sz w:val="24"/> <!-- 12pt (Word uses half-points, so 12pt = 24) -->
              <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
            </w:rPr>
          </w:lvl>
        </w:abstractNum>
      `;
    });

    this.mapping.forEach((list, _) => {
      numberingXml += `
        <w:num w:numId="${list.numId}">
          <w:abstractNumId w:val="${list.numId}"/>
          <w:lvlOverride w:ilvl="0">
            <w:startOverride w:val="1"/> 
          </w:lvlOverride>
        </w:num>
      `;
    });

    numberingXml += `</w:numbering>`;
    return numberingXml;
  }

  resetMapping(): void {
    this.mapping.clear();
  }
}

export class TypeOL implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    console.log(content);
    return `${content}`;
  }
}

export class TypeUL implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    console.log(content);
    return `${content}`;
  }
}
