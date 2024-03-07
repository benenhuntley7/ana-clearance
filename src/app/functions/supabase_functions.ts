import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getStoreData = async (store: string) => {
  try {
    const { data, error } = await supabase
      .from("stock_with_age")
      .select()
      .eq("store", store)
      .order("department")
      .order("description");
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
      // Sort the totals array by the "department" property in ascending order
      const sortedTotals = data.slice().sort((a, b) => a.department.localeCompare(b.department));
      return sortedTotals;
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

export const getDepartmentList = async () => {
  try {
    const { data, error } = await supabase.from("unique_departments").select("department");
    if (error) {
      console.error(error);
      return [];
    } else {
      // Extract "store" values from the result
      const departments = data ? data.map((item) => item.department) : [];
      const sortedDepartments = departments.slice().sort((a, b) => a.localeCompare(b));
      return sortedDepartments;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStoreList = async () => {
  try {
    const { data, error } = await supabase.from("unique_stores").select("store");
    if (error) {
      console.error(error);
      return [];
    } else {
      // Extract "store" values from the result
      const stores = data ? data.map((item) => item.store) : [];

      // Sort the stores alphabetically
      const sortedStores = stores.sort((a, b) => a.localeCompare(b));

      return sortedStores;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStoreHistory = async (store: string) => {
  try {
    const { data, error } = await supabase
      .from("stock_value_history")
      .select("created_at,department,total_cost")
      .eq("store", store);
    if (error) {
      console.error(error);
      return [];
    } else {
      // Sort the stores alphabetically
      const sortedHistory = data.sort((a, b) => {
        // First, sort by created_at in descending order
        const createdDateComparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

        // If created_at values are equal, sort by department alphabetically
        return createdDateComparison !== 0 ? createdDateComparison : a.department.localeCompare(b.department);
      });
      return sortedHistory;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};
