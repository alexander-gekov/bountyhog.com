import { authClient } from "../../lib/auth-client";

export default defineNuxtRouteMiddleware((to) => {
  const session = authClient.useSession();
  const user = session.value?.data?.user;

  if (user && !user.userType && to.path !== "/onboarding") {
    return navigateTo("/onboarding");
  }

  if (to.path === "/onboarding" && (!user || user.userType)) {
    return navigateTo("/");
  }
});
