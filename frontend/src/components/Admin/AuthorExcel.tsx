import { ReactNode, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsUpload } from "react-icons/bs";
import { TbFileExcel } from "react-icons/tb";
import * as XLSX from "xlsx";

export default function ExcelUpload() {
  const [selectedDate, setSelectedDate] = useState<null | Date>(new Date());
  const [excelData, setExcelData] = useState<object>();
  function handleExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e) {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(jsonData);
      }
    };
    reader.onerror = (error) => {
      console.error("File read error:", error);
    };
    reader.readAsArrayBuffer(file);
  }
  return (
    <div className="w-2/3 bg-zinc-100 h-full p-2 flex flex-col">
      <h1 className="text-xl border-b-[1px] border-green-600 flex justify-start items-center">
        <TbFileExcel className="text-2xl text-green-600" />
        Excel Actions
      </h1>
      <div className="p-2 w-full flex justify-between items-center gap-2">
        <div className="flex justify-start items-center gap-2">
          <DatePicker
            className="p-2 rounded-full cursor-pointer outline-none bg-green-600 text-white text-base"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat={"MMMM YYYY"}
            showMonthYearPicker
          />
          <div className="cursor-pointer relative flex justify-center items-center">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="flex justify-center items-center w-full text-sm text-gray-500
            cursor-pointer file:cursor-pointer   file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-green-100 file:text-green-700
        hover:file:bg-green-200"
            />
          </div>
        </div>
        {excelData && (
          <div className="p-2 bg-green-600 rounded-full flex justify-center items-center cursor-pointer">
          <BsUpload className="text-xl text-white" />
          </div>
        )}
      </div>
      <div className="flex justify-center items-center ">
        {excelData && (
          <div className="w-full p-2 overflow-y-auto h-[calc(100vh-140px)] cursor-pointer">
            <table className="min-w-full border-collapse table-auto">
              <tbody>
                {Object.values(excelData).map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index === 0
                        ? "bg-green-600 text-white"
                        : "hover:bg-gray-200"
                    } `}
                  >
                    {Object.values(row).map((cell, i) => (
                      <td
                        key={`${index}-${i}`}
                        className="border px-4 py-2 text-xs"
                      >
                        {cell as ReactNode}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
