import { ClerkLoaded, ClerkLoading, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import FolderForm from "./components/FolderForm";
import { LoadingPage } from "./components/loadingSpinner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: folders, error } = await supabase.from("folders").select().eq("userId", userId);

  if (error) {
    console.error("Error fetching folders:", error.message); // Log the specific error message
    throw new Error("Error fetching folders");
  }

  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="flex  flex-col  justify-between p-6">
          <div className="z-10 max-w-5xl w-full items-center justify-between p-3 font-mono text-sm lg:flex">
            <FolderForm />
          </div>
          <div className="flex flex-col mb-10">
            {folders.map((folder) => (
              <p key={folder.id}>{folder.name}</p>
            ))}
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
}
