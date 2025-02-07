import * as cheerio from "cheerio";
import { TSegment, TStepper, IDraft } from "../../../interfaces/document/creatorTypes";

export class DeepLTranslator {
  languageCode: string;
  // Main function to process and translate IDraft in window 3
  public async translateDraft(stepper: TStepper, languageCode: string): Promise<TStepper> {
    this.languageCode = languageCode;
    const draft: IDraft | null = stepper.body.windows[3]?.model || null;

    if (!draft) {
      throw new Error("No IDraft model found in window 3");
    }

    // Process each segment and its subsegments
    for (const segment of draft.segments) {
      await this.processSegment(segment);
    }
    const translation = stepper;
    translation.body.windows[3].model = draft;

    return translation;
  }

  // Process a single segment and its subsegments recursively
  private async processSegment(segment: TSegment): Promise<void> {
    const { content, subSegments } = segment;

    // Translate title and body
    if (content && content.title) {
      content.title = await this.translate(content.title);
    }
    if (content && content.body) {
      content.body = await this.processHtml(content.body);
    }

    // Recursively process subsegments
    for (const subSegment of subSegments) {
      await this.processSegment(subSegment);
    }
  }

  // Process HTML content using Cheerio and translate inner text
  //   private async processHtml(html: string): Promise<string> {
  //     const $ = cheerio.load(html);

  //     // Iterate through text nodes to translate them
  //     $("*").each((_, element) => {
  //       const node = $(element);
  //       if (node.children().length === 0) {
  //         const originalText = node.text();
  //         if (originalText.trim()) {
  //           node.text(this.translateSync(originalText));
  //         }
  //       }
  //     });

  //     return $.html();
  //   }
  private async processHtml(html: string): Promise<string> {
    const $ = cheerio.load(html);

    // Recursive function to process text nodes
    const traverse = (element: cheerio.Cheerio<any>): void => {
      element.contents().each((_, child) => {
        const childNode = $(child);

        // If it's a text node, translate it
        if (child.type === "text") {
          const originalText = childNode.text().trim();
          if (originalText) {
            childNode.replaceWith(this.translateSync(originalText));
          }
        } else if (child.type === "tag") {
          // If it's an element, recurse
          traverse(childNode);
        }
      });
    };

    // Start traversal from the root
    traverse($.root());

    return $.html();
  }

  // Private function to translate a string (stub implementation)
  private async translate(input: string): Promise<string> {
    // Replace this with actual API call later
    return Promise.resolve(`${this.languageCode}-${input}`);
  }

  // Synchronous version of translate for inline HTML processing
  private translateSync(input: string): string {
    return `${this.languageCode}-${input}`;
  }
}
