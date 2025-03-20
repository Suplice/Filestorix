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
jest.mock("@/hooks/use-modal");
jest.mock("@tanstack/react-query");
