import { DebugElement } from '@angular/core';

type ElementOrDebug = HTMLElement | DebugElement;

function coerceElement(value: ElementOrDebug): HTMLElement {
  if ('nativeElement' in value) {
    return (value as DebugElement).nativeElement as HTMLElement;
  }
  return value;
}

const toContainClasses: jasmine.CustomMatcherFactory = () => {
  return {
    compare(variant: ElementOrDebug, ...expected: string[]) {
      const element = coerceElement(variant);
      const notContainsClasses = [];
      let allContains = true;

      for (const cssClass of expected) {
        if (!element.classList.contains(cssClass)) {
          notContainsClasses.push(cssClass);
          allContains = false;
        }
      }

      const failMessage = `Give element does not contains css classes: ${notContainsClasses.map(
        cssClass => `"${cssClass}"`).join(', ')}.`;

      return {
        pass: allContains,
        message: allContains ? undefined : failMessage,
      };
    },
    negativeCompare(variant: ElementOrDebug, ...expected: string[]) {
      const element = coerceElement(variant);
      const containsClasses = [];
      let allNotContains = true;

      for (const cssClass of expected) {
        if (element.classList.contains(cssClass)) {
          containsClasses.push(cssClass);
          allNotContains = false;
        }
      }

      const failMessage = `Give element contains css classes: ${containsClasses.map(
        cssClass => `"${cssClass}"`).join(', ')}.`;

      return {
        pass: allNotContains,
        message: allNotContains ? undefined : failMessage,
      };
    },
  };
};

const toHaveAttribute: jasmine.CustomMatcherFactory = (util) => {
  return {
    compare(variant: ElementOrDebug, name: string, value: string | null) {
      const element = coerceElement(variant);
      const attr = element.getAttribute(name);

      return {
        pass: util.equals(attr, value),
        message: `Expected "${value}", but actual is "${attr}"`,
      };
    },
    negativeCompare(variant: ElementOrDebug, name: string, value: string | null) {
      const element = coerceElement(variant);
      const attr = element.getAttribute(name);

      return {
        pass: !util.equals(attr, value),
        message: `Expected not "${value}", but actual is "${attr}"`,
      };
    },
  };
};

const toHaveStyle: jasmine.CustomMatcherFactory = (util) => {
  return {
    compare(variant: ElementOrDebug, name: keyof CSSStyleDeclaration, value: string | null) {
      const element = coerceElement(variant);

      return {
        pass: util.equals(element.style[name], value),
        message: `Expect "style.${name}" to be "${value}", but actual is "${element.style[name]}"`,
      };
    },
    negativeCompare(
      variant: ElementOrDebug,
      name: keyof CSSStyleDeclaration,
      value: string | null,
    ) {
      const element = coerceElement(variant);

      return {
        pass: !util.equals(element.style[name], value),
        message: `Expect "style.${name}" not to be "${value}", ` +
          `but actual is "${element.style[name]}"`,
      };
    },
  };
};

interface HasDisabled {
  disabled: boolean;
}

const toBeDisabled: jasmine.CustomMatcherFactory = () => {
  return {
    compare(variant: ElementOrDebug) {
      const element = coerceElement(variant);

      if (!('disabled' in element)) {
        throw new Error('Element doesnt have disabled status');
      }

      const pass = (element as HasDisabled).disabled === true;

      return {
        pass,
        message: pass ? undefined : 'Expect element to be disabled',
      };
    },
    negativeCompare(variant: ElementOrDebug) {
      const element = coerceElement(variant);

      if (!('disabled' in element)) {
        throw new Error('Element doesnt have disabled status');
      }

      const pass = (element as HasDisabled).disabled === false;

      return {
        pass,
        message: pass ? undefined : 'Expect element to not be disabled',
      };
    },
  };
};

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toContainClasses(...cssClasses: string[]): boolean;

      toHaveAttribute(name: string, value: string | null): boolean;

      toHaveStyle(name: keyof CSSStyleDeclaration, value: string | null): boolean;

      toBeDisabled(): boolean;
    }
  }
}

export function useDomMatcher() {
  beforeAll(() => {
    jasmine.addMatchers({
      toContainClasses,
      toHaveAttribute,
      toHaveStyle,
      toBeDisabled,
    });
  });
}
