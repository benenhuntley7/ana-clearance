import React, { ChangeEvent, useEffect, useState } from "react";
import { getStoreData, getStoreHistory, getStoreTotals } from "../functions/supabase_functions";
import { StoreDataInterface } from "../types/types";

interface StoreAndDepartmentListProps {
  storeList: any[];
  departmentList: any[];
  selectedDepartment: string;
  storeData: StoreDataInterface[];
  setStoreData: any;
  setStoreTotals: any;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>;
  selectedStore: string;
  setSelectedStore: React.Dispatch<React.SetStateAction<string>>;
  setFilteredData: any;
  setStoreHistory: any;
  storeHistoryChart: boolean;
  setStoreHistoryChart: React.Dispatch<React.SetStateAction<boolean>>;
  defaultStore: string;
}

export const StoreAndDepartmentList = ({
  storeList,
  departmentList,
  selectedDepartment,
  storeData,
  setStoreData,
  setStoreTotals,
  setSelectedDepartment,
  selectedStore,
  setSelectedStore,
  setFilteredData,
  setStoreHistory,
  storeHistoryChart,
  setStoreHistoryChart,
  defaultStore,
}: StoreAndDepartmentListProps) => {
  const handleStoreSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setStoreData([]);
    const selectedStore = event.target.value;
    const data = await getStoreData(selectedStore);
    const totals = await getStoreTotals(selectedStore);
    const history = await getStoreHistory(selectedStore);

    setSelectedStore(selectedStore);
    setStoreData(data);
    setStoreTotals(totals);
    setStoreHistory(history);
  };

  const handleDepartmentSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilteredData([]);
    const department = event.target.value;

    setSelectedDepartment(department);
  };

  useEffect(() => {
    const getAndSetDepartmentData = async () => {
      const filteredData = storeData;
      setFilteredData(
        selectedDepartment === "all"
          ? filteredData
          : filteredData.filter((row: StoreDataInterface) => row.department === selectedDepartment)
      );
    };

    getAndSetDepartmentData();
  }, [selectedDepartment, storeData, setFilteredData]);

  const handleCheckboxChange = () => {
    setStoreHistoryChart(!storeHistoryChart);
  };

  return (
    <>
      <div className="flex w-full justify-center p-4">
        {storeList.length > 0 && departmentList.length > 0 ? (
          <form className="flex">
            <label className="form-control w-full max-w-xs pe-4">
              <select
                id="storeSelect"
                className="select select-bordered select-sm md:select-md"
                onChange={handleStoreSelectChange}
                value={selectedStore}
              >
                <option disabled defaultValue="">
                  Choose Store
                </option>
                {storeList.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control w-full max-w-xs">
              <select
                id="storeSelect"
                className="select select-bordered select-sm md:select-md"
                onChange={handleDepartmentSelectChange}
              >
                <option disabled defaultValue="">
                  Choose Department
                </option>
                <option value="all">All Departments</option>
                {departmentList.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <label className="label cursor-pointer ms-2">
              <span className="me-2 md:text-base hidden md:block">History:</span>
              <input
                type="checkbox"
                className="toggle toggle-sm md:toggle-md"
                checked={storeHistoryChart}
                onChange={() => handleCheckboxChange()}
              />
            </label>
          </form>
        ) : null}
      </div>
    </>
  );
};
