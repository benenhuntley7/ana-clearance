import React from "react";

interface StoreDataProps {
  storeData: any[]; // Adjust the type accordingly
  setStoreData: any;
  selectedDepartment: string;
}

export const StockInfo = ({ storeData, setStoreData, selectedDepartment }: StoreDataProps) => {
  const sortByCost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = [...storeData];
    sortedData.sort((a, b) => {
      return b.cost - a.cost;
    });
    setStoreData(sortedData);
  };

  const sortBySOH = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sortedData = [...storeData];
    sortedData.sort((a, b) => {
      return b.soh - a.soh;
    });
    setStoreData(sortedData);
  };

  const sortByAge = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <form className="flex">
          <button className="btn btn-sm md:btn-md btn-outline me-4" onClick={sortByCost}>
            Sort By SOH@Cost
          </button>
          <button className="btn btn-sm md:btn-md btn-outline me-4" onClick={sortByAge}>
            Sort By Age
          </button>
          <button className="btn btn-sm md:btn-md btn-outline" onClick={sortBySOH}>
            Sort By SOH
          </button>
        </form>
      </div>
      <div className="mt-5 px-2 md:px-40">
        <p className="p-2">{storeData.length} clearance lines</p>
        <div className="overflow-x-auto">
          {/* Display table on medium or larger screens */}
          <table className="hidden md:table table-zebra-zebra px-1">
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
              {storeData.map((row, index) => (
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

          {/* Display div with labels on smaller screens */}
          <div className="md:hidden text-sm">
            {storeData.map((row, index) => (
              <div key={index} className={`mb-4 flex flex-col ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <div className="flex">
                  <label className="block pe-2">{row.article}</label>
                  <label className="block font-bold">{row.description}</label>
                </div>
                <div className="flex">
                  <div className="pe-5">
                    <label className="block pe-2">MAP: {CurrencyFormatter.format(row.map)}</label>
                    <label className="block pe-2">SOH@Cost: {CurrencyFormatter.format(row.cost)}</label>
                    <label className="block pe-2">RRP: ${CurrencyFormatter.format(row.rrp)}</label>
                  </div>
                  <div>
                    <label className="block">Z-Status: {row.z_status}</label>
                    <label className="block">SOH: {row.soh}</label>
                    <label className="block">Age:</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
