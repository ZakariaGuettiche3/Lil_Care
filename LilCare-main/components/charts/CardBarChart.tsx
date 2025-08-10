"use client"
import React from "react";
import  { Chart, ChartConfiguration } from "chart.js";

export default function CardBarChart( { content } : { content : { labels?: string[], data?: number[], backgroundColor?: string[]}}) {
  React.useEffect(() => {
    let config = {
      type: "doughnut",
      data: {
        labels : content?.labels,
        datasets: [{
            label: 'My First Dataset',
            data : content?.data,
            backgroundColor: content?.backgroundColor,
          }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Orders Chart",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",

          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
       
      },
    } as ChartConfiguration;
    let ctx = document.getElementById("barChart");
    let context = (ctx as HTMLCanvasElement).getContext("2d")!
    const chart =  new Chart(context, config);
    
  }, [content]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-word w-full shadow-md rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              {/* <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                Performance
              </h6> */}
              <h2 className="text-blueGray-700 text-xl font-semibold">
                Children
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}