import React, { useEffect, useState } from "react";
import { setPriced } from "../functions/supabase_functions";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 200;

interface StoreDataProps {
  storeData: any[]; // Adjust the type accordingly
  setStoreData: any;
}

export const StockInfo = ({ storeData, setStoreData }: StoreDataProps) => {
  const [sortedBy, setSortedBy] = useState("");
  const [onlyZ5, setOnlyZ5] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // for Pagination
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [rememberedPage, setRememberedPage] = useState(1); // for Pagination with Z5 checkbox. Remember last page to return to when gets unchecked.

  // useEffect to update filteredData when storeData or Z5 filter changes
  useEffect(() => {
    const filtered = storeData.filter((row) => !onlyZ5 || row.z_status === "Z5");
    setFilteredData(filtered);
  }, [storeData, onlyZ5]);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Get the data for the current page
  const currentData = filteredData.slice(startIndex, endIndex);

  const sortByCost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = sortByDescription([...storeData]); // sort by description first.

    if (sortedBy === "cost") {
      // reverse if already sorted by cost.
      setSortedBy("cost-reversed");
      sortedData.sort((b, a) => {
        return b.cost - a.cost;
      });
    } else {
      // sort by cost.
      setSortedBy("cost");
      sortedData.sort((a, b) => {
        return b.cost - a.cost;
      });
    }
    setCurrentPage(1);
    setFilteredData(sortedData);
  };

  const sortBySOH = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = sortByDescription([...storeData]); // sort by description first.

    if (sortedBy === "soh") {
      // reverse sort if already sorted by soh.
      setSortedBy("soh-reverse");
      sortedData.sort((b, a) => {
        return b.soh - a.soh;
      });
    } else {
      setSortedBy("soh"); // sort by soh
      sortedData.sort((a, b) => {
        return b.soh - a.soh;
      });
    }
    setCurrentPage(1);
    setFilteredData(sortedData);
  };

  const sortByAge = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = sortByDescription([...storeData]); // sort by description first.

    if (sortedBy === "age") {
      // revserse sort if already sorted by age
      setSortedBy("age-reversed");
      sortedData.sort((b, a) => {
        return b.age - a.age;
      });
    } else {
      setSortedBy("age"); // sort by age in descending order
      sortedData.sort((a, b) => {
        return b.age - a.age;
      });
    }
    setCurrentPage(1);
    setFilteredData(sortedData);
  };

  const sortByDescription = (data: any) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      // First, sort by age in descending order
      return b.description - a.description;
    });
    return sortedData;
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

  // Checkbox for Z5
  const handleZ5CheckboxChange = () => {
    if (!onlyZ5) {
      setRememberedPage(currentPage);
      setCurrentPage(1); // Reset current page to 1 when Z5 checkbox is clicked
    } else {
      setCurrentPage(rememberedPage);
    }
    setOnlyZ5(!onlyZ5);
  };

  return (
    <>
      {/* Buttons for sorting data */}
      <>
        <div className="flex justify-center m-4">
          <form className="flex items-center">
            <button className={`btn btn-sm md:btn-md btn-outline w-24 me-4`} onClick={sortByCost}>
              Sort By SOH@Cost
            </button>
            <button className="btn btn-sm md:btn-md btn-outline w-24 me-4 " onClick={sortByAge}>
              Sort By Age
            </button>
            <button className={`btn btn-sm md:btn-md btn-outline w-24 me-2`} onClick={sortBySOH}>
              Sort By SOH
            </button>
            <label className="label cursor-pointer">
              <span className="label-text">Z5:</span>
              <input type="checkbox" className="checkbox" checked={onlyZ5} onChange={handleZ5CheckboxChange} />
            </label>
          </form>
        </div>

        {storeData.length > 0 ? (
          <div className="m-4 md:px-40">
            <div className="md:flex md:justify-between py-2">
              <p> {storeData.filter((row) => !onlyZ5 || row.z_status === "Z5").length} clearance lines</p>
              <p className="text-xs md:text-base">
                {" "}
                Last updated: {new Date(storeData[0].updated_at).toLocaleString()}
              </p>
            </div>

            <Pagination
              storeData={filteredData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />
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
                  {currentData.map((row) => (
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
                {currentData.map((row, index) => (
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
              <div className="skeleton h-32 w-full mt-2"></div>
              <div className="skeleton h-4 w-28 mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
              <div className="skeleton h-4 w-28 mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
              <div className="skeleton h-4 w-full mt-2"></div>
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
