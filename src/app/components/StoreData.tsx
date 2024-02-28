"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart } from "./BarChart";
import { StoreAndDepartmentList } from "./StoreAndDepartmentList";
import { StockInfo } from "./StockInfo";
import { getStoreData, getStoreTotals } from "../functions/supabase_functions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase key or URL is missing. Make sure they're set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function StoreData() {
  const [storeData, setStoreData] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [storeTotals, setStoreTotals] = useState<any[]>([]);

  const [storeList, setStoreList] = useState<string[]>([]);
  const [departmentList, setDepartmentList] = useState<string[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stores = await getStoreList();
        const departments = await getDepartmentList();

        setStoreList(stores); // No need for type assertion with a default value for state
        setDepartmentList(departments); // No need for type assertion with a default value

        if (stores.length > 0) {
          const stock = await getStoreData(stores[0]);
          const totals = await getStoreTotals(stores[0]);

          setStoreData(stock);
          setStoreTotals(totals);
        }
      } catch (error) {
        console.error(error);
        // You might want to handle errors here, depending on your use case
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StoreAndDepartmentList
        storeList={storeList}
        departmentList={departmentList}
        selectedDepartment={selectedDepartment}
        storeData={storeData}
        setStoreData={setStoreData}
        setStoreTotals={setStoreTotals}
        setSelectedDepartment={setSelectedDepartment}
        setFilteredData={setFilteredData}
      />
      <BarChart data={storeTotals} />
      <StockInfo storeData={filteredData} setStoreData={setFilteredData} selectedDepartment={selectedDepartment} />
    </>
  );
}

const getStoreList = async () => {
  try {
    const { data, error } = await supabase.from("unique_stores").select("store");
    if (error) {
      console.error(error);
      return [];
    } else {
      // Extract "store" values from the result
      const stores = data ? data.map((item) => item.store) : [];
      return stores;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getDepartmentList = async () => {
  try {
    const { data, error } = await supabase.from("unique_departments").select("department");
    if (error) {
      console.error(error);
      return [];
    } else {
      // Extract "store" values from the result
      const departments = data ? data.map((item) => item.department) : [];
      return departments;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};
