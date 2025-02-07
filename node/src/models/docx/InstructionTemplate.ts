export class InstructionTemplate {
  placeholders: Record<string, string>;
  constructor(name: string) {
    this.placeholders = this.findInSwitch(name);
  }

  findInSwitch(name: string) {
    switch (name) {
      case "BYD-QA-TMP-0001_01":
        return {
          key_instruction: "Instruction",
          key_document_id_rev: "Document ID-Revision",
          key_esd: "ESD",
          key_page: "Page",

          key_product: "Product",
          key_process_owner: "Process Owner",
          key_last_update: "Last Update",
          key_change_author: "Change Author",
          key_created: "Created",
          key_training_code: "Training Code",

          key_footer_text:
            "Printed version of this document is UNCONTROLLED. Only Reconext Intranet contains latest revision.",
        };
      default:
        return {};
    }
  }
}
