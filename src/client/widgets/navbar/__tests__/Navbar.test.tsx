import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Navbar } from "../ui/Navbar";
import { type AuthenticatedUser, authSlice, type UserId } from "@/client/entities/user";
import { renderWithProviders } from "@/client/shared/lib/tests";
import { server } from "@/client/shared/config/jest";
import { env } from "@/client/shared/config";

interface NavbarTestState {
  auth: AuthenticatedUser;
}

const mockUser = {
  _id: "1" as UserId,
  id: "1",
  username: "TestUser",
  password: "TestPassword",
  email: "test@test.com",
  role: "user" as const,
  rating: [],
  watchlist: [],
};

const preloadedState: NavbarTestState = {
  auth: {
    user: mockUser,
    accessToken: "fake-jwt-token",
  },
};

const asyncReducers = {
  auth: authSlice.reducer,
};

describe("widgets/Navbar", () => {
  it('should render a "Sign in" button when the user is not authenticated', () => {
    renderWithProviders<NavbarTestState>(<Navbar />, {
      asyncReducers,
    });

    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByTitle(/logged in as/i)).not.toBeInTheDocument();
  });

  it("should render the user avatar when the user is authenticated", async () => {
    const user = userEvent.setup();

    server.use(
      http.get(`${env.NEXT_PUBLIC_SERVER_URL}/auth/session`, () =>
        HttpResponse.json({ user: mockUser, accessToken: "fake-jwt-token" }),
      ),
    );

    renderWithProviders<NavbarTestState>(<Navbar />, {
      initialState: preloadedState,
      asyncReducers,
    });

    const avatarButton = await screen.findByRole("button", { name: /user menu/i });
    expect(avatarButton).toBeInTheDocument();

    await user.hover(avatarButton);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(/logged in as testuser/i);

    expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
  });

  it('should clear the user state and show the "Sign in" button after logging out', async () => {
    const user = userEvent.setup();

    let isLoggedIn = true;

    server.use(
      http.get(`${env.NEXT_PUBLIC_SERVER_URL}/auth/session`, () => {
        return isLoggedIn
          ? HttpResponse.json({ user: mockUser, accessToken: "fake-jwt-token" })
          : HttpResponse.json(null, { status: 401 });
      }),
      http.delete(`${env.NEXT_PUBLIC_SERVER_URL}/auth/signout`, () => {
        isLoggedIn = false;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders<NavbarTestState>(<Navbar />, {
      initialState: preloadedState,
      asyncReducers,
    });

    const avatarButton = await screen.findByRole("button", { name: /user menu/i });
    await user.click(avatarButton);

    const logoutButton = await screen.findByRole("menuitem", { name: /logout/i });
    await user.click(logoutButton);

    expect(await screen.findByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /user menu/i })).not.toBeInTheDocument();
  });
});
