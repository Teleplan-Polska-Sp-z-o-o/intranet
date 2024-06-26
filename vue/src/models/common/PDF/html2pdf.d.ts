declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: any;
    jsPDF?: { unit: string; format: string; orientation: string };
    pagebreak?: { mode: string[] };
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): void;
    output(type: string): Promise<Blob>;
  }

  function html2pdf(): Html2Pdf;

  export = html2pdf;
}
