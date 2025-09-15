import { createAuthClient } from "better-auth/vue";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), lastLoginMethodClient()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  forgetPassword,
  resetPassword,
} = authClient;
