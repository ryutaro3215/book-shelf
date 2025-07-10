import { expect, test, describe } from "vitest";
import { Home } from "@/pages/Home";
import { Mypage } from "@/components/MyPage";
import LoginForm from "@/components/LoginForm";
import { render, screen } from "@testing-library/react";
import AuthContext from "@/utils/AuthContext";
import { MemoryRouter } from "react-router";

vi.mock("@/components/LoginForm", () => {
  return {
    default: () => <div>Login Form Mock</div>,
  };
});

vi.mock("@/components/MyPage", () => {
  return {
    Mypage: () => <div>MyPage Mock</div>,
  };
});

describe("Home", () => {
  test("renders loading state when auth is loading", () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          loading: true,
          checkAuth: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders LoginForm when user is not authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          checkAuth: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText("Login Form Mock")).toBeInTheDocument();
  });

  test("renders MyPage when user is authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          user: { id: "1", name: "Test User" },
          loading: false,
          checkAuth: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText("MyPage Mock")).toBeInTheDocument();
  });
});
