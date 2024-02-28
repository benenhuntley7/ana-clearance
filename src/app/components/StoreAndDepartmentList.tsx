import React, { ChangeEvent, useEffect, useState } from "react";
import { getStoreData, getStoreTotals } from "../functions/supabase_functions";

interface StoreAndDepartmentListProps {
  storeList: any[]; // Adjust the type accordingly
  departmentList: any[];
  selectedDepartment: string;
  storeData: any;
  setStoreData: any;
  setStoreTotals: any;
  setSelectedDepartment: any;
  setFilteredData: any;
}

interface StoreData {
  id: number;
  created_at: string;
  store: string;
  article: number;
  description: string;
  z_status: string;
  rrp: number;
  soh: number;
  week: number;
  year: number;
  department: string;
  sub_department: string;
  cost: number;
  map: number;
}

export const StoreAndDepartmentList = ({
  storeList,
  departmentList,
  selectedDepartment,
  storeData,
  setStoreData,
  setStoreTotals,
  setSelectedDepartment,
  setFilteredData,
}: StoreAndDepartmentListProps) => {
  const handleStoreSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedStore = event.target.value;
    const data = await getStoreData(selectedStore);
    const totals = await getStoreTotals(selectedStore);

    setStoreData(data);
    setStoreTotals(totals);
  };

  const handleDepartmentSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const department = event.target.value;
    setSelectedDepartment(department);
  };

  useEffect(() => {
    const getAndSetDepartmentData = async () => {
      const filteredData = storeData;
      setFilteredData(
        selectedDepartment === "all"
          ? filteredData
          : filteredData.filter((row: StoreData) => row.department === selectedDepartment)
      );
    };

    getAndSetDepartmentData();
  }, [selectedDepartment, storeData, setFilteredData]);

  return (
    <>
      <div className="flex w-full justify-center p-4">
        <form className="flex">
          <label className="form-control w-full max-w-xs pe-4">
            <select id="storeSelect" className="select select-bordered" onChange={handleStoreSelectChange}>
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
            <select id="storeSelect" className="select select-bordered" onChange={handleDepartmentSelectChange}>
              <option disabled defaultValue="">
                Choose Department
              </option>
              <option>All Departments</option>
              {departmentList.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
        </form>
      </div>
    </>
  );
};
