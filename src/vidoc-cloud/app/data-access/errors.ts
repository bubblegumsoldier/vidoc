export class ProjectUpgradeRequiredError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = 'ProjectUpgradeRequiredError';
  
      // Set the prototype explicitly (important for instanceof to work correctly).
      Object.setPrototypeOf(this, ProjectUpgradeRequiredError.prototype);
    }
  }
  