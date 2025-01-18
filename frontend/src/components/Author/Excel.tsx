import { LiaFileExcelSolid } from "react-icons/lia";
import { AuthorType } from "../../pages/AdminAuthor";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { BiDownload } from "react-icons/bi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
type ExcelType = {
  id: string;
  authorId: string;
  file: string;
  date: string;
  name: string;
  channels: string;
  quantity: string;
  compensation: string;
};
function Excel({ author }: { author: AuthorType }) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(22, 163, 74, 0.1)", // Green grid lines
        },
        ticks: {
          font: {
            size: 12,
          },
          padding: 10,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
          padding: 10,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.3, // Smoother curve
      },
      point: {
        radius: 4,
        hitRadius: 8,
        hoverRadius: 6,
        backgroundColor: "#ffffff",
        borderWidth: 3,
      },
    },
  };
  const [selectedDate, setSelectedDate] = useState<null | Date>(new Date());
  const [selectedExcel, setSelectedExcel] = useState<null | ExcelType>(null);
  const [graphType, setGraphType] = useState<string>("null");
  const [graphData, setGraphData] = useState<ChartData<"line"> | null>(null);
  function getAllDaysOfMonth(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    let days: { [key: string]: number } = {};
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      days = { ...days, [String(day.toDateString())]: 0 };
    }
    return days;
  }
  function excelDateToJSDate(serial: number) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch date
    return new Date(
      excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000
    ).toDateString();
  }
  useEffect(() => {
    if (author.excels && selectedDate) {
      setSelectedExcel(null);
      setGraphData(null);
      setGraphType("null");
      const yearSelected = selectedDate.getUTCFullYear();
      const monthSelected = selectedDate.getUTCMonth();
      author?.excels?.forEach((excel: ExcelType) => {
        const date = new Date(excel.date);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        if (year === yearSelected && month === monthSelected) {
          console.log("OK");
          setSelectedExcel(excel);
        }
      });
    }
  }, [author, selectedDate]);

  return (
    <div className="w-full h-full bg-zinc-200 flex flex-col">
      <div className="w-full p-2 bg-zinc-900 border-b-[2px] border-green-600 flex justify-between items-center">
        <h1 className="font-semibold text-xl text-white flex justify-start items-center">
          <LiaFileExcelSolid className="text-green-600 text-2xl" />
          Excel Sheets
        </h1>
      </div>
      <div className="p-2 w-full flex justify-between items-center gap-2">
        <div className="flex justify-start items-center gap-2">
          <DatePicker
            className="p-2 rounded-full cursor-pointer outline-none bg-green-600 text-white text-base hover:bg-green-800"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat={"MMMM YYYY"}
            showMonthYearPicker
          />
          <a
            download={`excel-${selectedDate}.xlsx`}
            href={selectedExcel?.file}
            className="w-9 h-9 hover:bg-zinc-400 cursor-pointer bg-zinc-300 rounded-full flex justify-center items-center"
          >
            <BiDownload className="text-2xl" />
          </a>
        </div>
        <select
          className="bg-green-100 p-2 text-green-700 cursor-pointer outline-none rounded-full"
          value={graphType}
          onChange={(e) => {
            setGraphType(e.target.value);
            if (e.target.value === "quantity" && selectedExcel) {
              const quantityData = JSON.parse(selectedExcel.quantity);
              const currentGraphData = getAllDaysOfMonth(selectedExcel.date);
              Object.entries(quantityData).forEach(([key, value]) => {
                const alphaDay: string = excelDateToJSDate(Number(key));
                currentGraphData[alphaDay] = Number(value);
              });
              console.log(currentGraphData);
              const chartData = {
                labels: currentGraphData ? Object.keys(currentGraphData) : [],
                datasets: [
                  {
                    label: "Values",
                    data: currentGraphData
                      ? Object.values(currentGraphData)
                      : [],
                    fill: false,
                    borderColor: "rgb(22 163 74)", // green-600
                    tension: 0.1,
                  },
                ],
              };
              setGraphData(chartData);
            } else if (e.target.value === "compensation" && selectedExcel) {
              const quantityData = JSON.parse(selectedExcel.compensation);
              const currentGraphData = getAllDaysOfMonth(selectedExcel.date);
              Object.entries(quantityData).forEach(([key, value]) => {
                const alphaDay: string = excelDateToJSDate(Number(key));
                currentGraphData[alphaDay] = Number(value);
              });
              console.log(currentGraphData);
              const chartData = {
                labels: currentGraphData ? Object.keys(currentGraphData) : [],
                datasets: [
                  {
                    label: "Values",
                    data: currentGraphData
                      ? Object.values(currentGraphData)
                      : [],
                    fill: false,
                    borderColor: "rgb(22 163 74)", // green-600
                    tension: 0.1,
                  },
                ],
              };
              setGraphData(chartData);
            } else {
              setGraphData(null);
            }
          }}
        >
          <option value="null">Select Graph Type</option>
          <option value="quantity">Quantity Graph</option>
          <option value="compensation">Compensation Graph</option>
        </select>
      </div>

      {/* GRAPHS  */}
      <div className="w-full p-2 h-full flex justify-center items-center">
        {graphData ? (
          <Line data={graphData} options={options} />
        ) : (
          <h1 className="text-base">No Graphs To Show, Select A Graph Type</h1>
        )}
      </div>
    </div>
  );
}

export default Excel;
