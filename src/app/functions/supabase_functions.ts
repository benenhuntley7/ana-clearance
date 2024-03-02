import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getStoreData = async (store: string) => {
  try {
    const { data, error } = await supabase.from("stock_with_age").select().eq("store", store);
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
    const { data, error } = await supabase.from("store_department_total_cost").select().eq("store", store);
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

export const setPriced = async (id: number, isChecked: boolean) => {
  try {
    const { error } = await supabase
      .from("stock")
      .update({ priced: isChecked }) // Set "priced" column to the value of isChecked
      .eq("id", id);

    if (error) {
      // Handle the error appropriately (e.g., logging, displaying a message)
      console.error("Error updating 'priced' field:", error);
    } else {
      // Data has been successfully updated
      //console.log("Successfully updated 'priced' field:", data);
    }
  } catch (error) {
    // Handle exceptions during the asynchronous operation
    console.error("An unexpected error occurred:", error);
  }
};
