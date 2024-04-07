import { enC } from "./common/en";
import { enT } from "./tools/en";
import { plC } from "./common/pl";
import { plT } from "./tools/pl";
import { uaC } from "./common/ua";
import { uaT } from "./tools/ua";

const messages = {
  pl: {
    common: plC.common,
    tools: plT.tools,
  },
  en: {
    common: enC.common,
    tools: enT.tools,
  },
  ua: {
    common: uaC.common,
    tools: uaT.tools,
  },
};

export { messages };
