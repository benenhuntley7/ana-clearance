import { ClerkLoaded, ClerkLoading, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LoadingPage } from "./components/loadingSpinner";
import StoreData from "./components/StoreData";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <StoreData />
      </ClerkLoaded>
    </>
  );
}
