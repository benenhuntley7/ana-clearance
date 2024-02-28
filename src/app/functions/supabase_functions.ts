import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getStoreData = async (store: string) => {
  try {
    const { data, error } = await supabase.from("stock").select().eq("store", store);
    if (error) {
      console.error(error);
      return [];
    } else {
      return data;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStoreTotals = async (store: string) => {
  try {
    const { data, error } = await supabase.from("store_department_weekly_total_cost").select().eq("store", store);
    if (error) {
      console.error(error);
      return [];
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
