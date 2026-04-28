export class ElementResolver {
  static resolve(selector: string): HTMLElement | null {
    try {
      return document.querySelector(selector) as HTMLElement | null;
    } catch (e) {
      console.error(`Invalid selector: ${selector}`, e);
      return null;
    }
  }

  static getBoundingClientRect(element: HTMLElement) {
    return element.getBoundingClientRect();
  }
}
