import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import * as fs from "fs";
import path from "path";
import { TSegment, TStepper } from "../../interfaces/document/creatorTypes";
import { DOCX_TEMPLATES_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";
import moment from "moment-timezone";
import ImageModule from "docxtemplater-image-module-free";
import { ImageSettings } from "./ImageSettings";
// import { renderHtmlToImage } from "./renderHtmlToImage";
import { HtmlToDocxXml } from "./parser/HtmlToDocxXml";
import { ITypeLI, Relationship } from "./parser/ParserTypes";
import { InstructionTemplate } from "./InstructionTemplate";

class DocumentGenerator {
  stepper: TStepper;
  templateName: string;
  templateDir: string;
  templatePath: string;
  relationships: Relationship[] = []; // Store extracted relationship entries

  constructor(stepper: TStepper) {
    this.stepper = stepper;
    // this.tz = decodeURIComponent(tz);
    this.templateName = `${stepper.body.windows[2].model.documentTemplate}.docx`;

    // Resolve the path to the templates directory relative to this file
    this.templateDir = path.join(UPLOADS_PATH, DOCX_TEMPLATES_FOLDER); // path.resolve(path.dirname(__filename), "templates");

    // Verify the template exists
    this.templatePath = path.join(this.templateDir, this.templateName);
    if (!fs.existsSync(this.templatePath)) {
      throw new Error(`Template '${this.templateName}' not found in '${this.templateDir}'`);
    }
  }

  // Load the template based on format
  loadTemplate() {
    return fs.readFileSync(this.templatePath, "binary");
  }

  // Generate the document based on the format and data
  async generateDocument(): Promise<Buffer> {
    try {
      const templateContent = this.loadTemplate();

      const zip = new PizZip(templateContent);

      const imageOpts = new ImageSettings(true, "docx");

      const imageModule = new ImageModule(imageOpts);

      const doc = new Docxtemplater(zip, {
        modules: [imageModule],
      });

      const converter = new HtmlToDocxXml();

      const { windows } = this.stepper.body;

      const { author, competences, _created, esd, _lastUpdate, owner, product } = windows[1].model;
      const { documentTemplate, logosTemplate, title, id, _revision } = windows[2].model;
      const { segments } = windows[3].model;

      // Process segments recursively
      const processSegments = async (segments: TSegment[]): Promise<any[]> => {
        const contentArray = [];

        const processSegment = async (segment: TSegment) => {
          const {
            segmentIndex,
            content: { title, body },
            subSegments,
          } = segment;

          // BODY AS IMAGE WORKS, STARTING XML TRANSLATING MODULE - REPLACED {%body} with {@body}

          // REPLACED CODE

          // const bodyBase64 = !!body
          //   ? await renderHtmlToImage(body).catch((err) => {
          //       console.error(`Error rendering body for segment ${segmentIndex}:`, err.message);
          //       return "";
          //     })
          //   : "";

          // WITH

          converter.load(body);
          const docxXml = converter.processElement(converter.$("body"), converter.$);

          contentArray.push({
            segmentIndex,
            title,
            body: docxXml,
          });

          const relationships = converter.getRelationships();
          if (relationships.length > 0)
            this.relationships = this.relationships.concat(relationships);

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
      };

      const placeholders = {
        document_template: documentTemplate,
        esd: String(esd),
        logo1: logosTemplate[0].split(",")[1],
        logo2: logosTemplate[1].split(",")[1],
        title,
        document_id_rev: id && _revision ? `${id}-${_revision}` : "",
        product,
        owner: typeof owner === "string" ? owner : owner.name,
        last_update: moment.tz(_lastUpdate, this.stepper.tz).format("YYYY-MM-DD") || "---",
        author: typeof author === "string" ? author : author.name,
        created: moment.tz(_created, this.stepper.tz).format("YYYY-MM-DD"),
        competences: competences
          .map((c: { id: number; name: string } | string) => (typeof c === "string" ? c : c.name))
          .join(", "),
        segments: await processSegments(segments),
        ...new InstructionTemplate(documentTemplate).placeholders,
      };

      const LIModule = converter.getModules("li") as ITypeLI;
      const numberingDefinition = LIModule.createNumberingDefinition();
      LIModule.resetMapping();

      return doc.renderAsync(placeholders).then((doc) => {
        const zip = doc.getZip();
        const relsPath = "word/_rels/document.xml.rels";
        const numberingPath = "word/numbering.xml";

        zip.file(numberingPath, numberingDefinition);

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

        this.relationships.forEach((rel) => {
          zip.file(`word/${rel.targetPath}`, Buffer.from(rel.base64, "base64"));
        });

        return zip.generate({ type: "nodebuffer" });
      });
    } catch (error) {
      console.error("Error generating document:", error);
    }
  }
}

export default DocumentGenerator;
