import { Dispatch, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../util";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { PiBooksFill } from "react-icons/pi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { IoIosSettings, IoMdAdd } from "react-icons/io";
import Dashboard from "../components/Author/Dashboard";
import Settings from "../components/Author/Settings";
import { HiMiniDocumentText } from "react-icons/hi2";
import { IoAdd } from "react-icons/io5";
import { motion } from "framer-motion";
import { AuthorType } from "./AdminAuthor";
import Agreement from "../components/Author/Agreement";
import Excel from "../components/Author/Excel";
import Book from "../components/Author/Book";
function Author() {
  const { id } = useParams();
  const [author, setAuthor] = useState<null | AuthorType>(null);
  const [selected, setSelected] = useState(0);
  async function GetAuthor() {
    try {
      const res = await fetch(`${API_BASE_URL}/author/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === true) {
        setAuthor(data.author);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    if (id) {
      GetAuthor();
    }
  }, [id]);

  if (!author) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-[100vh] bg-zinc-100 flex justify-start items-center">
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        name={author?.name}
      />
      {sessionStorage.getItem("completed") === "true" ? (
        <div className="w-[94%] h-full">
          {selected === 0 && <Dashboard author={author} />}
          {selected === 1 && <Book author={author} />}
          {selected === 2 && <Excel author={author} />}
          {selected === 3 && <Agreement agreement={author.agreement} />}
          {selected === 4 && <Settings />}
        </div>
      ) : (
        <CompleteDetails author={author} />
      )}
    </div>
  );
}

function Sidebar({
  name,
  selected,
  setSelected,
}: {
  name: string;
  selected: number;
  setSelected: Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="w-[6%] bg-zinc-900 h-full flex flex-col justify-start items-center p-4">
      <div className="w-full h-[80%]">
        <div className="w-12 h-12 rounded-full bg-yellow-600 flex justify-center items-center">
          <h1 className="text-white font-semibold text-3xl cursor-pointer">
            {name.split("")[0]}
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <TbLayoutDashboardFilled
            onClick={() => setSelected(0)}
            className={`text-2xl ${
              selected === 0 ? "text-yellow-600 scale-110" : "text-white"
            } mt-4 cursor-pointer hover:scale-125 transition-all duration-200`}
          />
          <PiBooksFill
            onClick={() => setSelected(1)}
            className={`text-2xl ${
              selected === 1 ? "text-yellow-600 scale-110" : "text-white"
            } mt-4 cursor-pointer hover:scale-125 transition-all duration-200`}
          />
          <RiFileExcel2Fill
            onClick={() => setSelected(2)}
            className={`text-2xl ${
              selected === 2 ? "text-yellow-600 scale-110" : "text-white"
            } mt-4 cursor-pointer hover:scale-125 transition-all duration-200`}
          />
          <HiMiniDocumentText
            onClick={() => setSelected(3)}
            className={`text-2xl ${
              selected === 3 ? "text-yellow-600 scale-110" : "text-white"
            } mt-4 cursor-pointer hover:scale-125 transition-all duration-200`}
          />
        </div>
      </div>
      <div className="w-full h-[20%] flex flex-col justify-end items-center">
        <IoIosSettings
          onClick={() => setSelected(4)}
          className={`text-2xl text-zinc-300 mt-4 cursor-pointer hover:scale-125 transition-all duration-200`}
        />
      </div>
    </div>
  );
}
function CompleteDetails({ author }: { author: AuthorType }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [detailsForm, setDetailForm] = useState({
    name: author.name,
    email: author.email,
    username: author.username,
    gender: "",
    bio: "",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0HJ73OTXpxJwj_WyPS-ptg44zo2fYjiTi7g&s",
    bank: {
      bank: "null",
      accountNumber: "",
      ifsc: "",
      branch: "",
    },
    book: {
      cover:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      title: "",
      genre: "",
      description: "",
    },
  });
  async function getBlobFromUrl(url: string) {
    const response = await fetch(url);
    return await response.blob();
  }
  async function UploadImageCloud(name: string, url: string) {
    try {
      const blob = await getBlobFromUrl(url); // Fetch the Blob from the Blob URL

      const file = new File([blob], `${name}.png`, {
        type: blob.type || "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "jomran93");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/azhmad/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed: ${await res.text()}`);
      }
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  async function updateDetails() {
    const emptyField = Object.values(detailsForm).some((val) => val === "");
    if (emptyField) {
      return alert("All Fields are Required");
    }
    try {
      setUpdatingDetails(true);
      const avatarUrl = await UploadImageCloud(
        `avatar-${author.id}`,
        detailsForm.avatar
      );

      const bookCoverUrl = await UploadImageCloud(
        `book-${author.id}`,
        detailsForm.book.cover
      );
      const finalFormData = {
        ...detailsForm,
        avatar: avatarUrl,
        book: {
          ...detailsForm.book,
          cover: bookCoverUrl,
        },
      };
      const res = await fetch(`${API_BASE_URL}/author/${author.id}/update`, {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify(finalFormData),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("completed", "true");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      setUpdatingDetails(false);
      alert(JSON.stringify(error));
    }
  }
  return (
    <div className="w-full h-full bg-zinc-100 p-4 flex flex-col justify-start items-start">
      <h1 className="text-black font-semibold text-2xl border-b-[1px] border-yellow-600">
        Complete Your Details
      </h1>
      <div className="h-[90vh] w-full mt-2 p-2 flex justify-start items-start gap-6">
        {/* PERSONAL  */}
        {currentPhase >= 0 && (
          <div className="w-1/3 h-full flex flex-col justify-start items-start gap-4">
            <div
              style={{
                backgroundImage: `url(${detailsForm.avatar})`,
              }}
              className="w-32 h-32 rounded-full bg-zinc-200 bg-cover flex justify-center items-center bg-center relative cursor-pointer"
            >
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    const image = URL.createObjectURL(e.target.files[0]);
                    setDetailForm({
                      ...detailsForm,
                      avatar: image,
                    });
                  }
                }}
                type="file"
                className="w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 right-2 bg-yellow-600 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer text-2xl hover:bg-yellow-800">
                <IoMdAdd className="text-zinc-900" />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-0">
              <h1 className="text-black font-normal text-base">
                {author.name}
              </h1>
              <h1 className="text-black font-normal text-base">
                @{author.username}
              </h1>
              <h1 className="text-black font-normal text-base">
                {author.email}
              </h1>
            </div>
            <div className="w-full flex justify-between items-start">
              <h1 className="text-black">Gender</h1>
              <div className="flex justify-center items-center gap-2">
                <div
                  onClick={() =>
                    setDetailForm({ ...detailsForm, gender: "MALE" })
                  }
                  className={`w-6 h-6 ${
                    detailsForm.gender === "MALE"
                      ? "bg-yellow-600 text-white"
                      : "bg-zinc-200 text-black"
                  } rounded-full  flex justify-center items-center cursor-pointer`}
                >
                  M
                </div>
                <div
                  onClick={() =>
                    setDetailForm({ ...detailsForm, gender: "FEMALE" })
                  }
                  className={`w-6 h-6 ${
                    detailsForm.gender === "FEMALE"
                      ? "bg-yellow-600 text-white"
                      : "bg-zinc-200 text-black"
                  } rounded-full  flex justify-center items-center cursor-pointer`}
                >
                  F
                </div>
              </div>
            </div>
            <textarea
              value={detailsForm.bio}
              onChange={(e) =>
                setDetailForm({ ...detailsForm, bio: e.target.value })
              }
              placeholder="Bio"
              className="resize-none bg-zinc-200 h-[180px] w-full rounded-xl text-black p-2 outline-none"
            />
            <div className="w-full p-2 flex justify-end items-center">
              <button
                onClick={() => setCurrentPhase(1)}
                className="bg-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-700 transition-all duration-200"
              >
                Bank Details
              </button>
            </div>
          </div>
        )}
        {/* BANK  */}
        {currentPhase >= 1 && (
          <motion.div
            initial={{ x: -1000, opacity: 0 }}
            animate={{
              x: currentPhase >= 1 ? 0 : -1000,
              opacity: currentPhase >= 1 ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="w-1/3 h-full flex flex-col justify-between items-start bg-zinc-100"
          >
            <div className="flex flex-col w-full gap-4">
              <h1 className="border-b-[1px] border-yellow-500">
                Banking Details
              </h1>
              <select
                value={detailsForm.bank.bank}
                onChange={(e) => {
                  setDetailForm({
                    ...detailsForm,
                    bank: { ...detailsForm.bank, bank: e.target.value },
                  });
                }}
                className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
              >
                <option value="null">Select Your Bank</option>
                <option value="axis">Axis</option>
                <option value="hdfc">HDFC</option>
                <option value="icici">ICICI</option>
              </select>
              <input
                value={detailsForm.bank.accountNumber}
                onChange={(e) => {
                  setDetailForm({
                    ...detailsForm,
                    bank: {
                      ...detailsForm.bank,
                      accountNumber: e.target.value,
                    },
                  });
                }}
                placeholder="Account Number"
                className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
              />
              <input
                value={detailsForm.bank.ifsc}
                onChange={(e) => {
                  setDetailForm({
                    ...detailsForm,
                    bank: { ...detailsForm.bank, ifsc: e.target.value },
                  });
                }}
                placeholder="IFSC Code"
                className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
              />
              <input
                value={detailsForm.bank.branch}
                onChange={(e) => {
                  setDetailForm({
                    ...detailsForm,
                    bank: { ...detailsForm.bank, branch: e.target.value },
                  });
                }}
                placeholder="Branch Name"
                className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
              />
            </div>
            <div className="w-full flex justify-end items-center p-2">
              <button
                onClick={() => setCurrentPhase(2)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-all duration-200 rounded-full"
              >
                Add Book
              </button>
            </div>
          </motion.div>
        )}
        {/* BOOK  */}
        {currentPhase >= 2 && (
          <motion.div
            initial={{ x: -1000, opacity: 0 }}
            animate={{
              x: currentPhase >= 2 ? 0 : -1000,
              opacity: currentPhase >= 2 ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="w-1/3 flex flex-col justify-start items-start gap-4"
          >
            <h1 className="border-b-[1px] border-yellow-500">Book Details</h1>
            <div
              style={{ backgroundImage: `url(${detailsForm.book.cover})` }}
              className={`w-1/2 h-[200px] bg-zinc-200 hover:brightness-75 transition-all duration-200 relative flex flex-col justify-center items-center bg-cover bg-center`}
            >
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    const image = URL.createObjectURL(e.target.files[0]);
                    setDetailForm({
                      ...detailsForm,
                      book: { ...detailsForm.book, cover: image },
                    });
                  }
                }}
                type="file"
                className="opacity-0 w-full h-full cursor-pointer  absolute z-10 top-0 left-0"
              />
              <IoAdd className="text-2xl" />
              <h1 className="text-sm">Add Cover Image</h1>
            </div>
            <input
              onChange={(e) => {
                setDetailForm({
                  ...detailsForm,
                  book: { ...detailsForm.book, title: e.target.value },
                });
              }}
              placeholder="Book Title"
              className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
            />
            <input
              onChange={(e) => {
                setDetailForm({
                  ...detailsForm,
                  book: { ...detailsForm.book, genre: e.target.value },
                });
              }}
              placeholder="Genre"
              className="bg-zinc-200 outline-none text-black rounded-full w-full p-2"
            />

            <textarea
              value={detailsForm.book.description}
              onChange={(e) => {
                setDetailForm({
                  ...detailsForm,
                  book: { ...detailsForm.book, description: e.target.value },
                });
              }}
              placeholder="description"
              className="resize-none bg-zinc-200 h-[80px] w-full rounded-xl text-black p-2 outline-none"
            />
            <div className="w-full flex justify-end items-center p-2">
              <button
                onClick={updateDetails}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition-all duration-200 rounded-full"
              >
                {updatingDetails ? "Updating..." : "Save Details"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Author;
