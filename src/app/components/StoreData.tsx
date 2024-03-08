"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "./BarChart";
import { StoreAndDepartmentList } from "./StoreAndDepartmentList";
import { StockInfo } from "./StockInfo";
import {
  getDepartmentList,
  getStoreData,
  getStoreHistory,
  getStoreList,
  getStoreTotals,
} from "../functions/supabase_functions";
import { LoadingPage } from "./loadingSpinner";
import { StoreDataInterface } from "../types/types";

interface StoreDataProps {
  defaultStore: string;
}

export default function StoreData({ defaultStore }: StoreDataProps) {
  const [storeData, setStoreData] = useState<StoreDataInterface[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [storeTotals, setStoreTotals] = useState<any[]>([]);

  const [storeList, setStoreList] = useState<string[]>([]);
  const [departmentList, setDepartmentList] = useState<string[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("");

  const [storeHistory, setStoreHistory] = useState<any[]>([]);
  const [storeHistoryChart, setStoreHistoryChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stores = await getStoreList();
        const departments = await getDepartmentList();

        setStoreList(stores); // No need for type assertion with a default value for state
        setDepartmentList(departments); // No need for type assertion with a default value

        if (stores.length > 0) {
          const stock = await getStoreData(defaultStore);
          const totals = await getStoreTotals(defaultStore);
          const history = await getStoreHistory(defaultStore);

          setSelectedStore(defaultStore);
          setStoreData(stock);
          setStoreTotals(totals);
          setStoreHistory(history);
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
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        setFilteredData={setFilteredData}
        setStoreHistory={setStoreHistory}
        storeHistoryChart={storeHistoryChart}
        setStoreHistoryChart={setStoreHistoryChart}
        defaultStore={defaultStore}
      />
      {storeData.length > 0 ? (
        <>
          <BarChart
            data={storeTotals}
            history={storeHistory}
            selectedDepartment={selectedDepartment}
            storeHistoryChart={storeHistoryChart}
          />
          <StockInfo storeData={filteredData} setStoreData={setFilteredData} />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
