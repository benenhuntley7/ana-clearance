"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart } from "./BarChart";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function StoreData() {
  const ref = useRef<HTMLFormElement>(null);
  const [uniqueStores, setUniqueStores] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<any[]>([]); // Adjust the type accordingly
  const [storeTotals, setStoreTotals] = useState<any[]>([]); // Adjust the type accordingly

  useEffect(() => {
    const fetchUniqueStores = async () => {
      try {
        const { data: stores, error: storesError } = await supabase.from("unique_stores").select("store");
        const { data: departments, error: departmentsError } = await supabase
          .from("unique_departments")
          .select("department");

        if (storesError) {
          setError(storesError.message);
        } else if (departmentsError) {
          setError(departmentsError.message);
        } else {
          setUniqueStores(stores.map((store) => store.store));
          setUniqueDepartments(departments.map((department) => department.department));
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUniqueStores();
  }, []);

  const getStoreData = async (selectedStore: string) => {
    try {
      const { data, error } = await supabase.from("stock").select().eq("store", selectedStore);
      if (error) {
        console.error(error);
      } else {
        setStoreData(data);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const { data, error } = await supabase
        .from("store_department_weekly_total_cost")
        .select()
        .eq("store", selectedStore);
      if (error) {
        console.error(error);
      } else {
        setStoreTotals(data);
        console.log(data); // Use 'data' instead of 'storeTotals'
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    console.error(error);
    return null;
  }

  const getDepartmentData = async (selectedDepartment: string) => {
    return;
  };

  return (
    <>
      <form className="mb-4 w-52 flex gap-x-2 items-center" ref={ref}>
        <div className="flex justify-between p-6">
          <label className="form-control w-full max-w-xs">
            <select className="select select-bordered" onChange={(e) => getStoreData(e.target.value)}>
              <option disabled defaultValue="">
                Choose Store
              </option>
              <option value="all">All Stores</option>
              {uniqueStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <select className="select select-bordered mx-5" onChange={(e) => getDepartmentData(e.target.value)}>
              <option disabled defaultValue="">
                Choose Department
              </option>
              <option value="all">All Departments</option>
              {uniqueDepartments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>
      {storeData && storeData.length > 0 && <BarChart data={storeTotals} />}
    </>
  );
}
