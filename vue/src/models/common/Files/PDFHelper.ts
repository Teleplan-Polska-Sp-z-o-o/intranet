// import jsPDF from "jspdf";
// import { Ref } from "vue";

// class PDFHelper {
//   constructor() {}

//   public static generatePDF = async (id: string, isActive: Ref<boolean>) => {
//     try {
//       const getHTMLElementWithTree = (): string => {
//         const targetElement = document.getElementById(id);
//         if (!targetElement) {
//           throw new Error(`Element with ID ${id} not found at PCRView.vue.`);
//         }
//         return (targetElement.cloneNode(true) as HTMLElement).outerHTML;
//       };

//       const sheet = getHTMLElementWithTree();

//       if (sheet) {
//         let doc = new jsPDF("p", "pt", "a4");
//         const opt: any = {
//           callback: function (doc: jsPDF) {
//             window.open(doc.output("bloburl"));
//           },
//           margin: [12, 12, 12, 12],
//           autoPaging: "text",
//           html2canvas: {
//             allowTaint: true,
//             dpi: 300,
//             letterRendering: true,
//             logging: false,
//             scale: 0.72,
//           },
//         };

//         doc.html(sheet, opt);
//       } else throw new Error(`sheet evaluates to null at generatePDF at PDFHelper.ts.`);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       isActive.value = false;
//     }
//   };
// }

// export { PDFHelper };

import { Ref } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type PDFOptions = {
  padding?: string | number;
  breakDeep?: Array<string>;
};

/**
 * To generate a PDF:
 * - Ensure the HTML element has an ID and follows this structure:
 *   - The element must be a v-sheet Vuetify component.
 *   - The v-sheet must contain a v-container Vuetify component.
 *   - All child elements of the v-container must be v-row Vuetify components.
 * - Call the generatePDF method with:
 *   - The element ID.
 *   - Optionally, a Vue ref for the dialog active state to close the dialog after generation.
 *   - Optional options object (add PDFOptions type to import):
 *     - padding: Amount of px minus 12px, example - '32px' (20px pdf margin).
 *     - breakDeep: Array of IDs of elements to break children into separate pages.
 */
class PDFHelper {
  private static totalHeightPt: number = 842;
  private static totalWidthPt: number = 595;

  private static paddingPx: string = "32px"; // 20px of margin
  private static breakDeep?: Set<string>;

  constructor() {}

  private static createHtmlPageContainer(): HTMLDivElement {
    try {
      const sheet = document.createElement("div");
      sheet.classList.add("v-sheet", "v-theme--light");
      sheet.style.width = `${PDFHelper.totalWidthPt}pt`;
      sheet.style.height = `${PDFHelper.totalHeightPt}pt`;

      const container = document.createElement("div");
      container.classList.add("v-container", "v-container--fluid", "v-locale--is-ltr");
      container.style.padding = PDFHelper.paddingPx;
      sheet.appendChild(container);

      return sheet;
    } catch (error) {
      throw new Error(`createHtmlPageContainer: ${error}`);
    }
  }

  private static splitHtmlToHtmlPages = (html: HTMLElement): Array<HTMLDivElement> => {
    try {
      const htmlPages: Array<HTMLDivElement> = [];

      let currentPageOfHtml: HTMLDivElement | undefined = undefined;
      const rowsOfHtml = html.querySelectorAll(".v-row");

      const addBottomBorder = () => {
        const lastChild = currentPageOfHtml!.querySelector(".v-container")
          ?.lastElementChild as HTMLDivElement;
        if (lastChild) {
          lastChild.classList.add("border-b-md");
        }
      };

      const getHtmlPageContainerHeightPt = () => {
        const container = currentPageOfHtml!.querySelector(".v-container");
        const containerHeightPx = container!.getBoundingClientRect().height;
        const containerHeightPt = (containerHeightPx * 72) / 96;

        return containerHeightPt;
      };

      const newPage = (appendNew: boolean = true) => {
        if (currentPageOfHtml) {
          addBottomBorder();
          htmlPages.push(currentPageOfHtml);
        }

        currentPageOfHtml = PDFHelper.createHtmlPageContainer();

        if (appendNew) document.body.appendChild(currentPageOfHtml);
      };

      newPage();

      const createBlankRowContainer = (row: Element, textContent: boolean): HTMLElement => {
        const clone = row.cloneNode(true) as HTMLElement;

        if (!textContent) {
          const ckContentElement = clone.querySelector(".ck.ck-content");
          if (ckContentElement)
            while (ckContentElement.firstChild) {
              ckContentElement.removeChild(ckContentElement.firstChild);
            }
        }

        return clone;
      };

      const getNodeHightPt = (node: Node, hookCurrentPageOfHtml: boolean = false) => {
        const clone = node.cloneNode(true);
        if (hookCurrentPageOfHtml)
          currentPageOfHtml!.querySelector(".v-container")?.appendChild(clone);
        const heightPx = (
          (hookCurrentPageOfHtml ? clone : node) as HTMLElement
        ).getBoundingClientRect().height;
        if (hookCurrentPageOfHtml)
          currentPageOfHtml!.querySelector(".v-container")?.removeChild(clone);
        return (heightPx * 72) / 96;
      };

      const isPageOverflowing = (heightPt: number) => {
        const total = PDFHelper.totalHeightPt;

        const containerHeightPt = getHtmlPageContainerHeightPt();

        return containerHeightPt + heightPt > total;
      };

      rowsOfHtml.forEach((row) => {
        const rowHeightPt = getNodeHightPt(row, true);
        const deep = PDFHelper.breakDeep?.has(row.id);

        if (deep && isPageOverflowing(rowHeightPt)) {
          const rowDeepClone = createBlankRowContainer(row, true);
          const rowClone = createBlankRowContainer(row, false);

          const lastElementChild = rowDeepClone.lastElementChild as HTMLElement | null;
          const contentContainer = lastElementChild?.lastElementChild as HTMLElement | null;
          const rowDeepCloneContent = Array.from(contentContainer?.childNodes || []);

          let rowCloneClone: HTMLElement | undefined = undefined;

          for (const colChild of rowDeepCloneContent) {
            const childHeightPt = getNodeHightPt(colChild, true);

            if (!rowCloneClone) {
              rowCloneClone = rowClone.cloneNode(true) as HTMLElement;
            }

            if (isPageOverflowing(childHeightPt)) {
              newPage();

              rowCloneClone = rowClone.cloneNode(true) as HTMLElement;
              const titleChild = rowCloneClone.firstElementChild;
              if (titleChild) titleChild.innerHTML = "";

              currentPageOfHtml!.querySelector(".v-container")?.appendChild(rowCloneClone);
            }

            const colChildClone = colChild.cloneNode(true) as HTMLElement;

            rowCloneClone.querySelector(".ck.ck-content")?.appendChild(colChildClone);

            currentPageOfHtml!.querySelector(".v-container")?.appendChild(rowCloneClone);
          }
        } else {
          if (isPageOverflowing(rowHeightPt)) {
            newPage();
          }

          const rowClone = row.cloneNode(true) as HTMLDivElement;
          currentPageOfHtml!.querySelector(".v-container")?.appendChild(rowClone);
        }
      });

      if (getHtmlPageContainerHeightPt() > 0) {
        newPage(false);
      }

      return htmlPages;
    } catch (error) {
      throw new Error(`splitHtmlToHtmlPages: ${error}`);
    }
  };

  public static createPDF = async (htmlPages: Array<HTMLDivElement>): Promise<jsPDF> => {
    try {
      const pdf = new jsPDF("p", "pt", "a4");

      for (let i = 0; i < htmlPages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(htmlPages[i], {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
        });

        document.body.removeChild(htmlPages[i]);

        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = PDFHelper.totalWidthPt;
        const pdfHeight = PDFHelper.totalHeightPt;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      return pdf;
    } catch (error) {
      throw new Error(`createPDF: ${error}`);
    }
  };

  public static generatePDF = async (id: string, isActive?: Ref<boolean>, options?: PDFOptions) => {
    try {
      // options

      if (options?.padding)
        PDFHelper.paddingPx =
          typeof options.padding === "string" ? options.padding : `${options.padding}px`;
      PDFHelper.breakDeep = new Set(options?.breakDeep);

      //

      const html = document.getElementById(id);
      if (!html) {
        throw new Error(`Element with ID ${id} not found.`);
      }

      const htmlPages: Array<HTMLDivElement> = PDFHelper.splitHtmlToHtmlPages(html);

      const pdf = await PDFHelper.createPDF(htmlPages);

      //output
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      if (isActive) isActive.value = false;
    }
  };
}

export { PDFHelper, type PDFOptions };
