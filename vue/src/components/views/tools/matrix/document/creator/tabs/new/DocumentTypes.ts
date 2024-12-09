import { IUserEntity } from "../../../../../../../../interfaces/user/IUserEntity";
import { SimpleUser } from "../../../../../../../../models/user/SimpleUser";
import { useUserStore } from "../../../../../../../../stores/userStore";

import moment from "moment";
import { v4 as uuidv4 } from "uuid";

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
  segmentUuid: string;
  title: string;
  tmpTitle: string;
  body: string;
  tmpBody: string;
}

class SegmentContent implements ISegmentContent {
  segmentUuid: string;
  title: string = "";
  tmpTitle: string = "";
  body: string = "";
  tmpBody: string = "";

  constructor(uuid: string) {
    this.segmentUuid = uuid;
  }

  update(tmpTitle: string, tmpBody: string): void {
    this.tmpTitle = tmpTitle;
    this.tmpBody = tmpBody;
  }

  save(meta: Meta): void {
    if (this.title && this.title !== this.tmpTitle)
      meta.performUpdate(`${this.segmentUuid} (Segment, Content) - Title`, this.title);
    this.title = this.tmpTitle ?? "";

    if (this.body && this.body !== this.tmpBody)
      meta.performUpdate(`${this.segmentUuid} (Segment, Content) - Body`, this.body);
    this.body = this.tmpBody ?? "";
  }
}

interface IBaseSegment {
  uuid: string;
  meta: Meta;
  content: SegmentContent;
}

interface ISegmentRelationship {
  segmentIndex: string;
  draft: Draft | null;
  parent: Segment | null;
  subSegments: Segment[];
}

class Segment implements IBaseSegment, ISegmentRelationship {
  uuid: string = uuidv4();
  meta: Meta = new Meta();
  content: SegmentContent = new SegmentContent(this.uuid);
  position: number;
  segmentIndex: string = "";
  draft: Draft | null = null;
  parent: Segment | null = null;
  subSegments: Segment[] = [];

  constructor(parent: Segment | null = null, draft: Draft | null = null) {
    this.draft = draft;
    this.parent = parent;
    this.position = parent ? parent.subSegments.length + 1 : 1;
    this.segmentIndex = this.generateIndex();
  }

  private generateIndex(): string {
    if (this.parent) {
      // Generate index based on parent segment
      const parentIndex = this.parent.segmentIndex;
      const siblingCount = this.parent.subSegments.length; // Current sibling count
      return `${parentIndex}.${siblingCount + 1}`;
    } else if (this.draft) {
      // Generate index for root segments in the Draft
      const siblingCount = this.draft.segments.length; // Count segments in the Draft
      return `${siblingCount + 1}`;
    } else
      throw Error(
        `'generateIndex() at 'constructor()' at Segment parent and draft evaluate to null.`
      );
  }

  private updateSegmentIndexes() {
    // Recalculate segmentIndex for all siblings and their descendants
    const siblings = this.parent ? this.parent.subSegments : this.draft?.segments;
    if (!siblings) return;

    siblings.sort((a, b) => a.position - b.position); // Ensure order by position
    siblings.forEach((sibling, index) => {
      sibling.position = index + 1; // Update position
      sibling.segmentIndex = sibling.generateIndex();
      sibling.updateDescendantIndexes(); // Update indexes for all descendants
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

  public insertSegment(referenceSegment: Segment, position: "before" | "after"): Segment {
    const siblings = referenceSegment.parent
      ? referenceSegment.parent.subSegments
      : referenceSegment.draft?.segments;
    if (!siblings) throw new Error("Cannot insert segment: No siblings found.");

    const referenceIndex = siblings.findIndex((s) => s.uuid === referenceSegment.uuid);
    if (referenceIndex === -1) throw new Error("Reference segment not found.");

    const newSegment = new Segment(referenceSegment.parent, referenceSegment.draft);
    if (position === "before") {
      siblings.splice(referenceIndex, 0, newSegment);
    } else if (position === "after") {
      siblings.splice(referenceIndex + 1, 0, newSegment);
    }

    this.updateSegmentIndexes(); // Update all indexes and positions
    return newSegment;
  }

  public removeSegment(referenceSegment: Segment): void {
    const siblings = referenceSegment.parent
      ? referenceSegment.parent.subSegments
      : referenceSegment.draft?.segments;
    if (!siblings) throw new Error("Cannot remove segment: No siblings found.");

    const referenceIndex = siblings.findIndex((s) => s.uuid === referenceSegment.uuid);
    if (referenceIndex !== -1) {
      siblings.splice(referenceIndex, 1); // Remove the segment
      if (referenceSegment.parent) {
        referenceSegment.parent.updateSegmentIndexes(); // Update parent and siblings
      } else {
        this.updateSegmentIndexes(); // Update root segments
      }
    }
  }

  public updateContent(tmpTitle: string, tmpBody: string) {
    this.content.update(tmpTitle, tmpBody);
  }
  public saveContent() {
    this.content.save(this.meta);
  }
}

interface IDraftContent {
  draftUuid: string;

  title: string;
  product: string;
  owner: string;
  CompetenceCodes: string[];

  tmpTitle: string;
  tmpProduct: string;
  tmpOwner: string;
  tmpCompetenceCodes: string[];

  update(
    tmpTitle: string,
    tmpProduct: string,
    tmpOwner: string,
    tmpCompetenceCodes: string[]
  ): void;

  save(meta: Meta): void;
}

class DraftContent implements IDraftContent {
  draftUuid: string;
  // Required keys
  title: string = "";
  product: string = "";
  owner: string = "";
  CompetenceCodes: string[] = [];

  // Temporary keys for updates
  tmpTitle: string = "";
  tmpProduct: string = "";
  tmpOwner: string = "";
  tmpCompetenceCodes: string[] = [];

  constructor(uuid: string) {
    this.draftUuid = uuid;
  }

  update(
    tmpTitle: string,
    tmpProduct: string,
    tmpOwner: string,
    tmpCompetenceCodes: string[]
  ): void {
    this.tmpTitle = tmpTitle;
    this.tmpProduct = tmpProduct;
    this.tmpOwner = tmpOwner;
    this.tmpCompetenceCodes = tmpCompetenceCodes;
  }

  save(meta: Meta): void {
    if (this.title && this.title !== this.tmpTitle) {
      meta.performUpdate(`${this.draftUuid} (Draft, Content) - Title`, this.title);
      this.title = this.tmpTitle ?? "";
    }

    if (this.product && this.product !== this.tmpProduct) {
      meta.performUpdate(`${this.draftUuid} (Draft, Content) - Product`, this.product);
      this.product = this.tmpProduct ?? "";
    }

    if (this.owner && this.owner !== this.tmpOwner) {
      meta.performUpdate(`${this.draftUuid} (Draft, Content) - Owner`, this.owner);
      this.owner = this.tmpOwner ?? "";
    }

    if (
      this.CompetenceCodes &&
      JSON.stringify(this.CompetenceCodes) !== JSON.stringify(this.tmpCompetenceCodes)
    ) {
      meta.performUpdate(
        `${this.draftUuid} (Draft, Content) - CompetenceCodes`,
        JSON.stringify(this.CompetenceCodes)
      );
      this.CompetenceCodes = [...this.tmpCompetenceCodes];
    }
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
    if (!user) throw new Error("'info()' from useUserStore at 'performUpdate()' resolve to false.");

    this.update.push({
      by: new SimpleUser().build(user),
      at: moment().toISOString(),
      of,
      old,
    });
  }
}

export class Draft {
  uuid: string = uuidv4();
  content: DraftContent = new DraftContent(this.uuid);
  segments: Segment[] = []; // Top-level segments
  meta: DraftMeta = new DraftMeta();

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
}
