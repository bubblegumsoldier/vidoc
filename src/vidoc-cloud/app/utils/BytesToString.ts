export default class BytesToString {
  private static readonly BYTE_UNITS = ["bytes", "KB", "MB", "GB", "TB"];

  public static convert(bytes: number): string {
    if (bytes === 0) return "0 bytes";

    // Find the appropriate unit by dividing the bytes by 1024 multiple times until
    // it gets to a reasonable size.
    let magnitude = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      this.BYTE_UNITS.length - 1
    );

    // Calculate the adjusted value.
    let adjustedValue = bytes / Math.pow(1024, magnitude);

    // Format to at most 1 decimal place and add the unit.
    return `${adjustedValue.toFixed(1)} ${this.BYTE_UNITS[magnitude]}`.replace(
      ".0",
      ""
    ); // Remove .0 if there's no meaningful decimal.
  }
}
