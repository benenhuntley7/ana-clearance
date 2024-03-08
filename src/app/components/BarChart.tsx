import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip } from "chart.js/auto";
import { StoreHistoryInterface } from "../types/types";
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip);

interface BarChartProps {
  data: any[]; // Adjust the type accordingly
  history: any[];
  selectedDepartment: string;
  storeHistoryChart: boolean;
}

export const BarChart = ({ data, history, selectedDepartment, storeHistoryChart }: BarChartProps) => {
  let uniqueLabels;
  let dataToDisplay;

  if (storeHistoryChart) {
    uniqueLabels = Array.from(new Set(history.map((entry) => new Date(entry.created_at).toISOString().split("T")[0])));
    dataToDisplay = getTotalCostArray(history, selectedDepartment);
  } else {
    // Extract unique labels from the data array
    uniqueLabels = data.map((item) => item.department);
    dataToDisplay = data.map((item) => item.total_cost);
  }

  // Calculate grand total
  const grandTotal = data.reduce((total, item) => total + item.total_cost, 0);

  const chartData = {
    datasets: [
      {
        label: "SOH @ COST",
        data: dataToDisplay,
        backgroundColor: ["#f44336"],
        borderColor: "#f44336",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        labels: uniqueLabels,
      },
      y: {
        beginAtZero: true,
      },
    },
  } as const;
  return (
    <div className="flex justify-center px-2">
      <div className="w-11/12 md:w-1/2">
        <p className="text-center text-sm my-2">Store Total: ${CurrencyFormatter.format(grandTotal)}</p>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

function getTotalCostArray(data: StoreHistoryInterface[], selectedDepartment: string) {
  // Create an object to store the sums for each created_at date
  const sums: { [dateKey: string]: number } = {};

  // Iterate over the data
  data.forEach((entry) => {
    const { created_at, department, total_cost } = entry;

    // Check if the selectedDepartment is "all" or matches the current entry's department
    const isSelectedDepartment = selectedDepartment === "all" || selectedDepartment === department;

    if (isSelectedDepartment) {
      // Parse the created_at date to match only the date without the time
      const dateKey = created_at.split("T")[0];

      // Update the sum for the current created_at date
      sums[dateKey] = (sums[dateKey] || 0) + total_cost;
    }
  });

  // If selectedDepartment is "all", return an array of sums
  if (selectedDepartment === "all") {
    return Object.values(sums);
  } else {
    // If selectedDepartment is specific, return an array of total_cost for that department
    return data.filter((entry) => entry.department === selectedDepartment).map((entry) => entry.total_cost);
  }
}

// Function to format to 2 decimal places for currency display
const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
