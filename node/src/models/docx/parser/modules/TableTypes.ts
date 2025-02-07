import * as cheerio from "cheerio";
import { TypeModuleInterface } from "../ParserTypes";

export class TypeTable implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    // Find the first row and count the number of columns (td/th)
    const firstRow = element.find("tr:first-child");
    const colCount = firstRow.find("td, th").length || 2; // Default to 2 columns if none found

    // Generate the tblGrid with appropriate gridCol elements
    let tblGrid = `<w:tblGrid>`;
    for (let i = 0; i < colCount; i++) {
      tblGrid += `<w:gridCol w:w="2500"/>`; // Default width if not specified
    }
    tblGrid += `</w:tblGrid>`;

    const parsedType = `
      <w:tbl>
        <w:tblPr>
          <w:tblStyle w:val="TableGrid"/>
          <w:tblW w:type="auto"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="8" w:color="d0d7de"/>
            <w:left w:val="single" w:sz="8" w:color="d0d7de"/>
            <w:bottom w:val="single" w:sz="8" w:color="d0d7de"/>
            <w:right w:val="single" w:sz="8" w:color="d0d7de"/>
            <w:insideH w:val="single" w:sz="4" w:color="d0d7de"/>
            <w:insideV w:val="single" w:sz="4" w:color="d0d7de"/>
          </w:tblBorders>
          <w:tblCellMar>
            <w:top w:w="100" w:type="dxa"/>
            <w:left w:w="100" w:type="dxa"/>
            <w:bottom w:w="100" w:type="dxa"/>
            <w:right w:w="100" w:type="dxa"/>
          </w:tblCellMar>
          <w:tblLook w:val="04A0" w:firstRow="1" w:noHBand="0" w:noVBand="0"/>
        </w:tblPr>

        <w:tblPrEx>
          <w:tblNoWrap/>
        </w:tblPrEx>
        ${tblGrid}
        ${content}
      </w:tbl> 
    `;

    return parsedType;
  }
}

export class TypeTbody implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    const parsedType = `${content}`;

    return parsedType;
  }
}

export class TypeCol implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    const parsedType = "";

    return parsedType;
  }
}

export class TypeColgroup implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    const parsedType = `${content}`;

    return parsedType;
  }
}

export class TypeTd implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    let colspan = element.attr("colspan") ? `<w:gridSpan w:val="${element.attr("colspan")}"/>` : "";
    let rowspan = element.attr("rowspan") ? `<w:vMerge w:val="restart"/>` : "";

    const parsedType = `
      <w:tc>
        <w:tcPr>
          ${colspan}
          ${rowspan}
          <w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/>
        </w:tcPr>
        ${content}
      </w:tc>
    `;

    return parsedType;
  }
}

export class TypeTh implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    let colspan = element.attr("colspan") ? `<w:gridSpan w:val="${element.attr("colspan")}"/>` : "";

    const parsedType = `
      <w:tc>
        <w:tcPr>
          ${colspan}
          <w:shd w:val="clear" w:color="auto" w:fill="D3D3D3"/>
          <w:cantSplit/> 
          <w:keepNext/>
        </w:tcPr>
        ${content}
      </w:tc>
    `;
    return parsedType;
  }
}

export class TypeTr implements TypeModuleInterface {
  process(element: cheerio.Cheerio<any>, content: string): string {
    const parsedType = `
      <w:tr>
        <w:trPr>
          <w:cantSplit/>
          <w:keepLines/>
          <w:keepNext/>
        </w:trPr>
        ${content}
      </w:tr>
    `;

    return parsedType;
  }
}
