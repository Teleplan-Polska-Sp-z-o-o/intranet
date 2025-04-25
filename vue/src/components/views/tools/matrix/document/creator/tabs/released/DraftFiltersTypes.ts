import { useI18n } from "vue-i18n";
import { IUser } from "../../../../../../../../interfaces/user/UserTypes";

const tBase = "tools.tcd.drafts";

export enum FilterInputType {
  SWITCH,
  SELECT,
  DATE,
}

export enum FilterKey {
  // OWNER,
  CREATOR = "creator",
  EDITOR = "editor",
  LOCATOR = "locator",
  CREATED = "created",
  UPDATED = "updated",
}

type FilterKeyTypes = {
  [FilterKey.CREATOR]: boolean;
  [FilterKey.EDITOR]: boolean;
  [FilterKey.LOCATOR]: string;
  [FilterKey.CREATED]: string[];
  [FilterKey.UPDATED]: string[];
};

type FilterSideTypes = {
  [FilterKey.CREATOR]: IUser;
  [FilterKey.EDITOR]: IUser;
  [FilterKey.LOCATOR]: null;
  [FilterKey.CREATED]: null;
  [FilterKey.UPDATED]: null;
};

export class BaseFilter<
  K extends FilterKey,
  TMain = FilterKeyTypes[K],
  TSide = FilterSideTypes[K]
> {
  options: {
    key: K;
    inputType: FilterInputType;
    hasSideInput?: boolean;
  };
  mainInput: {
    value: TMain | null;
    previous: TMain | null;
    indeterminate: boolean;
  };
  sideInput: {
    value: TSide | null;
  };
  messages: {
    title: string;
    subtitle: string;
    subtitleMap?: Map<TMain | null, string>;
  };

  constructor(
    options: {
      key: K;
      inputType: FilterInputType;
      hasSideInput?: boolean;
    },
    messages: {
      title: string;
      subtitle: string;
      subtitleMap?: Map<TMain | null, string>;
    }
  ) {
    this.options = options;
    this.mainInput = {
      value: null,
      previous: null,
      indeterminate: true,
    };
    this.sideInput = { value: null };
    this.messages = messages;
  }

  /**
   * mainInput
   *
   * You can use this with any input type
   */
  set(input: TMain | null, log: boolean = false) {
    if (log) console.log(`${this.options.key} - input`, input);
    this.mainInput.previous = this.mainInput.value;
    this.mainInput.value = input;
    this.mainInput.indeterminate = input === null;

    if (this.messages.subtitleMap && this.messages.subtitleMap.get(input) !== undefined)
      this.messages.subtitle = this.messages.subtitleMap.get(input)!;
  }

  /**
   * mainInput
   *
   * Use this only with switch input type
   */
  toggle() {
    if (this.options.inputType === FilterInputType.SWITCH)
      switch (this.mainInput.value) {
        case true:
        case false:
          this.set(null);
          break;
        case null:
          this.set(this.mainInput.previous === true ? (false as TMain) : (true as TMain));
          break;
      }
    else console.warn("Tried to use toggle on non-switch input type.");
  }

  /**
   * sideInput
   *
   * You can use this with any input type
   */
  input(input: TSide | null) {
    this.sideInput = { value: input };
  }
}

export class Creator extends BaseFilter<FilterKey.CREATOR> {
  constructor() {
    const { t } = useI18n();

    const options = {
      key: FilterKey.CREATOR,
      inputType: FilterInputType.SWITCH,
      hasSideInput: true,
    } as const;
    const messages = {
      title: t(`${tBase}.filters.creator.messages.title`),
      subtitle: t(`${tBase}.filters.creator.messages.subtitle`),
      subtitleMap: new Map<boolean | null, string>([
        [true, t(`${tBase}.filters.creator.messages.subtitleMap.true`)],
        [false, t(`${tBase}.filters.creator.messages.subtitleMap.false`)],
        [null, t(`${tBase}.filters.creator.messages.subtitleMap.null`)],
      ]),
    };

    super(options, messages);
  }
}

export class Editor extends BaseFilter<FilterKey.EDITOR> {
  constructor() {
    const { t } = useI18n();

    const options = {
      key: FilterKey.EDITOR,
      inputType: FilterInputType.SWITCH,
      hasSideInput: true,
    } as const;
    const messages = {
      title: t(`${tBase}.filters.editor.messages.title`),
      subtitle: t(`${tBase}.filters.editor.messages.subtitle`),
      subtitleMap: new Map<boolean | null, string>([
        [true, t(`${tBase}.filters.editor.messages.subtitleMap.true`)],
        [false, t(`${tBase}.filters.editor.messages.subtitleMap.false`)],
        [null, t(`${tBase}.filters.editor.messages.subtitleMap.null`)],
      ]),
    };

    super(options, messages);
  }
}

export class Locator extends BaseFilter<FilterKey.LOCATOR> {
  constructor() {
    const { t } = useI18n();

    const options = {
      key: FilterKey.LOCATOR,
      inputType: FilterInputType.SELECT,
    } as const;
    const messages = {
      title: t(`${tBase}.filters.locator.messages.title`),
      subtitle: ``,
    };

    super(options, messages);
  }

  // customSet(tz: string | null) {
  //   console.log("tz", tz);
  //   this.mainInput.previous = this.mainInput.value;
  //   this.mainInput.value = tz;
  //   this.mainInput.indeterminate = tz === null;
  // }
}

export class Created extends BaseFilter<FilterKey.CREATED> {
  constructor() {
    const { t } = useI18n();

    const options = {
      key: FilterKey.CREATED,
      inputType: FilterInputType.DATE,
    } as const;

    const messages = {
      title: t(`${tBase}.filters.created.messages.title`),
      subtitle: ``,
    };

    super(options, messages);
  }

  // customSet(dateRange: string[] | null) {
  //   console.log("created", dateRange);
  //   this.mainInput.previous = this.mainInput.value;
  //   this.mainInput.value = dateRange;
  //   this.mainInput.indeterminate = dateRange === null;
  // }
}
export class Updated extends BaseFilter<FilterKey.UPDATED> {
  constructor() {
    const { t } = useI18n();

    const options = {
      key: FilterKey.UPDATED,
      inputType: FilterInputType.DATE,
    } as const;

    const messages = {
      title: t(`${tBase}.filters.updated.messages.title`),
      subtitle: ``,
    };

    super(options, messages);
  }

  // customSet(dateRange: string[] | null) {
  //   console.log("updated", dateRange);
  //   this.mainInput.previous = this.mainInput.value;
  //   this.mainInput.value = dateRange;
  //   this.mainInput.indeterminate = dateRange === null;
  // }
}

class Filters {
  // owner: Owner;
  locator: Locator;
  creator: Creator;
  editor: Editor;
  created: Created;
  updated: Updated;

  constructor() {
    // this.owner = new Owner();
    this.locator = new Locator();
    this.creator = new Creator();
    this.editor = new Editor();
    this.created = new Created();
    this.updated = new Updated();
  }
}

export class DraftsSearch {
  bar: string;
  filters: Filters;

  constructor() {
    this.bar = "";
    this.filters = new Filters();
  }
}
