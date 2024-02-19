import { LoadingPage } from "@/app/components/loadingSpinner";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex justify-center md:items-center">
          <div className="flex justify-center md:items-center p-1">
            <SignIn />
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
}
