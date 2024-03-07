import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip } from "chart.js/auto";
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip);

interface BarChartProps {
  data: any[]; // Adjust the type accordingly
}

export const BarChart = ({ data }: BarChartProps) => {
  // Extract unique labels from the data array
  const uniqueLabels = data.map((item) => item.department);

  // Calculate grand total
  const grandTotal = data.reduce((total, item) => total + item.total_cost, 0);

  const chartData = {
    datasets: [
      {
        label: "SOH @ COST",
        data: data.map((item) => item.total_cost),
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
        <p className="text-center text-sm my-2">Store Total: ${grandTotal.toLocaleString()}</p>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
