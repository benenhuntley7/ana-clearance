import React, { useState } from "react";
import { setPriced } from "../functions/supabase_functions";
import { LoadingPage } from "./loadingSpinner";

interface StoreDataProps {
  storeData: any[]; // Adjust the type accordingly
  setStoreData: any;
  selectedDepartment: string;
}

export const StockInfo = ({ storeData, setStoreData, selectedDepartment }: StoreDataProps) => {
  const [sortedBy, setSortedBy] = useState("");

  const sortByCost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = [...storeData];
    sortedData.sort((a, b) => {
      return b.cost - a.cost;
    });
    setSortedBy("cost");
    setStoreData(sortedData);
  };

  const sortBySOH = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = [...storeData];
    sortedData.sort((a, b) => {
      return b.soh - a.soh;
    });
    setSortedBy("soh");
    setStoreData(sortedData);
  };

  const sortByAge = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = [...storeData];
    sortedData.sort((a, b) => {
      // First, sort by age in descending order
      if (b.age !== a.age) {
        return b.age - a.age;
      }

      // If age is the same, then sort by either cost or SOH based on sortedBy
      if (sortedBy === "cost") {
        return b.cost - a.cost;
      } else if (sortedBy === "soh") {
        return b.soh - a.soh;
      }

      return 0; // Default case, no change in order
    });

    setStoreData(sortedData);
  };

  const handleCheckboxChange = (index: number, row: any) => {
    const updatedData = [...storeData];
    updatedData[index].priced = !row.priced; // Toggle 'priced' property
    setStoreData(updatedData);

    // Call setPriced with the updated 'priced' value
    setPriced(row.id, updatedData[index].priced);
  };

  return (
    <>
      {storeData.length > 0 ? (
        <>
          <div className="flex justify-center mt-4">
            <form className="flex">
              <button
                className={`btn btn-sm md:btn-md btn-outline me-4 ${sortedBy === "cost" ? "btn-active" : null}`}
                onClick={sortByCost}
              >
                Sort By SOH@Cost
              </button>
              <button className="btn btn-sm md:btn-md btn-outline me-4 " onClick={sortByAge}>
                Sort By Age
              </button>
              <button
                className={`btn btn-sm md:btn-md btn-outline me-4 ${sortedBy === "soh" ? "btn-active" : null}`}
                onClick={sortBySOH}
              >
                Sort By SOH
              </button>
            </form>
          </div>
          <div className="mt-5 px-2 md:px-40">
            <div className="md:flex md:justify-between py-2">
              <p>{storeData.length} clearance lines</p>
              <p> Last updated: {new Date(storeData[0].updated_at).toLocaleString()}</p>
            </div>
            <div className="overflow-x-auto">
              {/* Display table on medium or larger screens */}
              <table className="hidden md:table table-zebra-zebra">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Description</th>
                    <th>MAP</th>
                    <th>SOH@Cost</th>
                    <th>RRP</th>
                    <th>Z-Status</th>
                    <th>SOH</th>
                    <th>Age</th>
                    <th>Priced</th>
                  </tr>
                </thead>
                <tbody>
                  {storeData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.article}</td>
                      <td>{row.description}</td>
                      <td>{CurrencyFormatter.format(row.map)}</td>
                      <td>{CurrencyFormatter.format(row.cost)}</td>
                      <td>{CurrencyFormatter.format(row.rrp)}</td>
                      <td>{row.z_status}</td>
                      <td>{row.soh}</td>
                      <td>{row.age} days</td>
                      <td>
                        <label className="label cursor-pointer">
                          <input
                            type="checkbox"
                            className="toggle"
                            checked={row.priced} // Use a property to determine the initial checked state
                            onChange={() => handleCheckboxChange(index, row)}
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Display div with labels on smaller screens */}
              <div className="md:hidden text-sm min-w-full">
                {storeData.map((row, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex flex-col px-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <table>
                      <tbody>
                        <tr>
                          <td>{row.article}</td>
                        </tr>
                        <tr>
                          <td className="font-bold" colSpan={5}>
                            {row.description}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "15%" }}>MAP:</td>
                          <td style={{ width: "20%" }}>${CurrencyFormatter.format(row.map)}</td>
                          <td style={{ width: "15%" }}>Status:</td>
                          <td>{row.z_status}</td>
                          <td>Priced</td>
                        </tr>
                        <tr>
                          <td>SOH@Cost:</td>
                          <td>${CurrencyFormatter.format(row.cost)}</td>
                          <td style={{ width: "20%" }}>SOH:</td>
                          <td>{row.soh}</td>
                          <td>
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                className="toggle toggle-sm"
                                checked={row.priced} // Use a property to determine the initial checked state
                                onChange={() => handleCheckboxChange(index, row)}
                              />
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td>RRP:</td>
                          <td>${row.rrp}</td>
                          <td>Age:</td>
                          <td>{row.age} days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
