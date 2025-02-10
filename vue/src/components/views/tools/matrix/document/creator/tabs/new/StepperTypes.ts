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
      _lastUpdate: Date | null;
      author: { id: number; name: string } | string | null;
      _created: Date;
      competences: { id: number; name: string }[] | string[]; // {id: number - id of db obj, name: string - code of db obj}
      esd: 0 | 1; // 0 - false, 1 - true
    }
    export class Info implements IInfo {
      public product: string = "";
      public owner: { id: number; name: string } | string | null = null;
      public _lastUpdate: Date | null = null;
      public author: { id: number; name: string } | string | null = null;
      public _created: Date;
      public competences: { id: number; name: string }[] | string[] = [];
      public esd: 0 | 1 = 0;

      private getCurrentTimeInTZ(tz: string): Date {
        // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return moment().tz(tz).toDate(); // Ensures date is always in user's time zone
      }

      constructor(tz: string, obj?: IInfo) {
        this.product = obj?.product ?? "";
        this.owner = obj?.owner ?? null;
        this._lastUpdate = obj?._lastUpdate ?? null;
        this.author = obj?.author ?? null;
        this._created = obj?._created ?? this.getCurrentTimeInTZ(tz);
        this.competences = obj?.competences ?? [];
        this.esd = obj?.esd ?? 0;
      }

      // Getter for 'created'
      public get created(): Date {
        return this._created;
      }

      // Setter for 'created' (Ensures it is always stored in the correct TZ)
      public set created(value: Date | string) {
        if (typeof value === "string") {
          this._created = moment
            .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .toDate();
        } else {
          this._created = moment(value)
            .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            .toDate();
        }
      }

      // Getter for 'lastUpdate'
      public get lastUpdate(): Date | null {
        return this._lastUpdate;
      }

      // Setter for 'lastUpdate' (Ensures correct TZ conversion)
      public set lastUpdate(value: Date | string | null) {
        if (!value) {
          this._lastUpdate = null;
          return;
        }

        if (typeof value === "string") {
          this._lastUpdate = moment
            .tz(value, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .toDate();
        } else {
          this._lastUpdate = moment(value)
            .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            .toDate();
        }
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
        model: Info | Before | DraftTypes.Draft;
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
      // 4: {
      //   model: null;
      //   form: components.VForm | null;
      // };
    }
    export interface IStepperBody {
      windows: IWindows;
    }
  }

  export interface IBaseStepper {
    uuid: string;
    tz: string;
    _name: string;
    header: DocumentCreatorStepper.Header.IStepperHeader;
    body: DocumentCreatorStepper.Body.IStepperBody;
  }

  export class Stepper implements IBaseStepper {
    readonly uuid: string;
    readonly tz: string;

    _name: string = "";
    get name(): string {
      return this._name;
    }

    header: Header.IStepperHeader;
    body: Body.IStepperBody;

    // header: Header.IStepperHeader = {
    //   steps: {
    //     1: {
    //       name: "Info",
    //       editable: false,
    //       complete: false,
    //       color: "",
    //     },
    //     2: {
    //       name: "Before",
    //       editable: false,
    //       complete: false,
    //       color: "",
    //     },
    //     3: {
    //       name: "Content",
    //       editable: false,
    //       complete: false,
    //       color: "",
    //     },
    //   },
    //   currentStep: 1,
    // };

    // body: Body.IStepperBody = {
    //   windows: {
    //     1: {
    //       model: new Body.Info(this.tz),
    //       form: null,
    //     },
    //     2: {
    //       model: new Body.Before(),
    //       form: null,
    //     },
    //     3: { model: new DraftTypes.Draft(), form: null },
    //     // 4: { model: null, form: null },
    //   },
    // };

    constructor(stepper?: {
      body: Body.IStepperBody;
      header: Header.IStepperHeader;
      uuid: string;
      tz: string;
      _name: string;
    }) {
      if (!stepper) {
        this.uuid = uuidv4();
        this.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        this.body = {
          windows: {
            1: {
              model: new Body.Info(this.tz),
              form: null,
            },
            2: {
              model: new Body.Before(),
              form: null,
            },
            3: {
              model: new DraftTypes.Draft(),
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

        stepper.body.windows[1].model = new Body.Info(this.tz, stepper.body.windows[1].model);
        stepper.body.windows[2].model = new Body.Before(stepper.body.windows[2].model);
        stepper.body.windows[3].model = new DraftTypes.Draft(stepper.body.windows[3].model);

        this.body = stepper.body;
        this.header = stepper.header;
      }
    }

    // Getters
    get steps() {
      return this.header.steps;
    }

    get currentStep() {
      return this.header.currentStep;
    }
    set currentStep(step: DocumentCreatorStepper.Header.TStepKey) {
      this.header.currentStep = step;
    }

    get minStep() {
      return Math.min(...Object.keys(this.header.steps).map(Number));
    }

    get maxStep() {
      return Math.max(...Object.keys(this.header.steps).map(Number));
    }

    get prevable() {
      return this.currentStep > this.minStep;
    }

    get nextable() {
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

    async validateForm(form: components.VForm | null) {
      const currentStep = this.currentStep;

      if (form) {
        const validation: {
          valid: boolean;
          errors: {
            id: number | string;
            errorMessages: string[];
          }[];
        } = await form.validate();
        if (!validation.valid) {
          this.header.steps[currentStep].editable = true;
          this.header.steps[currentStep].complete = false;
          this.header.steps[currentStep].color = "warning";
        } else {
          this.header.steps[currentStep].editable = false;
          this.header.steps[currentStep].complete = true;
          this.header.steps[currentStep].color = "secondary";
        }

        return validation;
      }
    }

    async nextStep(): Promise<void> {
      if (this.nextable) {
        const currentStep = this.currentStep;
        const currentForm = this.getWindow(currentStep).form;
        await this.validateForm(currentForm);

        this.header.currentStep++;
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

    public save = async (name: string, route?: RouteLocationNormalizedLoaded): Promise<any> => {
      this._name = name;

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
    };

    public preview = async (): Promise<any> => {};
  }
}
