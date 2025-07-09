import "@testing-library/jest-dom";

// Setup JSDOM for React Testing Library in Node environment
import { JSDOM } from "jsdom";

// Mock performance API first
(global as any).performance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntries: (): any[] => [],
  getEntriesByName: (): any[] => [],
  getEntriesByType: (): any[] => [],
  clearMarks: () => {},
  clearMeasures: () => {},
  timeOrigin: 0,
};

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

function copyProps(src: any, target: any) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = {
  userAgent: "node.js",
};
(global as any).requestAnimationFrame = function (callback: any) {
  return setTimeout(callback, 0);
};
(global as any).cancelAnimationFrame = function (id: any) {
  clearTimeout(id);
};
copyProps(window, global);

// Mock for file imports
jest.mock("*.jpg", () => "test-file-stub");
jest.mock("*.png", () => "test-file-stub");

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});
