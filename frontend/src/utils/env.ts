export function isHeadlessTest(): boolean {
  return typeof navigator !== 'undefined' && navigator.webdriver;
}
