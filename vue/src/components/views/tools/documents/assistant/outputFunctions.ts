import { TAssistantResponseMessage } from "../../../../../interfaces/assistants/AssistantResponse";

const _handleLink = (reference: { title: string; url: string }): boolean => {
  if (reference.url.includes("/node/uploads/documents/") && reference.title.includes("_qs_")) {
    const parts = reference.url.split("/");
    const lastPart = parts[parts.length - 1];

    const referenceSplit = lastPart.split("_qs_");

    const firstPart = referenceSplit.at(0);
    if (firstPart) {
      reference.title = firstPart;
    }

    const params = new URLSearchParams(referenceSplit.at(1));
    const langs = params.get("langs");
    const uuid = params.get("uuid");

    function removeExtension(str: string) {
      const lastDotIndex = str.lastIndexOf(".");
      if (lastDotIndex === -1) {
        return str;
      }
      return str.substring(0, lastDotIndex);
    }

    const doc = {
      fileName: referenceSplit.at(0),
      fileLangs: langs,
      fileUUID: removeExtension(uuid as string),
    };

    const docsViewRoute = "/tool/documents";
    const url = `${docsViewRoute}/${doc.fileName}/${doc.fileLangs}/${doc.fileUUID}`;
    reference.url = url;
    return true;
  } else return false;
};

const _format = (stringToFormat: string) => {
  const handleBr = (input: string): string => input.replaceAll("\\n", "<br>");

  const handleBold = (input: string): string =>
    input.replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const handleTitles = (input: string): string => {
    return input.replaceAll(/(#+)(.*?)<br>/g, (match, p1, p2) => {
      match; // to eliminate error
      let headingLevel = 6;
      switch (p1.length) {
        case 1:
          headingLevel = 3;
          break;
        case 2:
          headingLevel = 4;
          break;
        case 3:
          headingLevel = 5;
          break;

        default:
          break;
      }
      const classString = `class="text-h${headingLevel}"`;
      return `<span ${classString}>${p2.trim()}</span><br>`;
    });
  };

  const handleHr = (input: string): string => input.replaceAll(/---<br>/g, `<hr class="hr"><br>`);

  let formattedString = stringToFormat;
  formattedString = handleBr(formattedString);
  formattedString = handleBold(formattedString);
  formattedString = handleTitles(formattedString);
  formattedString = handleHr(formattedString);

  return formattedString;
};

const outputMessage = (message: TAssistantResponseMessage): string => {
  const messageToFormat: string = message
    .map((m) => {
      if (m?.type === "references" && Array.isArray(m?.data)) {
        const btnTemplate = (reference: {
          title: string;
          url: string;
        }) => `<span class="mdi mdi-file-link-outline"></span><a href="${reference.url}">
          ${reference.title}
        </a>`;
        for (let i = 0; i < m.data.length; i++) {
          let btn = m.data[i];
          const generateLink = _handleLink(btn);
          if (!generateLink) return "";
          btn = btnTemplate(btn);
          if (i === 0) btn = `<br>${btn}`;
          else if (i < m.data.length - 1) btn = `${btn}<br>`;
          return btn;
        }
      } else return Object.hasOwn(m, "message") ? m.message : m?.data;
    })
    .join("");

  return _format(messageToFormat);
};

const outputSource = (
  message: TAssistantResponseMessage,
  variant: "background" | "flex"
): string => {
  const isUserMessage = message.some((m) => Object.hasOwn(m, "message"));
  switch (variant) {
    case "background":
      return isUserMessage ? "bg-primary-container" : "bg-secondary-container";
    case "flex":
      return isUserMessage ? "user-message" : "assistant-message";

    default:
      return isUserMessage ? "user-message" : "assistant-message";
  }
};

export { outputMessage, outputSource };
