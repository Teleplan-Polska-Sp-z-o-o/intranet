import { IUserEntity } from "../../../../../../../../interfaces/user/IUserEntity";
import { SimpleUser } from "../../../../../../../../models/user/SimpleUser";
import { useUserStore } from "../../../../../../../../stores/userStore";

import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { draftTemplates } from "./DraftTemplates";

export namespace DraftTypes {
  interface IMeta {
    createdBy: SimpleUser;
    createdAt: string;
    update: {
      by: SimpleUser;
      at: string;
      of: string;
      old: string;
    }[];
    performUpdate(of: string, old: string): void;
  }

  class Meta implements IMeta {
    createdBy: SimpleUser;
    createdAt: string;
    update: {
      by: SimpleUser;
      at: string;
      of: string;
      old: string;
    }[];

    constructor() {
      const userStore = useUserStore();
      const user: IUserEntity | false = userStore.info();
      if (!user) throw new Error("'info()' from useUserStore at 'constructor()' resolve to false.");

      this.createdBy = new SimpleUser().build(user);
      this.createdAt = moment().toISOString();
      this.update = [];
    }

    public performUpdate(of: string, old: string): void {
      const userStore = useUserStore();
      const user: IUserEntity | false = userStore.info();
      if (!user) throw new Error("'info()' from useUserStore at 'update()' resolve to false.");

      // Set the update property
      this.update.push({
        by: new SimpleUser().build(user),
        at: moment().toISOString(),
        of,
        old,
      });
    }
  }

  interface ISegmentContent {
    _isSaved: boolean;
    _tmpTitle: string;
    _tmpBody: string;

    segmentUuid: string;
    title: string;
    body: string;
    // bodyWithInlineStyles: string;
  }

  class SegmentContent implements ISegmentContent {
    _isSaved: boolean = true; // Tracks saved state
    _tmpTitle: string = ""; // Internal storage for tmpTitle
    _tmpBody: string = ""; // Internal storage for tmpBody

    segmentUuid: string;
    title: string = "";
    body: string = "";
    // bodyWithInlineStyles: string = "";

    constructor(uuid: string) {
      this.segmentUuid = uuid;
    }

    get isSaved(): boolean {
      return this._isSaved;
    }
    get tmpTitle(): string {
      // return this._tmpTitle;
      return this.title;
    }
    set tmpTitle(value: string) {
      // this._tmpTitle = value;
      // this.updateIsSaved();
      this.title = value;
    }
    get tmpBody(): string {
      // return this._tmpBody;
      return this.body;
    }
    set tmpBody(value: string) {
      // console.log("tmpBody", value);
      this.body = value;
    }
    private updateIsSaved(): void {
      this._isSaved = this.title === this._tmpTitle && this.body === this._tmpBody;
    }

    async save(meta: Meta): Promise<void> {
      if (this.title !== this.tmpTitle) {
        meta.performUpdate(`${this.segmentUuid} (Segment, Content) - Title`, this.title);
        this.title = this._tmpTitle ?? "";
      }

      if (this.body !== this.tmpBody) {
        meta.performUpdate(`${this.segmentUuid} (Segment, Content) - Body`, this.body);
        this.body = this._tmpBody ?? "";

        // this.bodyWithInlineStyles = juice(
        //   `<style>${cssTipTapStyling}</style>${this._tmpBody ?? ""}`
        // );
      }

      // console.log("body", this.body);
      // console.log("bodyWithInlineStyles", this.bodyWithInlineStyles);

      return this.updateIsSaved();
    }
  }

  interface IBaseSegment {
    uuid: string;
    meta: Meta;
    content: SegmentContent;
  }

  interface ISegmentRelationship {
    position: number;
    segmentIndex: string;
    draft: Draft | null;
    parent: Segment | null;
    subSegments: Segment[];
  }

  interface FSegment {
    addSubSegment(): Segment;
    insertSegment(position: "before" | "after"): Segment;
    removeSegment(): void;
    saveContent(): void;
  }

  export class Segment implements IBaseSegment, ISegmentRelationship, FSegment {
    uuid: string = uuidv4();
    meta: Meta = new Meta();
    content: SegmentContent = new SegmentContent(this.uuid);
    position: number;
    segmentIndex: string = "";
    draft: Draft | null;
    parent: Segment | null;
    subSegments: Segment[] = [];

    constructor(parent: Segment | null = null, draft: Draft | null = null) {
      this.draft = draft;
      this.parent = parent;
      if (parent) {
        // For sub-segments, position is based on parent's subSegments length
        this.position = parent.subSegments.length + 1;
      } else if (draft) {
        // For root-level segments, position is based on draft's segments length
        this.position = draft.segments.length + 1;
      } else {
        throw Error("Segment must have either a parent or a draft.");
      }
      this.segmentIndex = this.generateIndex();
    }

    private generateIndex(): string {
      if (this.parent) {
        // Generate index based on parent segment and current position
        const parentIndex = this.parent.segmentIndex;
        return `${parentIndex}.${this.position}`;
      } else if (this.draft) {
        // Generate index for root segments in the Draft based on position
        return `${this.position}`;
      } else {
        throw Error(`'generateIndex()' in Segment: Both parent and draft are null.`);
      }
    }

    private updateParentSegmentsIndexes(): void {
      const siblings = this.parent ? this.parent.subSegments : this.draft?.segments;
      if (!siblings) return;

      // Ensure siblings are sorted by position
      siblings.sort((a, b) => a.position - b.position);

      // Update positions and indices for all siblings
      siblings.forEach((sibling, index) => {
        sibling.position = index + 1; // Sequential positions
        sibling.segmentIndex = sibling.generateIndex(); // Update index
        sibling.updateDescendantIndexes(); // Recursively update subsegments
      });
    }

    private updateDescendantIndexes() {
      this.subSegments.forEach((subSegment, index) => {
        subSegment.position = index + 1; // Ensure position is correct
        subSegment.segmentIndex = subSegment.generateIndex();
        subSegment.updateDescendantIndexes(); // Recursive update
      });
    }

    public addSubSegment(): Segment {
      const newSegment = new Segment(this, this.draft);
      this.subSegments.push(newSegment);
      return newSegment;
    }

    public insertSegment(position: "before" | "after"): Segment {
      const siblings = this.parent ? this.parent.subSegments : this.draft?.segments;
      if (!siblings) throw new Error("Cannot insert segment: No siblings found.");

      const referenceIndex = siblings.findIndex((s) => s.uuid === this.uuid);
      if (referenceIndex === -1) throw new Error("Reference segment not found.");

      const referencePosition = siblings[referenceIndex].position;
      const newSegment = new Segment(this.parent, this.draft);

      // Adjust positions of siblings
      siblings.forEach((sibling) => {
        if (
          (position === "before" && sibling.position >= referencePosition) ||
          (position === "after" && sibling.position > referencePosition)
        ) {
          sibling.position += 1; // Increment position to make room
        }
      });

      // Insert the new segment with the correct position
      newSegment.position = position === "before" ? referencePosition : referencePosition + 1;
      siblings.splice(referenceIndex + (position === "after" ? 1 : 0), 0, newSegment);

      // Recalculate indexes for all siblings and their descendants
      this.updateParentSegmentsIndexes();
      return newSegment;
    }

    public removeSegment(): void {
      const siblings = this.parent ? this.parent.subSegments : this.draft?.segments;
      if (!siblings) throw new Error("Cannot remove segment: No siblings found.");

      const referenceIndex = siblings.findIndex((s) => s.uuid === this.uuid);
      if (referenceIndex !== -1) {
        siblings.splice(referenceIndex, 1); // Remove the segment
        if (this.parent) {
          this.parent.updateParentSegmentsIndexes(); // Update parent and siblings
        } else {
          this.updateParentSegmentsIndexes(); // Update root segments
        }
      }
    }

    public saveContent(): void {
      this.content.save(this.meta);
    }
  }

  interface IDraftMeta {
    createdBy: SimpleUser;
    createdAt: string;
    update: {
      by: SimpleUser;
      at: string;
      of: string;
      old: string;
    }[];
    performUpdate(of: string, old: string): void;
  }

  class DraftMeta implements IDraftMeta {
    createdBy: SimpleUser;
    createdAt: string;
    update: {
      by: SimpleUser;
      at: string;
      of: string;
      old: string;
    }[];

    constructor() {
      const userStore = useUserStore();
      const user: IUserEntity | false = userStore.info();
      if (!user) throw new Error("'info()' from useUserStore at 'constructor()' resolve to false.");

      this.createdBy = new SimpleUser().build(user);
      this.createdAt = moment().toISOString();
      this.update = [];
    }

    public performUpdate(of: string, old: string): void {
      const userStore = useUserStore();
      const user: IUserEntity | false = userStore.info();
      if (!user)
        throw new Error("'info()' from useUserStore at 'performUpdate()' resolve to false.");

      this.update.push({
        by: new SimpleUser().build(user),
        at: moment().toISOString(),
        of,
        old,
      });
    }
  }

  export interface IDraft {
    uuid: string;
    segments: Segment[];
    meta: DraftMeta;
  }

  interface IDraftFunctions {
    addSegment(): Segment;
    findSegmentByUuid(uuid: string): Segment | null;
    reinitializeSegment(
      segmentData: IBaseSegment & ISegmentRelationship,
      parent: Segment | null,
      draft: Draft
    ): Segment;
  }

  export enum EDraftTemplate {
    BLANK = "BLANK",
    "BYD-QA-TMP-0001_01" = "BYD-QA-TMP-0001_01",
    "PRG-QA-TMP-2202-R04" = "PRG-QA-TMP-2202-R04",
  }

  export class Draft implements IDraft, IDraftFunctions {
    uuid: string;
    // content: DraftContent = new DraftContent(this.uuid);
    segments: Segment[]; // Top-level segments
    meta: DraftMeta;

    public addSegment(): Segment {
      const newSegment = new Segment(null, this); // No parent, belongs to the Draft
      this.segments.push(newSegment);
      return newSegment;
    }

    public findSegmentByUuid(uuid: string): Segment | null {
      // Recursive search through segments and subsegments
      const search = (segments: Segment[]): Segment | null => {
        for (const segment of segments) {
          if (segment.uuid === uuid) return segment;
          const found = search(segment.subSegments);
          if (found) return found;
        }
        return null;
      };
      return search(this.segments);
    }

    reinitializeSegment(
      segmentData: IBaseSegment & ISegmentRelationship,
      parent: Segment | null,
      draft: Draft
    ): Segment {
      if (!segmentData || !segmentData.meta || !segmentData.content) {
        throw new Error("Invalid segment data provided for reinitialization.");
      }

      const segment = new Segment(parent, draft);

      // Reattach data to the new instance
      segment.uuid = segmentData.uuid;

      // Reinitialize Meta
      const meta = new Meta();
      meta.createdBy = segmentData.meta.createdBy;
      meta.createdAt = segmentData.meta.createdAt;
      meta.update = segmentData.meta.update;
      segment.meta = meta;

      // Reinitialize Content
      const content = new SegmentContent(segment.uuid);
      content._isSaved = segmentData.content._isSaved;
      content._tmpTitle = segmentData.content._tmpTitle;
      content._tmpBody = segmentData.content._tmpBody;
      content.title = segmentData.content.title;
      content.body = segmentData.content.body;
      segment.content = content;

      // Preserve segment-specific properties
      segment.position = segmentData.position;
      segment.segmentIndex = segmentData.segmentIndex;

      // Reinitialize subSegments recursively
      segment.subSegments = segmentData.subSegments?.length
        ? segmentData.subSegments.map((subSegment) =>
            this.reinitializeSegment(subSegment, segment, draft)
          )
        : [];

      return segment;
    }

    constructor(documentTemplate: EDraftTemplate, draft?: IDraft) {
      if (draft) {
        this.uuid = draft.uuid;
        this.segments = draft.segments;
        this.meta = new DraftMeta();
        this.meta.createdBy = draft.meta.createdBy;
        this.meta.createdAt = draft.meta.createdAt;
        this.meta.update = draft.meta.update;

        this.segments = draft.segments.map((segment) =>
          this.reinitializeSegment(segment, null, this)
        );
      } else {
        this.uuid = uuidv4();
        this.segments = [];
        this.meta = new DraftMeta();

        switch (documentTemplate) {
          case EDraftTemplate["BYD-QA-TMP-0001_01"]:
            {
              const template = draftTemplates["BYD-QA-TMP-0001_01"];

              const _1_ = this.addSegment();
              _1_.content.title = template["1"].title;
              _1_.content.tmpTitle = template["1"].title;

              const _1_1_ = _1_.addSubSegment();
              _1_1_.content.body = template["1"].subSegments["1.1"].body;
              _1_1_.content.tmpBody = template["1"].subSegments["1.1"].body;

              const _1_2_ = _1_.addSubSegment();
              _1_2_.content.body = template["1"].subSegments["1.2"].body;
              _1_2_.content.tmpBody = template["1"].subSegments["1.2"].body;

              const _2_ = this.addSegment();
              _2_.content.title = template["2"].title;
              _2_.content.tmpTitle = template["2"].title;

              const _3_ = this.addSegment();
              _3_.content.title = template["3"].title;
              _3_.content.tmpTitle = template["3"].title;
              _3_.content.body = template["3"].body;
              _3_.content.tmpBody = template["3"].body;

              const _4_ = this.addSegment();
              _4_.content.title = template["4"].title;
              _4_.content.tmpTitle = template["4"].title;

              const _5_ = this.addSegment();
              _5_.content.title = template["5"].title;
              _5_.content.tmpTitle = template["5"].title;

              const _6_ = this.addSegment();
              _6_.content.title = template["6"].title;
              _6_.content.tmpTitle = template["6"].title;
              _6_.content.body = template["6"].body;
              _6_.content.tmpBody = template["6"].body;
            }
            break;

          case EDraftTemplate["PRG-QA-TMP-2202-R04"]:
            {
              const template = draftTemplates["PRG-QA-TMP-2202-R04"];
              const _1_ = this.addSegment();
              _1_.content.title = template["1"].title;
              _1_.content.tmpTitle = template["1"].title;
              const _1_1_ = _1_.addSubSegment();
              _1_1_.content.body = template["1"].subSegments["1.1"].body;
              _1_1_.content.tmpBody = template["1"].subSegments["1.1"].body;
              const _1_2_ = _1_.addSubSegment();
              _1_2_.content.body = template["1"].subSegments["1.2"].body;
              _1_2_.content.tmpBody = template["1"].subSegments["1.2"].body;
              const _1_3_ = _1_.addSubSegment();
              _1_3_.content.body = template["1"].subSegments["1.3"].body;
              _1_3_.content.tmpBody = template["1"].subSegments["1.3"].body;
              const _1_4_ = _1_.addSubSegment();
              _1_4_.content.body = template["1"].subSegments["1.4"].body;
              _1_4_.content.tmpBody = template["1"].subSegments["1.4"].body;

              const _2_ = this.addSegment();
              _2_.content.title = template["2"].title;
              _2_.content.tmpTitle = template["2"].title;
              const _2_1_ = _2_.addSubSegment();
              _2_1_.content.body = template["2"].subSegments["2.1"].body;
              _2_1_.content.tmpBody = template["2"].subSegments["2.1"].body;

              const _3_ = this.addSegment();
              _3_.content.title = template["3"].title;
              _3_.content.tmpTitle = template["3"].title;
              _3_.content.body = template["3"].body;
              _3_.content.tmpBody = template["3"].body;

              const _4_ = this.addSegment();
              _4_.content.title = template["4"].title;
              _4_.content.tmpTitle = template["4"].title;

              const _5_ = this.addSegment();
              _5_.content.title = template["5"].title;
              _5_.content.tmpTitle = template["5"].title;

              const _6_ = this.addSegment();
              _6_.content.title = template["6"].title;
              _6_.content.tmpTitle = template["6"].title;
              _6_.content.body = template["6"].body;
              _6_.content.tmpBody = template["6"].body;
            }
            break;

          default:
            break;
        }
      }
    }
  }
}
