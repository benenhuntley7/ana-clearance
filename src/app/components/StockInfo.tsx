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
          <button className="btn btn-sm md:btn-md btn-outline me-4 hidden" onClick={sortByAge}>
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display div with labels on smaller screens */}
          <div className="md:hidden text-sm">
            {storeData.map((row, index) => (
              <div key={index} className={`mb-4 flex flex-col px-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <table>
                  <tr>
                    <td>{row.article}</td>
                  </tr>
                  <tr>
                    <td className="font-bold" colSpan={4}>
                      {row.description}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>MAP:</td>
                    <td style={{ width: "20%" }}>${CurrencyFormatter.format(row.map)}</td>
                    <td style={{ width: "15%" }}>Status:</td>
                    <td>{row.z_status}</td>
                  </tr>
                  <tr>
                    <td>SOH@Cost:</td>
                    <td>${CurrencyFormatter.format(row.cost)}</td>
                    <td>SOH:</td>
                    <td>{row.soh}</td>
                  </tr>
                  <tr>
                    <td>RRP:</td>
                    <td>${row.rrp}</td>
                    <td>Age:</td>
                    <td>{row.age} days</td>
                  </tr>
                </table>
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
