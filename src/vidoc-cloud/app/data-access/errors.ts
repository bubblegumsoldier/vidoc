export class ProjectUpgradeRequiredError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ProjectUpgradeRequiredError";

    // Set the prototype explicitly (important for instanceof to work correctly).
    Object.setPrototypeOf(this, ProjectUpgradeRequiredError.prototype);
  }
}

export class UserNotFound extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    this.name = "UserNotFound";
    Object.setPrototypeOf(this, UserNotFound.prototype); // Restore prototype chain
  }
}
