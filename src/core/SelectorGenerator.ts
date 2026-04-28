export class SelectorGenerator {
  static generate(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;
    
    // Приоритет специальным атрибутам (часто в Vue/React)
    const priorityAttrs = ['data-test', 'data-testid', 'data-qa', 'data-guide', 'name'];
    for (const attr of priorityAttrs) {
      const val = el.getAttribute(attr);
      if (val) return `[${attr}="${val}"]`;
    }

    // Поиск по классам (фильтруем динамические классы Tailwind/Vue)
    if (el.classList.length > 0) {
      const classes = Array.from(el.classList)
        .filter(c => !c.includes('hover:') && !c.includes('focus:') && !c.startsWith('v-'))
        .join('.');
      if (classes) return `${el.tagName.toLowerCase()}.${classes}`;
    }

    // Если ничего нет, идем по дереву (упрощенно)
    return el.tagName.toLowerCase();
  }
}
