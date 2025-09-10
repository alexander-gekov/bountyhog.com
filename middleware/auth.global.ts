import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  // Protected routes that require authentication
  const protectedRoutes = ["/account", "/create", "/my-bounties"];

  // Auth routes that should redirect if already authenticated
  const authRoutes = ["/sign-in", "/sign-up"];

  if (!session.value) {
    // User is not authenticated
    if (protectedRoutes.some((route) => to.path.startsWith(route))) {
      return navigateTo("/sign-in");
    }
  } else {
    // User is authenticated
    if (authRoutes.includes(to.path)) {
      return navigateTo("/");
    }
  }
});
