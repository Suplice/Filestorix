import "@testing-library/jest-dom";

jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");

  return {
    ...actual,
    useRouter: jest.fn(actual.useRouter),
  };
});

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(actual.useForm),
  };
});

jest.mock("@/hooks/use-file-actions");
jest.mock("@/hooks/use-file-previews");
jest.mock("@/hooks/use-modal");
jest.mock("@/hooks/use-file");
jest.mock("@tanstack/react-query");

beforeAll(() => {
  global.matchMedia =
    global.matchMedia ||
    jest.fn(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
});

beforeAll(() => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
    takeRecords: jest.fn(),
  }));
});

beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});
