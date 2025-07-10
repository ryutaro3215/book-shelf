import { expect, test, describe } from "vitest";
import LoginForm from "@/components/LoginForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("LoginForm", () => {
  test("renders login form, email, password, login button, password reset button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /forget password\?/i }),
    ).toBeInTheDocument();
  });

  test("Is Error message for email and password displayed when input is invalid", async () => {
    render(<LoginForm />);

    //Simulate user input
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    //input invalid email and password
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "123");
    await userEvent.click(submitButton);

    //Check for error messages
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Password must be at least 6 characters/i),
    ).toBeInTheDocument();
  });

  test("Is onSubmit function called with valid input and firing function", async () => {
    // Mock console.log to verify form submission
    render(<LoginForm />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByRole("button", { name: "Logging in..." }),
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "Login" }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
