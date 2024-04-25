import jsPDF from "jspdf";
import { Ref } from "vue";

class PDFHelper {
  constructor() {}

  public static generatePDF = async (id: string, isActive: Ref<boolean>) => {
    try {
      const getHTMLElementWithTree = (): string => {
        const targetElement = document.getElementById(id);
        if (!targetElement) {
          throw new Error(`Element with ID ${id} not found at PCRView.vue.`);
        }
        return (targetElement.cloneNode(true) as HTMLElement).outerHTML;
      };

      const sheet = getHTMLElementWithTree();

      if (sheet) {
        let doc = new jsPDF("p", "pt", "a4");
        const opt: any = {
          callback: function (doc: jsPDF) {
            window.open(doc.output("bloburl"));
          },
          margin: [12, 12, 12, 12],
          autoPaging: "text",
          html2canvas: {
            allowTaint: true,
            dpi: 300,
            letterRendering: true,
            logging: false,
            scale: 0.72,
          },
        };

        doc.html(sheet, opt);
      } else throw new Error(`sheet evaluates to null at generatePDF at PDFHelper.ts.`);
    } catch (error) {
      console.error(error);
    } finally {
      isActive.value = false;
    }
  };
}

export { PDFHelper };
