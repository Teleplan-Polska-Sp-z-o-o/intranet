interface Step {
  name: string;
}

interface StepperConfig {
  steps: Record<number, Step>;
  currentStep: number;
}

interface StepperBody {
  windows: Record<number, object>;
}

export class Stepper {
  private header: StepperConfig;
  private body: StepperBody;

  constructor(steps: Record<number, Step>, initialStep: number = 1) {
    const stepKeys = Object.keys(steps).map(Number);

    if (!stepKeys.includes(initialStep)) {
      throw new Error(`Initial step ${initialStep} is not valid.`);
    }

    this.header = {
      steps,
      currentStep: initialStep,
    };

    this.body = {
      windows: stepKeys.reduce((acc, key) => {
        acc[key] = {}; // Initialize each window as an empty object
        return acc;
      }, {} as Record<number, object>),
    };
  }

  // Getters
  get steps() {
    return this.header.steps;
  }

  get currentStep() {
    return this.header.currentStep;
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

  nextStep(): void {
    if (this.nextable) {
      this.header.currentStep++;
    } else {
      throw new Error("Cannot move to the next step. Already at the last step.");
    }
  }

  setStep(step: number): void {
    if (step >= this.minStep && step <= this.maxStep) {
      this.header.currentStep = step;
    } else {
      throw new Error(`Step ${step} is out of bounds.`);
    }
  }

  // Body Management
  getWindow(step: number): object | undefined {
    return this.body.windows[step];
  }

  updateWindow(step: number, data: object): void {
    if (this.body.windows[step] !== undefined) {
      this.body.windows[step] = data;
    } else {
      throw new Error(`No window found for step ${step}.`);
    }
  }
}
