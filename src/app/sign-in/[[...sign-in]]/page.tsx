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
          <div className="flex justify-center p-1">
            <SignIn />
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
}
