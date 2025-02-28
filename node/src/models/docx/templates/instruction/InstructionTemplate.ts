import moment from "moment";
import { TSegment, TStepper } from "../../../../interfaces/document/creatorTypes";
import { MSTranslatorLoaded, MSTranslatorPreloaded } from "../../translator/MSTranslator";
import { HtmlToDocxXml } from "../../parser/HtmlToDocxXml";
import { Relationship } from "../../parser/ParserTypes";
import { ImagePlaceholderProcessor } from "../../translator/MSTranslatorHelpers";
import InstructionTemplateKeysJSON from "./InstructionTemplateKeys.json";

export class InstructionTemplateKeys {
  private keys: Record<string, string>;
  private targetLanguage: string;
  constructor(name: string, targetLanguage: string) {
    this.targetLanguage = targetLanguage;
    this.keys = this.findInSwitch(name);
  }

  /**
   * Retrieves the keys based on the template name.
   */
  private findInSwitch(name: string) {
    switch (name) {
      case "BYD-QA-TMP-0001_01":
        return InstructionTemplateKeysJSON[this.targetLanguage];
      default:
        return {};
    }
  }

  async getKeys() {
    return this.keys;
  }
}

export class InstructionTemplateValues {
  private stepper: TStepper;
  private values: Record<string, string | boolean | any[]>;
  private keys: Record<string, string>;
  private targetLanguage: string;

  constructor(name: string, targetLanguage: string, stepper: TStepper) {
    this.stepper = stepper;
    this.targetLanguage = targetLanguage;
    this.keys = this.findInSwitch(name);
    this.values = {};
  }

  /**
   * Retrieves the keys based on the template name.
   */
  private findInSwitch(name: string) {
    switch (name) {
      case "BYD-QA-TMP-0001_01":
        return InstructionTemplateKeysJSON[this.targetLanguage];
      default:
        return {};
    }
  }

  /**
   * Initializes values asynchronously before using them.
   */
  public async initializeValues(
    relationships: Relationship[],
    converter: HtmlToDocxXml
  ): Promise<void> {
    this.values = await this.setValues(this.stepper.body.windows, relationships, converter);
  }

  // Process segments recursively
  async processSegments(
    segments: TSegment[],
    relationships: Relationship[],
    converter: HtmlToDocxXml
  ): Promise<any[]> {
    const translator = new MSTranslatorPreloaded();
    const contentArray = [];

    const processSegment = async (segment: TSegment) => {
      const {
        segmentIndex,
        content: { title, body },
        subSegments,
      } = segment;

      // BODY
      const processor = new ImagePlaceholderProcessor();
      const translationBody = processor.replaceImagesWithPlaceholders(body);
      const loadedTranslatorBody: MSTranslatorLoaded | null = await translator.load([
        translationBody,
      ]);

      if (loadedTranslatorBody) {
        const translatedLoad: string[] = await loadedTranslatorBody.translate(this.targetLanguage);
        const translatedBody = processor.restoreImages(translatedLoad[0]);
        converter.load(translatedBody);
      } else converter.load(body);
      const docxXml = converter.processElement(converter.$("body"), converter.$);

      // TITLE
      // Check if predefined translation exists in `this.keys.segments`
      let processedTitle = title; // Default to original title
      const index = segmentIndex.toString(); // Ensure it's a string

      if (this.keys?.segments && Object.prototype.hasOwnProperty.call(this.keys.segments, index)) {
        processedTitle = this.keys.segments[index].title; // Use predefined translation
      } else {
        // Perform translation if no predefined title exists
        const loadedTranslatorTitle: MSTranslatorLoaded | null = await translator.load([title]);
        if (loadedTranslatorTitle) {
          const translatedLoad: string[] = await loadedTranslatorTitle.translate(
            this.targetLanguage
          );
          if (translatedLoad.length > 0 && translatedLoad[0]) {
            processedTitle = translatedLoad[0];
          }
        }
      }
      // let processedTitle = this.keys.segments title;
      // const loadedTranslatorTitle: MSTranslatorLoaded | null = await translator.load([title]);
      // if (loadedTranslatorTitle) {
      //   const translatedLoad: string[] = await loadedTranslatorTitle.translate(this.targetLanguage);
      //   processedTitle = translatedLoad[0];
      //   if (translatedLoad.length > 0 && translatedLoad[0]) {
      //     processedTitle = translatedLoad[0];
      //   }
      // }

      const isSub = (segmentIndex: string): boolean => {
        return segmentIndex.split(".").length > 2;
      };

      contentArray.push({
        segmentIndex,
        isSub: isSub(segmentIndex),
        title: processedTitle,
        body: docxXml,
      });

      const rels = converter.getRelationships();
      if (rels && rels.length > 0) relationships.push(...rels);

      // Recursively process subsegments
      if (subSegments && subSegments.length > 0) {
        for (const subSegment of subSegments) {
          await processSegment(subSegment);
        }
      }
    };

    for (const segment of segments) {
      await processSegment(segment);
    }
    return contentArray;
  }

  /**
   * Retrieves the values.
   */
  private async setValues(
    windows: Record<number, { model: any }>,
    relationships: Relationship[],
    converter: HtmlToDocxXml
  ): Promise<Record<string, string | boolean | any[]>> {
    const { author, competences, _created, esd, _lastUpdate, owner, product } = windows[1].model;
    const { documentTemplate, logosTemplate, title, id, _revision } = windows[2].model;

    const segments = await this.processSegments(
      windows[3].model.segments,
      relationships,
      converter
    );

    const logos: string[] = logosTemplate
      .map((img: string) => img.split(",")?.at(1) || "")
      .filter((img: string) => !!img);
    const hasLogo1: boolean = logosTemplate.length > 0 && !!logos.at(0);
    const hasLogo2: boolean = logosTemplate.length > 1 && !!logos.at(1);
    const logo1: string = logos.at(0);
    const logo2: string = logos.at(1);

    return {
      document_template: documentTemplate || "",
      esd: String(esd) || "0",
      // logo1: logosTemplate?.[0]?.split(",")?.[1] ?? "", // {%logo1}
      // logo2: logosTemplate?.[1]?.split(",")?.[1] ?? "", // {%logo2}
      //
      hasLogo1,
      logo1,
      hasLogo2,
      logo2,
      //
      title: title || "",
      document_id_rev: id && _revision ? `${id}-${_revision}` : "",
      product: product || "",
      owner: (typeof owner === "string" ? owner : owner.name) || "",
      last_update: moment(_lastUpdate).isValid()
        ? moment.tz(_lastUpdate, this.stepper.tz).format("DD-MMM-YYYY")
        : "- - -",
      author: (typeof author === "string" ? author : author.name) || "",
      created: moment(_created).isValid()
        ? moment.tz(_created, this.stepper.tz).format("DD-MMM-YYYY")
        : "- - -",
      competences: competences
        .map((c: { id: number; name: string } | string) => (typeof c === "string" ? c : c.name))
        .join(", "),
      segments,
    };
  }

  /**
   * Translates all values using MSTranslatorLoaded.
   * @param targetLanguage The target language for translation.
   */
  private async translateValues(targetLanguage: string): Promise<void> {
    const preloadedTranslator = new MSTranslatorPreloaded();
    const objectKeys = ["title", "product"];

    // Get non-empty keys
    const notEmptyKeys = objectKeys.filter((key) => {
      const isString = typeof this.values[key] === "string";
      if (isString) {
        if ((this.values[key] as string).trim() !== "") return true;
      }

      return false;
    });
    const content = notEmptyKeys.map((key) => this.values[key] as string); // Ensure string type

    if (content.length > 0) {
      const loadedTranslator: MSTranslatorLoaded | null = await preloadedTranslator.load(content);
      if (loadedTranslator) {
        const translatedArray: string[] = await loadedTranslator.translate(targetLanguage);
        notEmptyKeys.forEach((key, index) => {
          this.values[key] = translatedArray[index];
        });
      }
    }
  }

  /**
   * Initializes and retrieves translated values.
   */
  public async getValues(relationships: Relationship[], converter: HtmlToDocxXml) {
    await this.initializeValues(relationships, converter); // Ensure values are set before translation
    await this.translateValues(this.targetLanguage);
    return this.values;
  }
}
