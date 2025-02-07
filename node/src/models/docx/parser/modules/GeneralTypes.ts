import * as cheerio from "cheerio";
import { TypeModuleInterface } from "../ParserTypes";

export class TypeP implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Check if the <p> is inside a table by looking for parent <table>, <tr>, <td>, or <th>
    const isInsideTable = element.parents("table, tr, td, th").length > 0;

    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:r>
    //       <w:rPr>
    //         <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
    //         <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
    //         <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
    //       </w:rPr>
    //       <w:t xml:space="preserve">${element.text()}</w:t>
    //     </w:r>`
    //   : content;

    // If inside a table, avoid extra spacing (like <w:spacing>)
    const paragraphProperties = isInsideTable
      ? `<w:pPr>
          <w:spacing w:before="0" w:after="0"/>
        </w:pPr>` // No extra spacing inside tables
      : `<w:pPr>
          <w:spacing w:before="120" w:after="120"/>
        </w:pPr>`;

    const parsedType = `
      <w:p>
        ${paragraphProperties}
        ${content}
      </w:p>
    `;

    return parsedType;
  }
}

export class TypeSpan implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    let styles = "";

    // Handle color styles if present
    const color = element.css("color");
    if (color) {
      const colorMatch = color.match(/\d+/g);
      if (colorMatch) {
        const hexColor = colorMatch.map((c) => parseInt(c).toString(16).padStart(2, "0")).join("");
        styles += `<w:color w:val="${hexColor}"/>`;
      }
    }

    // Add font and size settings
    styles += `
      <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
      <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
      <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
    `;

    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:t xml:space="preserve">${element.text()}</w:t>`
    //   : content;

    const parsedType = `
      <w:r>
        <w:rPr>${styles}</w:rPr>
         ${content}
      </w:r>
    `;

    return parsedType;
  }
}

export class TypeEm implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:t xml:space="preserve">${element.text()}</w:t>`
    //   : content;

    const parsedType = `
      <w:r>
        <w:rPr>
          <w:i/>  <!-- Italic -->
          <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
          <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
          <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
        </w:rPr>
        ${content}
      </w:r>
    `;

    return parsedType;
  }
}

export class TypeStrong implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:t xml:space="preserve">${element.text()}</w:t>`
    //   : content;

    const parsedType = `
      <w:r>
        <w:rPr>
          <w:b/>  <!-- Bold formatting -->
          <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
          <w:sz w:val="24"/>
          <w:szCs w:val="24"/>
        </w:rPr>
        ${content}
      </w:r>
    `;

    return parsedType;
  }
}

export class TypeU implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:t xml:space="preserve">${element.text()}</w:t>`
    //   : content;

    const parsedType = `
      <w:r>
        <w:rPr>
          <w:u w:val="single"/>  <!-- Underline formatting -->
          <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
          <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
          <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
        </w:rPr>
        ${content}
      </w:r>
    `;

    return parsedType;
  }
}

export class TypeS implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Check if the element contains only text (no child elements)
    // const noChildren = element.children().length === 0;

    // // Prepare content accordingly
    // const processedContent = noChildren
    //   ? `<w:t xml:space="preserve">${element.text()}</w:t>`
    //   : content;

    const parsedType = `
      <w:r>
        <w:rPr>
          <w:strike/>  <!-- Strikethrough formatting -->
          <w:rFonts w:ascii="Arial Nova Cond" w:hAnsi="Arial Nova Cond" w:cs="Arial Nova Cond"/>
          <w:sz w:val="24"/> <!-- 24 half-points = 12pt -->
          <w:szCs w:val="24"/> <!-- Font size for complex scripts -->
        </w:rPr>
        ${content}
      </w:r>
    `;

    return parsedType;
  }
}
