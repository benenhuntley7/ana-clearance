import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip } from "chart.js/auto";
import { StoreHistoryInterface } from "../types/types";
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip);

interface BarChartProps {
  data: any[];
  selectedDepartment: string;
}

export const HistoryBarChart = ({ data, selectedDepartment }: BarChartProps) => {
  // Extract unique labels from the data array
  const uniqueLabels = Array.from(new Set(data.map((entry) => new Date(entry.created_at).toISOString().split("T")[0])));
  let dataToDisplay = getTotalCostArray(data, selectedDepartment);

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
        <p className="text-center  text-sm my-2">Store Total: ${grandTotal.toLocaleString()}</p>
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
