import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../util";
import { useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { BiLocationPlus, BiUserPin } from "react-icons/bi";
import ExcelUpload from "../components/Admin/AuthorExcel";
import { BsBank } from "react-icons/bs";
import { PiNumberSquareTwo } from "react-icons/pi";
import { MdAccountBox } from "react-icons/md";
import { motion } from "framer-motion";
import { GrDocumentNotes, GrUpload } from "react-icons/gr";
import { supabase, supabaseUrl } from "../components/Admin/supabaseClient";
export type Excel = {
  id: string;
  authorId: string;
  file: string;
  date: string;
  name: string;
  channels: string;
  quantity: string;
  compensation: string;
};
export type Book = {
  id: string;
  title: string;
  authorId: string;
  description: string;
  genre: string;
  image: string;
};
export type Bank = {
  id: string;
  name: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  userId: string;
};
export type AuthorType = {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  agreement: string;
  books: Book[];
  bank: Bank[];
  bio: string;
  published: string;
  profilePic: string;
  gender: string;
  createdAt: Date;
  excels: Excel[];
};
function AdminAuthor() {
  const { id } = useParams();
  const [authorDetails, setAuthorDetails] = useState<AuthorType | null>(null);
  const [currentSelected, setCurrentSelected] = useState<number>(0);
  async function getAuthor() {
    try {
      const res = await fetch(`${API_BASE_URL}/author/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setAuthorDetails(data.author);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    getAuthor();
  }, []);

  if (authorDetails === null) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <h1 className="text-xl">
          <motion.img
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[150px] h-[150px]"
            src="/LOGO.png"
          />
        </h1>
      </div>
    );
  }
  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-center overflow-hidden">
      <div className="w-full p-2 bg-zinc-900 flex justify-start items-center gap-2">
        <img className="w-8 h-8 " src="/LOGO2.png" />
        <h1 className="font-semibold text-white text-xl">
          Author<span className="text-yellow-600">Details</span>
        </h1>
      </div>
      <div className="w-full h-full flex justify-start items-center">
        <div className="w-1/3 h-full flex flex-col p-4">
          <div className="flex -full gap-4">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-xl">
              <img className="w-full h-full" src={authorDetails?.profilePic} />
            </div>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => {
                  setCurrentSelected(1);
                }}
                className="w-[80px] h-[80px] rounded-full bg-yellow-500 shadow-xl cursor-pointer hover:shadow-none transition-all duration-500 flex justify-center items-center"
              >
                <RiFileExcel2Line className="text-3xl text-white" />
              </div>
              <div
                onClick={() => setCurrentSelected(2)}
                className="w-[60px] h-[60px] flex justify-center items-center rounded-full bg-zinc-900 shadow-xl cursor-pointer hover:shadow-none transition-all duration-500"
              >
                <FaFileUpload className="text-3xl text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start mt-2">
            <h1 className="text-xl font-semibold ">{authorDetails?.name}</h1>
            <h1 className="text-sm font-normal flex justify-start items-center gap-1">
              <IoMailOutline className="text-yellow-700" />
              {authorDetails?.email}
            </h1>
            <h1 className="text-sm font-normal flex justify-center items-center gap-1">
              <BiUserPin className="text-yellow-700" />
              {authorDetails?.username}
            </h1>
            <h1 className="font-semibold text-lg border-b-[2px] border-yellow-600">
              Bank Details
            </h1>
            <div className="flex justify-start items-center gap-2 w-full mt-2">
              <h1 className="text-sm font-normal flex justify-center items-center gap-1 capitalize">
                <BsBank className="text-sm text-yellow-700" />{" "}
                {authorDetails?.bank[0].name} Bank
              </h1>
              <h1 className="text-sm font-normal flex justify-center items-center gap-1 capitalize">
                <BiLocationPlus className="text-sm text-yellow-700" />{" "}
                {authorDetails?.bank[0].branch} Branch
              </h1>
            </div>
            <div className="flex justify-start items-center gap-2 w-full">
              <h1 className="text-sm font-normal flex justify-center items-center gap-1 capitalize">
                <PiNumberSquareTwo className="text-sm text-yellow-700" /> IFSC{" "}
                {authorDetails?.bank[0].ifsc}
              </h1>
              <h1 className="text-sm font-normal flex justify-center items-center gap-1 capitalize">
                <MdAccountBox className="text-sm text-yellow-700" /> Account No{" "}
                {authorDetails?.bank[0].accountNumber}
              </h1>
            </div>
            <h1 className="font-semibold text-lg border-b-[2px] border-yellow-600">
              Book Details
            </h1>
            <div className="flex justify-start items-center h-full p-2 gap-2">
              <img
                className="w-[120px] h-[150px] rounded-xl"
                src={authorDetails?.books[0].image}
              />
              <div className="flex flex-col justify-start items-start w-full h-full ">
                <h1 className="font-semibold">
                  {authorDetails?.books[0].title}
                </h1>
                <h1 className="font-light">
                  {authorDetails?.books[0].description}
                </h1>
                <h1 className="font-light">{authorDetails?.books[0].genre}</h1>
              </div>
            </div>
          </div>
        </div>
        {currentSelected === 1 && authorDetails && (
          <ExcelUpload
            username={authorDetails?.username || ""}
            excels={authorDetails.excels}
          />
        )}
        {currentSelected === 2 && authorDetails && (
          <UploadUserAgreement
            username={authorDetails.username}
            agreement={authorDetails.agreement}
          />
        )}
      </div>
    </div>
  );
}

function UploadUserAgreement({
  username,
  agreement,
}: {
  username: string;
  agreement: string;
}) {
  const [userAgreement, setUserAgreement] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserAgreement(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    }
  };

  async function handleAgreementUpload() {
    try {
      setUploading(true);
      if (userAgreement) {
        const { data, error } = await supabase.storage
          .from("excel_sheets_dashboard")
          .upload(`user-agreement/${username}/${Date.now()}`, userAgreement);
        if (error) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/excel_sheets_dashboard/${data.path}`;
        if (publicUrl) {
          console.log(publicUrl);
          const res = await fetch(`${API_BASE_URL}/author/upload-agreement`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              url: publicUrl,
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

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="w-2/3 h-full flex justify-start items-center bg-zinc-100 flex-col p-2">
      <div className="w-full flex justify-between gap-2 items-center text-xl border-b-[2px] border-orange-600">
        <div className="flex justify-start items-center gap-2">
          <GrDocumentNotes className="text-xl text-orange-600" /> User Agreement
        </div>
        {!agreement && pdfUrl && (
          <div className="px-2 py-2 cursor-pointer bg-orange-600 rounded-t-xl flex justify-center items-center">
            {uploading ? (
              "Loading..."
            ) : (
              <GrUpload
                onClick={handleAgreementUpload}
                className="text-white text-xl"
              />
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center w-full h-full flex-col gap-2">
        {agreement ? (
          <iframe
            src={agreement}
            className="w-full h-full border-none"
            title="User Agreement PDF"
          />
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            title="User Agreement PDF"
          />
        ) : (
          <div className="cursor-pointer relative flex justify-center items-center">
            <input
              onChange={handleFileChange}
              type="file"
              accept=".pdf, .pdf"
              className="flex justify-center items-center w-full text-sm text-gray-500
            cursor-pointer file:cursor-pointer   file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-orange-100 file:text-orange-700
        hover:file:bg-orange-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminAuthor;
