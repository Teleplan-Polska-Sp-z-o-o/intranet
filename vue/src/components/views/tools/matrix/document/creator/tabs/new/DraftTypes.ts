import { IUserEntity } from "../../../../../../../../interfaces/user/IUserEntity";
import { SimpleUser } from "../../../../../../../../models/user/SimpleUser";
import { useUserStore } from "../../../../../../../../stores/userStore";

import moment from "moment";
import { v4 as uuidv4 } from "uuid";

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
      const cleanValue = value.replace(/<([a-z][a-z0-9]*)\s*>\s*<\/\1>/gi, "").trim();
      // this._tmpBody = cleanValue;
      // this.updateIsSaved();
      this.body = cleanValue;
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

  interface IDraft {
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

    constructor(draft?: IDraft) {
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

        const _1_ = this.addSegment();
        _1_.content.title = "REQUIRED PPE";
        _1_.content.tmpTitle = "REQUIRED PPE";
        const firstSubSegment = _1_.addSubSegment();
        firstSubSegment.content.title = "Individual PPE Distribution";
        firstSubSegment.content.tmpTitle = "Individual PPE Distribution";
        firstSubSegment.content.body =
          "<p>We understand individual PPE as PPE that is issued by the leader individually to each operator against a signature.</p>";
        firstSubSegment.content.tmpBody =
          "<p>We understand individual PPE as PPE that is issued by the leader individually to each operator against a signature.</p>";

        const secondSubSegment = _1_.addSubSegment();
        secondSubSegment.content.title = "Collective PPE Usage";
        secondSubSegment.content.tmpTitle = "Collective PPE Usage";
        secondSubSegment.content.body =
          '<p>We understand collective PPE as a PPE that is still available at the station, for example a face shield, which we properly clean after use and put back in position, or it can be disposable aids such as nitrile gloves or ear plugs.</p><table class="table-wrapper" style="min-width: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>PPE</strong></p></th><th colspan="1" rowspan="1"><p><strong>Mandatory / Recommended</strong></p></th><th colspan="1" rowspan="1"><p><strong>Individual / Collective</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr><tr><td colspan="3" rowspan="1"><p><strong>Legend</strong></p></td></tr><tr><td colspan="3" rowspan="1"><p>Mandatory – Required at all times</p></td></tr><tr><td colspan="3" rowspan="1"><p>Recommended – Suggested for safety</p></td></tr><tr><td colspan="3" rowspan="1"><p>Individual – Worn by each person</p></td></tr><tr><td colspan="3" rowspan="1"><p>Collective – Shared at workstations</p></td></tr></tbody></table>';
        secondSubSegment.content.tmpBody =
          '<p>We understand collective PPE as a PPE that is still available at the station, for example a face shield, which we properly clean after use and put back in position, or it can be disposable aids such as nitrile gloves or ear plugs.</p><table class="table-wrapper" style="min-width: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>PPE</strong></p></th><th colspan="1" rowspan="1"><p><strong>Mandatory / Recommended</strong></p></th><th colspan="1" rowspan="1"><p><strong>Individual / Collective</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr><tr><td colspan="3" rowspan="1"><p><strong>Legend</strong></p></td></tr><tr><td colspan="3" rowspan="1"><p>Mandatory – Required at all times</p></td></tr><tr><td colspan="3" rowspan="1"><p>Recommended – Suggested for safety</p></td></tr><tr><td colspan="3" rowspan="1"><p>Individual – Worn by each person</p></td></tr><tr><td colspan="3" rowspan="1"><p>Collective – Shared at workstations</p></td></tr></tbody></table>';

        const _2_ = this.addSegment();
        _2_.content.title = "QUALITY CONTROL";
        _2_.content.tmpTitle = "QUALITY CONTROL";

        const _3_ = this.addSegment();
        _3_.content.title = "WORK TOOLS AND ALLOWED CHEMICALS";
        _3_.content.tmpTitle = "WORK TOOLS AND ALLOWED CHEMICALS";
        _3_.content.body =
          '<table class="table-wrapper" style="min-width: 50px"><colgroup><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>DESCRIPTION</strong></p></th><th colspan="1" rowspan="1"><p><strong>LINK, NOTE</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>';
        _3_.content.tmpBody =
          '<table class="table-wrapper" style="min-width: 50px"><colgroup><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>DESCRIPTION</strong></p></th><th colspan="1" rowspan="1"><p><strong>LINK, NOTE</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>';

        const _4_ = this.addSegment();
        _4_.content.title = "WORK INSTRUCTIONS";
        _4_.content.tmpTitle = "WORK INSTRUCTIONS";

        const _5_ = this.addSegment();
        _5_.content.title = "VERIFY";
        _5_.content.tmpTitle = "VERIFY";

        const _6_ = this.addSegment();
        _6_.content.title = "CHANGE HISTORY";
        _6_.content.tmpTitle = "CHANGE HISTORY";
        _6_.content.body =
          '<table translate="no" class="table-wrapper" style="min-width: 125px"><colgroup><col><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Revision</strong></p></th><th colspan="1" rowspan="1"><p><strong>Revision Date</strong></p></th><th colspan="1" rowspan="1"><p><strong>ECN# - Description of change</strong></p></th><th colspan="1" rowspan="1"><p><strong>Change Author</strong></p></th><th colspan="1" rowspan="1"><p><strong>Affected Pages</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>';
        _6_.content.tmpBody =
          '<table translate="no" class="table-wrapper" style="min-width: 125px"><colgroup><col><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><strong>Revision</strong></p></th><th colspan="1" rowspan="1"><p><strong>Revision Date</strong></p></th><th colspan="1" rowspan="1"><p><strong>ECN# - Description of change</strong></p></th><th colspan="1" rowspan="1"><p><strong>Change Author</strong></p></th><th colspan="1" rowspan="1"><p><strong>Affected Pages</strong></p></th></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr></tbody></table>';
      }
    }
  }
}
