import { LoadingPage } from "@/app/components/loadingSpinner";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex justify-center md:items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-0 md:border-2 border-slate-400">
            <div className="flex justify-center md:items-center p-1">
              <SignIn />
            </div>
            <div className="hidden md:flex justify-center p-6">
              <div>
                <Link href="/">Anaconda Clearance Data</Link>
              </div>
            </div>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
}
