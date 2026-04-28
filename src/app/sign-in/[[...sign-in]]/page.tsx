import { ClerkProvider } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen items-center justify-center">
        <SignIn />
      </div>
    </ClerkProvider>
  );
}
