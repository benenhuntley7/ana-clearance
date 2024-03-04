"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "./BarChart";
import { StoreAndDepartmentList } from "./StoreAndDepartmentList";
import { StockInfo } from "./StockInfo";
import { getDepartmentList, getStoreData, getStoreList, getStoreTotals } from "../functions/supabase_functions";
import { LoadingPage } from "./loadingSpinner";

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
      {storeData.length > 0 ? (
        <>
          <BarChart data={storeTotals} />
          <StockInfo storeData={filteredData} setStoreData={setFilteredData} selectedDepartment={selectedDepartment} />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
