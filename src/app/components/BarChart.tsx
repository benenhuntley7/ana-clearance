import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip } from "chart.js/auto";
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip);

interface BarChartProps {
  data: any[]; // Adjust the type accordingly
}

export const BarChart = ({ data }: BarChartProps) => {
  console.log(data);

  // Extract unique labels from the data array
  const uniqueLabels = data.map((item) => item.department);

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
    <div className="flex justify-center">
      <div style={{ width: "800px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
