import { imageGloveOptions } from "./instruction/steps/before/ImageGloves";
import { Template } from "./instruction/steps/before/ImageTypes";

const [glove1, glove2, glove3, glove4, glove5, glove6] = imageGloveOptions.flatMap(
  (g: Template) => g.images
);

interface ITemplateSegment {
  title: string;
  body: string;
  subSegments: Record<string, ITemplateSegment>;
}

type ITemplates = Record<string, Record<string, ITemplateSegment>>;

export const draftTemplates: ITemplates = {
  "BYD-QA-TMP-0001_01": {
    "1": {
      title: `REQUIRED PPE`,
      body: ``,
      subSegments: {
        "1.1": {
          title: ``,
          body: `<p><span>We understand individual PPE as PPE that is <strong>issued by the leader individually</strong> to each operator against a signature.</span><span style="color: rgb(0, 0, 0)">&nbsp;</span></p>`,
          subSegments: {},
        },
        "1.2": {
          title: ``,
          body: `<p>We understand collective PPE as a PPE that is still available at the station, for example a face shield, which we properly clean after use and put back in position, or it can be disposable aids such as nitrile gloves or ear plugs.</p><table class="table-wrapper" style="min-width: 100px"><colgroup><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>PPE</strong></p></th><th colspan="1" rowspan="1"><p><strong>Mandatory / Recommended</strong></p></th><th colspan="1" rowspan="1"><p><strong>Individual / Collective</strong></p></th><th colspan="1" rowspan="1"><p><strong>Image</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p>Legend:</p><ul><li><p>Mandatory – Required at all times</p></li><li><p>Recommended – Suggested for safety</p></li><li><p>Individual – Worn by each person</p></li><li><p>Collective – Shared at workstations</p></li></ul>`,
          subSegments: {},
        },
      },
    },
    "2": {
      title: `QUALITY CONTROL`,
      body: ``,
      subSegments: {},
    },
    "3": {
      title: `WORK TOOLS AND ALLOWED CHEMICALS`,
      body: `<table class="table-wrapper" style="min-width: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Description</strong></p></th><th colspan="1" rowspan="1"><p><strong>Link / Note </strong></p></th><th colspan="1" rowspan="1"><p><strong>Image</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table>`,
      subSegments: {},
    },
    "4": {
      title: `WORK INSTRUCTIONS`,
      body: ``,
      subSegments: {},
    },
    "5": {
      title: `VERIFY`,
      body: ``,
      subSegments: {},
    },
    "6": {
      title: `CHANGE HISTORY`,
      body: `<table class="table-wrapper notranslate" style="min-width: 125px"><colgroup><col><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Revision</strong></p></th><th colspan="1" rowspan="1"><p><strong>Revision Date</strong></p></th><th colspan="1" rowspan="1"><p><strong>ECN# - Description of change</strong></p></th><th colspan="1" rowspan="1"><p><strong>Change Author</strong></p></th><th colspan="1" rowspan="1"><p><strong>Affected Pages</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>`,
      subSegments: {},
    },
  },
  "PRG-QA-TMP-2202-R04": {
    "1": {
      title: `REQUIRED PPE`,
      body: ``,
      subSegments: {
        "1.1": {
          title: ``,
          body: `<p>Mandatory personal protective equipment is defined in cooperation with the external company BOZP-PO in the document "Směrnice k poskytování OOPP". The current wording of the document is here: <u>http://czintranet.tgn.teleplan.com/testovaci/bozp/BOZP_Legal_Compliance/01_Ricany/1_BOZP/</u></p>`,
          subSegments: {},
        },
        "1.2": {
          title: ``,
          body: `<p><span>We understand individual PPE as PPE that is <strong>issued by the leader individually</strong> to each operator.</span></p>`,
          subSegments: {},
        },
        "1.3": {
          title: ``,
          body: `<p><span>We understand collective PPE as a PPE that is still available at the station, for example a face shield, which we properly clean after use and put back in position, or it can be disposable aids such as nitrile gloves or ear plugs.</span></p>`,
          subSegments: {},
        },
        "1.4": {
          title: ``,
          body: `<p>In case of any changes in the PPE in the instruction, the trainer or a designated representative must revise the PPE icons on the name tag of the respective stations.</p><table class="table-wrapper" style="min-width: 100px"><colgroup><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>PPE</strong></p></th><th colspan="1" rowspan="1"><p><strong>Mandatory / Recommended</strong></p></th><th colspan="1" rowspan="1"><p><strong>Individual / Collective</strong></p></th><th colspan="1" rowspan="1"><p><strong>Image</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p>Legend:</p><ul><li><p>Mandatory – Required at all times</p></li><li><p>Recommended – Suggested for safety</p></li><li><p>Individual – Worn by each person</p></li><li><p>Collective – Shared at workstations</p></li></ul><p>Choose picture of gloves:</p><p><img src="${glove1}" lockaspectratio="true" width="122" data-display="inline"><img src="${glove2}" lockaspectratio="true" width="150" data-display="inline"><img src="${glove3}" lockaspectratio="true" width="150" data-display="inline"></p><p><img src="${glove4}" lockaspectratio="true" width="157" data-display="inline"><img src="${glove5}" lockaspectratio="true" width="109" data-display="inline"><img src="${glove6}" lockaspectratio="true" width="180" data-display="inline"></p>`,
          subSegments: {},
        },
      },
    },
    "2": {
      title: `QUALITY CONTROL`,
      body: ``,
      subSegments: {
        "2.1": {
          title: ``,
          body: `<p><span>Workstation must be 6S compliant. Verify the position and fill in the e-Checklist before starting work. You can find it at the link: http://czintranet.reconext.com/testovaci/mujChecklist/</span></p>`,
          subSegments: {},
        },
      },
    },
    "3": {
      title: `WORKING TOOLS, CLEANING TOOLS AND ALLOWED CHEMICALS`,
      body: `<table class="table-wrapper" style="min-width: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Description</strong></p></th><th colspan="1" rowspan="1"><p><strong>Link / Note</strong></p></th><th colspan="1" rowspan="1"><p><strong>Image</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table>`,
      subSegments: {},
    },
    "4": {
      title: `WORK INSTRUCTIONS`,
      body: ``,
      subSegments: {},
    },
    "5": {
      title: `VERIFY`,
      body: ``,
      subSegments: {},
    },
    "6": {
      title: `CHANGE HISTORY`,
      body: `<table class="table-wrapper notranslate" style="min-width: 125px"><colgroup><col><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Revision</strong></p></th><th colspan="1" rowspan="1"><p><strong>Revision Date</strong></p></th><th colspan="1" rowspan="1"><p><strong>ECN# - Description of change</strong></p></th><th colspan="1" rowspan="1"><p><strong>Change Author</strong></p></th><th colspan="1" rowspan="1"><p><strong>Affected Pages</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>`,
      subSegments: {},
    },
  },
};
