import { ClerkLoaded, ClerkLoading, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LoadingPage } from "./components/loadingSpinner";
import StoreData from "./components/StoreData";

export default async function Home() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const defaultStore = sessionClaims.metadata.store;

  return (
    <>
      {checkEmail(sessionClaims.email as string) ? (
        <>
          <ClerkLoading>
            <LoadingPage />
          </ClerkLoading>
          <ClerkLoaded>
            <StoreData defaultStore={defaultStore} />
          </ClerkLoaded>
        </>
      ) : (
        <>
          <p className="text-center p-10">You are not authorised to view this content</p>
        </>
      )}
    </>
  );
}

const checkEmail = (email: string) => {
  if (email.endsWith("@anaconda.com.au")) return true;
  return false;
};
