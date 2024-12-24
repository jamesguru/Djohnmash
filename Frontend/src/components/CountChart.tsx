"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
const CountChart = () => {
  const data = [
    {
      name: "Girls",
      count: 53,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: 53,
      fill: "#C3EBFA",
    },
    {
      name: "Total",
      count: 106,
      fill: "white",
    },
  ];
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Customers</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[70%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full">
            <h1 className="font-bold mt-5">1,234</h1>
            <h2 className="text-xs text-gray-300">Members (45%)</h2>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full">
            <h1 className="font-bold mt-5">1,200</h1>
            <h2 className="text-xs text-gray-300">Customers(60%)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
