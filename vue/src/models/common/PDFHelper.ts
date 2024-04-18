import jsPDF from "jspdf";
import { Ref } from "vue";

class PDFHelper {
  constructor() {}

  public static generatePDF = (id: string, isActive: Ref<boolean>) => {
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
            // doc.save(docName);
            // to open the generated PDF in browser window
            window.open(doc.output("bloburl"));
            // const blob = doc.output("blob");
            // const url = URL.createObjectURL(blob);
            // const newWindow = window.open(url);
            // if (newWindow) {
            //   newWindow.document.title = docName;
            // }
          },
          margin: [0, 0, 0, 0],
          autoPaging: "text",
          html2canvas: {
            allowTaint: true,
            dpi: 300,
            letterRendering: true,
            logging: false,
            scale: 0.75,
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
