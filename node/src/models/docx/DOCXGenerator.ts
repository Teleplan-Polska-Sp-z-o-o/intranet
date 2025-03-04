import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import * as fs from "fs";
import path from "path";
import { TStepper } from "../../interfaces/document/creatorTypes";
import { DOCX_TEMPLATES_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";
import ImageModule from "docxtemplater-image-module-free";
import { ImageSettings } from "./ImageSettings";
// import { renderHtmlToImage } from "./renderHtmlToImage";
import { HtmlToDocxXml } from "./parser/HtmlToDocxXml";
import { ITypeLI, Relationship } from "./parser/ParserTypes";
import {
  InstructionTemplateKeys,
  InstructionTemplateValues,
} from "./templates/instruction/InstructionTemplate";
import { TransCreateDocsResponseMessage } from "../../enums/response";
import { SimpleUser } from "../user/SimpleUser";

class DOCXGenerator {
  stepper: TStepper;
  issuer: SimpleUser;
  token: string;
  documentTemplate: string;
  //
  templateName: string;
  templateDir: string;
  templatePath: string;
  //
  relationships: Relationship[] = []; // Store extracted relationship entries

  constructor(stepper: TStepper, issuer: SimpleUser, token: string) {
    this.stepper = stepper;
    this.issuer = issuer;
    this.token = token;

    switch (this.stepper.type) {
      case "instruction":
        this.documentTemplate = stepper.body.windows[2].model.documentTemplate;
        this.templateName = `${this.documentTemplate}.docx`;
        break;

      default:
        throw new Error(`Stepper type not found`);
    }

    // Resolve the path to the templates directory relative to this file
    this.templateDir = path.join(UPLOADS_PATH, DOCX_TEMPLATES_FOLDER);
    // Verify the template exists
    this.templatePath = path.join(this.templateDir, this.templateName);
    if (!fs.existsSync(this.templatePath)) {
      throw new Error(TransCreateDocsResponseMessage.TEMPLATE_NOT_FOUND);
    }
  }

  // Load the template based on format
  loadTemplate() {
    return fs.readFileSync(this.templatePath, "binary");
  }

  // Generate the document based on the format and data
  async generateDocument(targetLanguage: string): Promise<Buffer> {
    try {
      const templateContent = this.loadTemplate();
      const zip = new PizZip(templateContent);
      const imageOpts = new ImageSettings(true, "docx");
      const imageModule = new ImageModule(imageOpts);
      const doc = new Docxtemplater(zip, {
        modules: [imageModule],
      });

      const converter = new HtmlToDocxXml();

      const stepperEntries = { keys: null, values: null };
      switch (this.stepper.type) {
        case "instruction":
          stepperEntries.keys = await new InstructionTemplateKeys(
            this.documentTemplate,
            targetLanguage
          ).getKeys();
          const instructionTemplateValues = new InstructionTemplateValues(
            this.documentTemplate,
            targetLanguage,
            this.stepper,
            this.issuer,
            this.token
          );
          stepperEntries.values = await instructionTemplateValues.getValues(
            this.relationships,
            converter
          );
          break;

        default:
          throw new Error(`Stepper type not found`);
      }

      const placeholders = {
        ...stepperEntries.keys,
        ...stepperEntries.values,
      };
      // console.log(" - ", 1)

      const LIModule = converter.getModules("li") as ITypeLI;
      // console.log(" - ", 2);
      const numberingDefinition = LIModule.createNumberingDefinition();
      // console.log(" - ", 3);
      LIModule.resetMapping();
      // console.log(" - ", 4);

      return doc.renderAsync(placeholders).then((doc) => {
        // console.log(" - ", 5);
        const zip = doc.getZip();
        // console.log(" - ", 6);
        const relsPath = "word/_rels/document.xml.rels";
        const numberingPath = "word/numbering.xml";
        // console.log(" - ", 7);
        if (!!numberingDefinition) zip.file(numberingPath, numberingDefinition);
        // console.log(" - ", 8);
        if (zip.files[relsPath]) {
          let relsContent = zip.files[relsPath].asText();
          let newRelationshipsXml = "";

          if (
            !relsContent.includes(
              'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering"'
            )
          ) {
            newRelationshipsXml += `<Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>`;
          }

          newRelationshipsXml += this.relationships
            .map(
              (rel) =>
                `<Relationship Id="${rel.relationshipId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${rel.targetPath}"/>`
            )
            .join("");

          relsContent = relsContent.replace(
            /<\/Relationships>/,
            `${newRelationshipsXml}</Relationships>`
          );
          zip.file(relsPath, relsContent);
        }
        // console.log(" - ", 9);

        this.relationships.forEach((rel) => {
          zip.file(`word/${rel.targetPath}`, Buffer.from(rel.base64, "base64"));
        });
        // console.log(" - ", 10);

        return zip.generate({ type: "nodebuffer" });
      });
    } catch (error) {
      console.error("Error generating document:", error);
    }
  }
}

export { DOCXGenerator };
