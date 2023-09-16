// global.ts
let _extensionPath: string = '';

export function setExtensionPath(path: string) {
  _extensionPath = path;
}

export function getExtensionPath() {
  return _extensionPath;
}
