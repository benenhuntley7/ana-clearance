import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { LoadingPage } from "@/app/components/loadingSpinner";

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex justify-center">
          <SignUp />
        </div>
      </ClerkLoaded>
    </>
  );
}
