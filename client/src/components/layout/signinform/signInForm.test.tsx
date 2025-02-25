import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SigninForm from "@/components/layout/signinform/signinform";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

describe("SigninForm Component", () => {
  let mockHandleLoginWithEmail: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockHandleLoginWithEmail = jest.fn().mockResolvedValue({});
    mockRouterPush = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      handleLoginWithEmail: mockHandleLoginWithEmail,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  test("navigates to signup page when 'Sign Up' button is clicked", () => {
    render(<SigninForm />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockRouterPush).toHaveBeenCalledWith("/auth/signup");
  });

  test("does not submit form when email and password are empty", async () => {
    render(<SigninForm />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockHandleLoginWithEmail).not.toHaveBeenCalled();
    });
  });

  test("submits form when valid email and password are provided", async () => {
    render(<SigninForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockHandleLoginWithEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123!",
      });
    });
  });
});
