jest.mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: (fn: jest.Mock) => fn,
    formState: { errors: {} },
    register: jest.fn(),
  }),
}));
