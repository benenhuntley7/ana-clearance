import { LoadingPage } from "@/app/components/loadingSpinner";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="flex justify-center">
          <SignIn />
        </div>
      </ClerkLoaded>
    </>
  );
}
