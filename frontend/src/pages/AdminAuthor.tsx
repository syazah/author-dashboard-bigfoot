import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../util";
import { useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { BiUserPin } from "react-icons/bi";
import ExcelUpload from "../components/Admin/AuthorExcel";
type Author = {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  books: string[];
  bio: string;
  published: string;
  profilePic: string;
  gender: string;
  createdAt: Date;
};
function AdminAuthor() {
  const { id } = useParams();
  const [authorDetails, setAuthorDetails] = useState<Author | null>(null);
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
              <div className="w-[60px] h-[60px] flex justify-center items-center rounded-full bg-zinc-900 shadow-xl cursor-pointer hover:shadow-none transition-all duration-500">
                <FaFileUpload className="text-3xl text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start mt-2">
            <h1 className="text-xl font-semibold ">{authorDetails?.name}</h1>
            <h1 className="text-lg font-normal flex justify-start items-center gap-1">
              <IoMailOutline className="text-yellow-500" />
              {authorDetails?.email}
            </h1>
            <h1 className="text-lg font-normal flex justify-center items-center gap-1">
              <BiUserPin className="text-yellow-500" />
              {authorDetails?.username}
            </h1>
            <h1 className="font-semibold text-lg border-b-[2px] border-yellow-600">
              Bank Details
            </h1>
            <h1 className="font-semibold text-lg border-b-[2px] border-yellow-600">
              Book Details
            </h1>
          </div>
        </div>
        {currentSelected === 1 && <ExcelUpload />}
      </div>
    </div>
  );
}

export default AdminAuthor;
