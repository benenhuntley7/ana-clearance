"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { auth, clerkClient } from "@clerk/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const { userId } = auth();

async function createFolder(formData: FormData) {
  const user = await clerkClient.users.getUser(userId!);
  const name = formData.get("name");
  const { data, error } = await supabase.from("folders").insert([{ name: name, userId: userId }]);
  revalidatePath("/");
}

async function getUserType(userId: string) {}

export { createFolder, getUserType };
