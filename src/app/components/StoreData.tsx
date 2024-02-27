"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart } from "./BarChart";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function StoreData() {
  const [uniqueStores, setUniqueStores] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<any[]>([]); // Adjust the type accordingly
  const [filteredData, setFilteredData] = useState<any[]>([]); // Adjust the type accordingly
  const [storeTotals, setStoreTotals] = useState<any[]>([]); // Adjust the type accordingly

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUniqueStores(); // Wait for fetchUniqueStores to complete
      } catch (error: any) {
        setError(error.message);
      }
    };

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

          // Now that uniqueStores is updated, call getStoreData
          if (stores.length > 0) {
            getStoreData(stores[0].store, "all");
          }
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData(); // Call the new function to fetch data
  }, []); // Empty dependency array ensures that this runs only once on mount

  const getStoreData = async (selectedStore: string, selectedDepartment: string) => {
    try {
      const { data, error } = await supabase.from("stock").select().eq("store", selectedStore);
      if (error) {
        console.error(error);
      } else {
        // Filter data based on selected department
        const filteredData =
          selectedDepartment === "all" ? data : data.filter((row) => row.department === selectedDepartment);
        setStoreData(data);
        setFilteredData(filteredData);
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartmentData = async (selectedDepartment: string, selectedStore: string) => {
    // Filter data based on selected store and department
    const filteredData = selectedStore === "all" ? storeData : storeData.filter((row) => row.store === selectedStore);

    setFilteredData(
      selectedDepartment === "all" ? filteredData : filteredData.filter((row) => row.department === selectedDepartment)
    );
  };

  return (
    <>
      <form className="mb-4 w-52 flex gap-x-2 items-center">
        <div className="flex justify-between p-6">
          <label className="form-control w-full max-w-xs">
            <select
              id="storeSelect"
              className="select select-bordered"
              onChange={(e) =>
                getStoreData(e.target.value, (document.getElementById("departmentSelect") as HTMLSelectElement)?.value)
              }
            >
              <option disabled defaultValue="">
                Choose Store
              </option>
              {uniqueStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <select
              id="departmentSelect"
              className="select select-bordered mx-5"
              onChange={(e) =>
                getDepartmentData(e.target.value, (document.getElementById("storeSelect") as HTMLSelectElement)?.value)
              }
            >
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
      {storeData && storeData.length > 0 && (
        <>
          <BarChart data={storeTotals} />
          <div className="mt-5 px-40 md:px-0">
            <p>{filteredData.length} clearance lines</p>
            <table className="table table-zebra md:table-sm">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Description</th>
                  <th>MAP</th>
                  <th>SOH@Cost</th>
                  <th>RRP</th>
                  <th>Z-Status</th>
                  <th>SOH</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.article}</td>
                    <td>{row.description}</td>
                    <td>{CurrencyFormatter.format(row.map)}</td>
                    <td>{CurrencyFormatter.format(row.cost)}</td>
                    <td>{CurrencyFormatter.format(row.rrp)}</td>
                    <td>{row.z_status}</td>
                    <td>{row.soh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
