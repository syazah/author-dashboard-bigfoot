import { BsChevronBarRight, BsSearch } from "react-icons/bs";
import { API_BASE_URL } from "../util";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
type Author = {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  books: string[];
};

function Admin() {
  const [authors, setAuthors] = useState<null | Author[]>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const id = sessionStorage.getItem("token");
  const navigate = useNavigate();
  async function GetAuthors() {
    try {
      const res = await fetch(`${API_BASE_URL}/author/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === true) {
        setAuthors(data.authors);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  }
  async function SearchAuthor() {
    try {
      const res = await fetch(`${API_BASE_URL}/author/search?query=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === true) {
        setAuthors(data.authors);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 3) {
        SearchAuthor();
      } else {
        GetAuthors();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
    if (id) {
      setLoading(true);
      GetAuthors();
      setLoading(false);
    }
  }, [id]);
  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-full h-[100vh] bg-zinc-200 flex flex-col justify-start items-center relative">
      <div className="w-full h-[10vh] flex justify-between items-center p-2 bg-zinc-900">
        <div className="flex justify-center items-center gap-2">
          <img className="w-8 h-8" src="/LOGO2.png" />
          <h1 className="text-base text-white">Bigfoot Publications</h1>
        </div>
        <div className="w-1/4 bg-zinc-950 p-2 rounded-full flex justify-start items-center">
          <BsSearch className="text-yellow-600 text-xl" />
          <input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder="Search Authors"
            className="bg-zinc-950 outline-none text-white w-full ml-1"
          />
        </div>
      </div>
      <div className="h-[90vh] w-full flex flex-col">
        {authors ? (
          <div className="w-full h-full">
            {authors.map((author) => {
              return (
                <div
                  key={author.id}
                  className="w-full h-[10vh] flex justify-between items-center border-b-[1px] border-zinc-300"
                >
                  <div className="flex p-2 gap-4">
                    <h1 className="text-sm font-semibold">{author.name}</h1>
                    <h1 className="text-sm text-zinc-400">
                      @{author.username}
                    </h1>
                    <h1 className="text-sm text-zinc-400">{author.email}</h1>
                  </div>
                  <div
                    onClick={() => navigate(`/admin/author/${author.id}`)}
                    className="w-[100px] cursor-pointer h-full bg-yellow-600 hover:bg-yellow-700 flex justify-center items-center transition-all duration-200"
                  >
                    <BsChevronBarRight className="text-5xl" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            Cannot Get Authors
          </div>
        )}
      </div>
      <div
        onClick={() => {
          sessionStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bottom-2 absolute right-2 bg-red-600 hover:bg-red-800 transition-all duration-200 flex justify-center items-center w-10 h-10 rounded-full cursor-pointer"
      >
        <CiLogout className="text-xl " />
      </div>
    </div>
  );
}

export default Admin;
