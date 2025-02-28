import { DocumentCreatorManager } from "../../../../../../../../models/document/creator/CreatorManager";
import { components } from "../../../../../../../../plugins/vuetify/components";
import { DraftTypes } from "./DraftTypes";
import { v4 as uuidv4 } from "uuid";
import stringify from "safe-stable-stringify";
import { RouteLocationNormalizedLoaded } from "vue-router";
import moment from "moment-timezone";

export namespace DocumentCreatorStepper {
  export namespace Header {
    export interface IStep {
      name: string;
      editable: boolean;
      complete: boolean;
      color: string;
    }

    export type TStepKey = 1 | 2 | 3;
    export interface IStepperHeader {
      steps: Record<TStepKey, IStep>;
      currentStep: TStepKey;
    }
  }

  export namespace Body {
    export interface IInfo {
      product: string;
      owner: { id: number; name: string } | string | null;
      _lastUpdate: string | null;
      author: { id: number; name: string } | string | null;
      _created: string;
      competences: { id: number; name: string }[] | string[]; // {id: number - id of db obj, name: string - code of db obj}
      esd: 0 | 1; // 0 - false, 1 - true
    }
    export class Info implements IInfo {
      public product: string;
      public owner: { id: number; name: string } | string | null;
      public _lastUpdate: string | null;
      public author: { id: number; name: string } | string | null;
      public _created: string; // ISOString
      public competences: { id: number; name: string }[] | string[];
      public esd: 0 | 1;

      private getCurrentTimeInTZ(tz: string): string {
        const time = moment().tz(tz).toISOString();
        // console.log("getCurrentTimeInTZ", time.toISOString());
        return time;
      }

      constructor(tz: string, obj?: IInfo) {
        this.product = obj && obj.product ? obj.product : "";
        this.owner = obj && obj.owner ? obj.owner : null;
        this._lastUpdate =
          obj && typeof obj._lastUpdate === "string" && !isNaN(new Date(obj._lastUpdate).getTime())
            ? obj._lastUpdate
            : null;
        this.author = obj && obj.author ? obj.author : null;
        this._created =
          obj && !isNaN(new Date(obj._created).getTime())
            ? obj._created
            : this.getCurrentTimeInTZ(tz);
        this.competences = obj && Array.isArray(obj) ? obj.competences : [];
        this.esd = obj && (obj.esd === 0 || obj.esd === 1) ? obj.esd : 0;
      }

      // Getter for 'created'
      public get created(): Date {
        // const date = this._created;

        // const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
        // const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
        // const year = date.getFullYear();

        // `${month}/${day}/${year}`;

        const getCreated = moment(this._created)
          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
          .toDate();

        return getCreated;
      }

      // Setter for 'created' (Ensures it is always stored in the correct TZ)
      public set created(value: string) {
        // if (typeof value === "string") {
        //   this._created = moment
        //     .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
        //     .toDate();
        // }
        // else {
        //   this._created = moment(value)
        //     .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        //     .toISOString();
        // }

        this._created = moment
          .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
          .toISOString();
      }

      // Getter for 'lastUpdate'
      public get lastUpdate(): Date | null {
        const lu =
          typeof this._lastUpdate === "string"
            ? !isNaN(new Date(this._lastUpdate).getTime())
            : false;
        if (lu) {
          const getLastUpdate = moment(this._lastUpdate)
            .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            .toDate();
          return getLastUpdate;
        } else return null;
      }

      // Setter for 'lastUpdate' (Ensures correct TZ conversion)
      public set lastUpdate(value: Date | string | null) {
        if (!value) {
          this._lastUpdate = null;
          return;
        }

        // if (typeof value === "string") {
        //   this._lastUpdate = moment
        //     .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
        //     .toDate();
        // } else {
        //   this._lastUpdate = moment(value)
        //     .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        //     .toDate();
        // }
        this._lastUpdate = moment
          .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
          .toISOString();
      }
    }

    export interface IBefore {
      title: string;
      documentTemplate: string;
      logosTemplate: string[];
      id: string;
      _revision: string;
    }
    export class Before implements IBefore {
      public title: string;
      public documentTemplate: string;
      public logosTemplate: string[];
      public id: string;
      public _revision: string;

      get revision(): number {
        return parseInt(this._revision.replace("R", ""), 10);
      }
      set revision(value: number) {
        if (value < 1) value = 1; // Ensure revision is at least 1
        this._revision = value < 10 ? `R0${value}` : `R${value}`;
      }

      constructor(data?: IBefore) {
        this.title = data?.title ?? "";
        this.documentTemplate = data?.documentTemplate ?? "";
        this.logosTemplate = data?.logosTemplate ?? [];
        this.id = data?.id ?? "";
        this._revision = data?._revision ?? "R01";
      }
    }

    export interface IWindows {
      [key: number]: {
        model: IInfo | IBefore | DraftTypes.IDraft;
        form: components.VForm | null;
      };
      1: {
        model: Info;
        form: components.VForm | null;
      };
      2: {
        model: Before;
        form: components.VForm | null;
      };
      3: {
        model: DraftTypes.Draft;
        form: components.VForm | null;
      };
    }
    export interface IStepperBody {
      windows: IWindows;
    }
  }

  export enum EStepperType {
    INSTRUCTION = "instruction",
  }

  interface IVuetifyValidation {
    valid: boolean;
    errors: {
      id: number | string;
      errorMessages: string[];
    }[];
  }

  export interface IStepperProperties {
    uuid: string;
    tz: string;
    _name: string;
    type: EStepperType;
    _documentTitle: string;
    _documentIdRevision: string;
    header: Header.IStepperHeader;
    body: Body.IStepperBody;
  }

  export type IStepper = IStepperProperties & {
    // uuid: string;
    // tz: string;
    // _name: string;
    // type: EStepperType;
    // _documentTitle: string;
    // _documentIdRevision: string;
    // header: DocumentCreatorStepper.Header.IStepperHeader;
    // body: DocumentCreatorStepper.Body.IStepperBody;

    get name(): string;
    set name(name: string);
    get steps(): Record<
      DocumentCreatorStepper.Header.TStepKey,
      DocumentCreatorStepper.Header.IStep
    >;
    get currentStep(): DocumentCreatorStepper.Header.TStepKey;
    set currentStep(step: DocumentCreatorStepper.Header.TStepKey);

    get minStep(): number;
    get maxStep(): number;
    get prevable(): boolean;
    get nextable(): boolean;

    prevStep(): void;
    validateForm(
      form: components.VForm | null,
      step: Header.TStepKey
    ): Promise<IVuetifyValidation | undefined>;
    nextStep(): Promise<void>;
    setStep(step: DocumentCreatorStepper.Header.TStepKey): void;
    getWindow<T extends keyof Body.IWindows>(step: T): Body.IWindows[T];
    updateWindow<T extends keyof Body.IWindows>(step: T, data: Body.IWindows[T]): void;
    save(name: string, route?: RouteLocationNormalizedLoaded): Promise<any>;
  };

  export class InstructionStepper implements IStepper {
    readonly uuid: string;
    readonly tz: string;
    readonly type: EStepperType = EStepperType.INSTRUCTION;
    _name: string;
    _documentTitle: string;
    _documentIdRevision: string;

    get name(): string {
      return this._name;
    }

    set name(name: string) {
      this._name = name;
    }

    header: Header.IStepperHeader;
    body: Body.IStepperBody;

    constructor(
      stepper?: IStepperProperties
      //   {
      //   body: Body.IStepperBody;
      //   header: Header.IStepperHeader;
      //   uuid: string;
      //   tz: string;
      //   _name: string;
      //   type: string;
      //   _documentTitle: string;
      //   _documentIdRevision: string;
      // }
    ) {
      if (!stepper) {
        this.uuid = uuidv4();
        this.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this._name = "";
        this._documentTitle = "";
        this._documentIdRevision = "";

        const newInfo = new Body.Info(this.tz);
        const newBefore = new Body.Before();
        const newDraft = new DraftTypes.Draft();

        this.body = {
          windows: {
            1: {
              model: newInfo,
              form: null,
            },
            2: {
              model: newBefore,
              form: null,
            },
            3: {
              model: newDraft,
              form: null,
            },
          },
        };

        this.header = {
          steps: {
            1: { name: "Info", editable: false, complete: false, color: "" },
            2: { name: "Before", editable: false, complete: false, color: "" },
            3: { name: "Content", editable: false, complete: false, color: "" },
          },
          currentStep: 1,
        };
      } else {
        this.uuid = stepper.uuid;
        this.tz = stepper.tz;
        this._name = stepper._name;

        // additions
        this._documentTitle = stepper._documentTitle ?? "";
        if (!this.type) this.type = EStepperType.INSTRUCTION;
        this._documentIdRevision = stepper._documentIdRevision ?? "";

        stepper.body.windows[1].model = new Body.Info(this.tz, stepper.body.windows[1].model);
        stepper.body.windows[2].model = new Body.Before(stepper.body.windows[2].model);
        stepper.body.windows[3].model = new DraftTypes.Draft(stepper.body.windows[3].model);

        this.body = stepper.body;
        this.header = stepper.header;
      }
    }

    // Getters
    get steps(): Record<Header.TStepKey, Header.IStep> {
      return this.header.steps;
    }

    get currentStep(): Header.TStepKey {
      return this.header.currentStep;
    }
    set currentStep(step: DocumentCreatorStepper.Header.TStepKey) {
      this.header.currentStep = step;
    }

    get minStep(): number {
      return Math.min(...Object.keys(this.header.steps).map(Number));
    }

    get maxStep(): number {
      return Math.max(...Object.keys(this.header.steps).map(Number));
    }

    get prevable(): boolean {
      return this.currentStep > this.minStep;
    }

    get nextable(): boolean {
      return this.currentStep < this.maxStep;
    }

    // Navigation Methods
    prevStep(): void {
      if (this.prevable) {
        this.header.currentStep--;
      } else {
        throw new Error("Cannot move to a previous step. Already at the first step.");
      }
    }

    async validateForm(
      form: components.VForm | null,
      step: Header.TStepKey
    ): Promise<IVuetifyValidation | undefined> {
      // const currentStep = this.currentStep;

      if (form) {
        const validation: IVuetifyValidation = await form.validate();
        if (!validation.valid) {
          this.header.steps[step] = {
            ...this.header.steps[step],
            editable: true,
            complete: false,
            color: "warning",
          };
        } else {
          this.header.steps[step] = {
            ...this.header.steps[step],
            editable: false,
            complete: true,
            color: "secondary",
          };
        }

        return validation;
      } else return undefined;
    }

    async nextStep(): Promise<void> {
      if (this.nextable) {
        const currentStep = this.currentStep;
        const currentForm = this.getWindow(currentStep).form;

        if (currentForm) {
          await this.validateForm(currentForm, currentStep);
          // this.getWindow(currentStep).model = { ...currentForm.$data } as any;

          this.header.currentStep++;
        }
      } else {
        throw new Error("Cannot move to the next step. Already at the last step.");
      }
    }

    setStep(step: DocumentCreatorStepper.Header.TStepKey): void {
      if (step >= this.minStep && step <= this.maxStep) {
        this.header.currentStep = step;
      } else {
        throw new Error(`Step ${step} is out of bounds.`);
      }
    }

    // Body Management
    getWindow<T extends keyof Body.IWindows>(step: T): Body.IWindows[T] {
      return this.body.windows[step];
    }

    updateWindow<T extends keyof Body.IWindows>(step: T, data: Body.IWindows[T]): void {
      if (this.body.windows[step] !== undefined) {
        this.body.windows[step] = data;
      } else {
        throw new Error(`No window found for step ${step}.`);
      }
    }

    async save(name: string, route?: RouteLocationNormalizedLoaded): Promise<any> {
      this._name = name;
      const beforeModel = this.getWindow(2).model;
      this._documentTitle = beforeModel.title;
      this._documentIdRevision =
        beforeModel.id && beforeModel.revision ? `${beforeModel.id}-${beforeModel.revision}` : "";

      const steps: DocumentCreatorStepper.Header.TStepKey[] = [1, 2, 3];
      for (const step of steps) {
        const window = this.body.windows[step];
        if (window && window.form) {
          window.form = null;
        }
      }

      const formData: FormData = new FormData();
      this.header.steps[3].editable = true;
      this.header.steps[3].complete = false;
      this.header.steps[3].color = "info";
      this.setStep(1);

      formData.append("stepper", stringify(this));

      if (route && route.params && route.params.id.length > 0) {
        const param = route.params.id;
        const id = Number(Array.isArray(param) ? param.at(0) : param);
        return new DocumentCreatorManager().put(id, formData, true);
      } else {
        return new DocumentCreatorManager().post(formData, true);
      }
    }
  }

  export class StepperFactory {
    static createStepper(
      type: EStepperType,
      stepperData?: IStepperProperties
      // {
      //   body: DocumentCreatorStepper.Body.IStepperBody;
      //   header: DocumentCreatorStepper.Header.IStepperHeader;
      //   uuid: string;
      //   tz: string;
      //   _name: string;
      //   type: string;
      //   _documentTitle: string;
      //   _documentIdRevision: string;
      // }
    ): IStepper {
      switch (type) {
        case EStepperType.INSTRUCTION:
          return new InstructionStepper(stepperData);
        default:
          throw new Error(`Unsupported stepper type: ${type}`);
      }
    }
  }
}
