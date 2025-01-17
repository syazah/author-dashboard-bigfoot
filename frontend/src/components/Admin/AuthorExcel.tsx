import { ReactNode, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsUpload } from "react-icons/bs";
import { TbFileExcel } from "react-icons/tb";
import * as XLSX from "xlsx";
import { supabase, supabaseUrl } from "./supabaseClient";
import { API_BASE_URL } from "../../util";
type Excel = {
  id: string;
  authorId: string;
  file: string;
  date: string;
  name: string;
};
export default function ExcelUpload({
  username,
  excels,
}: {
  username: string;
  excels: Excel[];
}) {
  const [selectedDate, setSelectedDate] = useState<null | Date>(new Date());
  const [excelData, setExcelData] = useState<object | null>();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [excelUploaded, setExcelUploaded] = useState<null | Excel>(null);
  const sanitizeFileName = (fileName: string) => {
    return fileName
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[()]/g, "") // Remove parentheses
      .replace(/:/g, "-"); // Replace colons with dashes
  };
  function handleExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }
    if (!file) return;
    setExcelFile(file);
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
  async function UploadSheet() {
    try {
      setUploading(true);
      if (excelFile) {
        const { data, error } = await supabase.storage
          .from("excel_sheets_dashboard")
          .upload(
            `${username}/${Date.now()}/${sanitizeFileName(excelFile.name)}`,
            excelFile
          );
        console.log(data);
        if (error) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/excel_sheets_dashboard/${data.path}`;
        if (publicUrl) {
          console.log(publicUrl);
          const res = await fetch(`${API_BASE_URL}/author/upload-excel`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              url: publicUrl,
              date: selectedDate,
            }),
          });
          const data = await res.json();
          if (data.success === true) {
            alert("Data uploaded successfully");
            window.location.reload();
          } else {
            alert("Data upload failed");
          }
        }
      }
      setUploading(false);
    } catch (error) {
      setUploading(false);
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    if (excels && selectedDate) {
      setExcelUploaded(null);
      const yearSelected = selectedDate.getUTCFullYear();
      const monthSelected = selectedDate.getUTCMonth();
      excels.forEach((excel) => {
        const date = new Date(excel.date);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        if (year === yearSelected && month === monthSelected) {
          setExcelUploaded(excel);
        }
      });
    }
  }, [excels, selectedDate]);
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
          {excelUploaded !== null || (
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
          )}
        </div>
        {excelData && excelUploaded === null && (
          <div
            onClick={UploadSheet}
            className="p-2 bg-green-600 rounded-full flex justify-center items-center cursor-pointer"
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <BsUpload className="text-xl text-white" />
            )}
          </div>
        )}
      </div>
      {excelUploaded !== null && (
        <>
          <div className="flex flex-col justify-center items-center w-full h-full">
            Excel Sheet Already Uploaded For This Month
            <a
              download={`${username}-excel.xlsx`}
              href={excelUploaded.file}
              className="px-4 py-2 bg-green-100 rounded-xl text-green-600 cursor-pointer hover:bg-green-600 hover:text-green-100 transition-all duration-200"
            >
              Download
            </a>
          </div>
        </>
      )}
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
