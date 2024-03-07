import React, { useState } from "react";
import { setPriced } from "../functions/supabase_functions";

interface StoreDataProps {
  storeData: any[]; // Adjust the type accordingly
  setStoreData: any;
  selectedDepartment: string;
}

export const StockInfo = ({ storeData, setStoreData, selectedDepartment }: StoreDataProps) => {
  const [sortedBy, setSortedBy] = useState("");
  const [onlyZ5, setOnlyZ5] = useState(false);

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

  // Checkbox for when items are priced in store
  const handleCheckboxChange = (id: number, row: any) => {
    const dataIndex = storeData.findIndex((dataRow) => dataRow.id === id);

    // If the row has an index then update state and set value in database
    if (dataIndex !== -1) {
      const updatedData = [...storeData];
      updatedData[dataIndex].priced = !row.priced;
      setStoreData(updatedData);

      // Call setPriced with the updated 'priced' value, either true or false to supabase
      setPriced(id, updatedData[dataIndex].priced);
    }
  };

  return (
    <>
      {/* Buttons for sorting data */}

      <>
        <div className="flex justify-center m-4">
          <form className="flex items-center">
            <button
              className={`btn btn-sm md:btn-md btn-outline w-24 me-4 ${sortedBy === "cost" ? "btn-active" : null}`}
              onClick={sortByCost}
            >
              Sort By SOH@Cost
            </button>
            <button className="btn btn-sm md:btn-md btn-outline w-24 me-4 " onClick={sortByAge}>
              Sort By Age
            </button>
            <button
              className={`btn btn-sm md:btn-md btn-outline w-24 me-2 ${sortedBy === "soh" ? "btn-active" : null}`}
              onClick={sortBySOH}
            >
              Sort By SOH
            </button>
            <label className="label cursor-pointer">
              <span className="label-text">Z5:</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={onlyZ5}
                onClick={() => {
                  setOnlyZ5(!onlyZ5);
                }}
              />
            </label>
          </form>
        </div>
        {storeData.length > 0 ? (
          <div className="m-4 md:px-40">
            <div className="md:flex md:justify-between py-2">
              <p> {storeData.filter((row) => !onlyZ5 || row.z_status === "Z5").length} clearance lines</p>
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
                  {storeData
                    .filter((row) => !onlyZ5 || row.z_status === "Z5")
                    .map((row) => (
                      <tr key={row.id}>
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
                              checked={row.priced}
                              onChange={() => handleCheckboxChange(row.id, row)}
                            />
                          </label>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Display div with labels on smaller screens */}
              <div className="md:hidden text-sm min-w-full">
                {storeData
                  .filter((row) => !onlyZ5 || row.z_status === "Z5")
                  .map((row, index) => (
                    <div
                      key={row.id}
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
                                  onChange={() => handleCheckboxChange(row.id, row)}
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
        ) : (
          <div className="m-4 md:px-40">
            <div className="md:flex  flex-col md:justify-between py-2">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

// Function to format to 2 decimal places for currency display
const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
