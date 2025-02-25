import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpForm from "@/components/layout/signupform/signupform";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

describe("SignUpForm Component", () => {
  let mockHandleRegisterWithEmail: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockHandleRegisterWithEmail = jest.fn().mockResolvedValue({});
    mockRouterPush = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      handleRegisterWithEmail: mockHandleRegisterWithEmail,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  test("renders compoennt successfully", async () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  test("router pushes correct route after signing up", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testEmail@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign Up",
      })
    );

    await waitFor(() => {
      expect(mockHandleRegisterWithEmail).toHaveBeenCalledWith({
        email: "testEmail@gmail.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });
    });
  });

  test("router pushes correct route after signing up", async () => {
    render(<SignUpForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign Up",
      })
    );

    await waitFor(() => {
      expect(mockHandleRegisterWithEmail).not.toHaveBeenCalled();
    });
  });

  test("Error for email, password and confirm passwords is visible after incorrect data ", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "test" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "tes3" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign Up",
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is too short/i)).toBeInTheDocument();
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test("navigates to Sign In page when `Sign In` button is clicked", async () => {
    render(<SignUpForm />);

    const SignInButton = screen.getByText(/Sign in/i);

    expect(SignInButton).toBeInTheDocument();

    fireEvent.click(SignInButton);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/auth/signin");
    });
  });
});
